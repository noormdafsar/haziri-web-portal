import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Pagination } from '../../component/pagination/pagination';
import { AlertService } from "../../service/alert.service";
import { finalize } from "rxjs";
import { AttendenceService } from "../../service/attendence.service";
import { AttendanceDTO } from "../../models/attendence.models";
import { EmployeeDataTableArg } from "../../models/employee.models"; 
import moment from "moment";

@Component({
    selector: 'app-attendence-details',
    standalone: true,
    imports: [CommonModule, Pagination],
    templateUrl: './attendence-details.html',
})
export class AttendenceDetails implements OnInit, OnChanges {
    private _attendanceService = inject(AttendenceService);
    private _alertService = inject(AlertService);

    @Input() employeeId: number | null = null;
    @Output() close = new EventEmitter<void>();

    mentorName = signal<string>('');

    attendances = signal<AttendanceDTO[]>([]);
    isLoading = signal<boolean>(false);
    isDownloading = signal<boolean>(false);

    // Pagination
    currentPage = signal<number>(1);
    totalPages = signal<number>(1);
    totalItems = signal<number>(0);
    itemsPerPage = 10;

    // Search
    searchQuery = signal<string>('');

    ngOnInit(): void {
        if (this.employeeId) {
            this.loadAttendance(this.employeeId);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userId'] && !changes['userId'].firstChange && this.employeeId) {
            this.loadAttendance(this.employeeId);
        }
    }

    loadAttendance(userId: number): void {
        this.isLoading.set(true);

        const request: EmployeeDataTableArg = { 
            pageNo: this.currentPage(),
            pageLength: this.itemsPerPage,
            search: null // Search functionality can be added here if needed later
        };

        this._attendanceService.getAttendanceList(userId, request)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: (res) => {
                    if (res.success && res.data) {
                        this.attendances.set(res.data.data);
                        this.totalItems.set(res.data.totalRecords);
                        this.totalPages.set(Math.ceil(res.data.totalRecords / this.itemsPerPage)); 
                        // Set mentor name from the first record if available
                        if (res.data.data.length > 0 && res.data.data[0].userName) {
                            this.mentorName.set(res.data.data[0].userName);
                        } else if (this.mentorName() === '') {
                            this.mentorName.set('User'); // Fallback name
                        }
                    } else {
                        this.attendances.set([]);
                        this.totalItems.set(0);
                        this.totalPages.set(1);
                        // No alert needed, the UI will show the "No records" message.
                    }
                },
                error: (err) => this._alertService.error('API Error', err.message || 'An unknown error occurred.')
            })
    }

    onPageChange(page: number): void {
        this.currentPage.set(page);
        if (this.employeeId) {
            this.loadAttendance(this.employeeId);
        }
    }

    downloadExcel(): void {
        if (!this.employeeId) {
            this._alertService.warning('Cannot Download', 'User ID is not available.');
            return;
        }

        this.isDownloading.set(true);
        const request: EmployeeDataTableArg = {
            pageNo: 1,
            pageLength: this.totalItems() || 10000, // Fetch all records
            search: null
        };

        this._attendanceService.getAttendenceListExcel(this.employeeId, request)
            .pipe(finalize(() => this.isDownloading.set(false)))
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Attendance_${this.mentorName()}_${moment().format('YYYY-MM-DD')}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this._alertService.success('Success', 'Attendance report has been downloaded.');
                },
                error: () => this._alertService.error('Download Failed', 'Could not download the attendance report.')
            });
    }
}
