// src/app/pages/leave-request-details/leave-request-details.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../component/pagination/pagination';
import { LeaveRequestDetails, LeaveRequestDataTableArg, LeaveBalance } from '../../models/leave-request-details.models';
import { LeaveRequestService } from '../../service/leave-request-details.service';
import { AlertService } from '../../service/alert.service';
import { ConfirmService } from '../../service/confirm.service'; // Import ConfirmService
import { take } from 'rxjs';
import moment from 'moment';

@Component({
    selector: 'app-leave-request-details',
    standalone: true,
    imports: [CommonModule, FormsModule, Pagination],
    templateUrl: './leave-request-details.html',
    styleUrls: ['./leave-request-details.scss'],
})
export class LeaveRequestDetailsComponent implements OnInit {
    private _leaveRequestService = inject(LeaveRequestService);
    private _alertService = inject(AlertService);
    private _confirmService = inject(ConfirmService);

    // Total Leave balance (as per mrittika bhawan leave document list) 
    private readonly LEAVE_BALANCE_TOTALS: Record<string, number> = {
        'CASUAL': 14,
        'EARNED': 30,
        'MEDICAL': 10,
        'QUARANTINE': 21,
        'MATERNITY': 180
    };

    // Signals for state management
    leaveRequests = signal<LeaveRequestDetails[]>([]);
    allLeaveRequests = signal<LeaveRequestDetails[]>([]); // To hold the master list for the current page
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    isDownloading = signal<boolean>(false);
    isLoadingBalance = signal<boolean>(false);

    // Modal State
    showBalanceModal = signal<boolean>(false);
    selectedEmployeeForBalance = signal<LeaveRequestDetails | null>(null);
    employeeLeaveBalances = signal<LeaveBalance[] | null>(null);

    // Modal State for Description
    showDescriptionModal = signal<boolean>(false);
    selectedLeaveForDescription = signal<LeaveRequestDetails | null>(null);

    // Pagination
    currentPage = signal<number>(1);
    totalPages = signal<number>(1);
    itemsPerPage = signal<number>(10);
    totalRecords = signal<number>(0);

    // Filters
    searchQuery = signal<string>('');
    selectedStatus = signal<string>(''); // All, Pending, Approved, Rejected
    selectedStartDate = signal<string>('');
    selectedEndDate = signal<string>('');

    maxDate: string = moment().format('YYYY-MM-DD');

    ngOnInit(): void {
        this.loadLeaveRequests();
    }

    /**
     * Loads leave requests from the backend based on current filters and pagination.
     */
    loadLeaveRequests(): void {
        this.isLoading.set(true);

        const search: { [key: string]: any } = {};
        if (this.searchQuery()) {
            search['searchText'] = this.searchQuery();
        }
        if (this.selectedStatus()) {
            search['approvalStatus'] = this.selectedStatus();
        }
        if (this.selectedStartDate()) {
            search['startDate'] = this.selectedStartDate();
        }
        if (this.selectedEndDate()) {
            search['endDate'] = this.selectedEndDate();
        }

        const request: LeaveRequestDataTableArg = {
            pageNo: this.currentPage(),
            pageLength: this.itemsPerPage(),
            search: Object.keys(search).length > 0 ? search : null
        };

        this._leaveRequestService.getLeaveRequests(request).subscribe({
            next: res => {
                if (res.success && res.data) {
                    const formattedData = res.data.data.map(leave => ({
                        ...leave,
                        employeeId: leave.employeeId, // Ensure employeeId is mapped
                        startDate: moment(leave.startDate).format('DD/MM/YYYY (dddd)'),
                        endDate: moment(leave.endDate).format('DD/MM/YYYY (dddd)'),
                        requestDate: moment(leave.requestDate).format('DD/MM/YYYY')
                    }));
                    this.allLeaveRequests.set(formattedData);
                    this.leaveRequests.set(formattedData);
                    this.totalRecords.set(res.data.totalRecords);
                    this.totalPages.set(Math.ceil(res.data.totalRecords / this.itemsPerPage()));
                    this.applyFilters();
                } else {
                    this.leaveRequests.set([]);
                    this.totalRecords.set(0);
                    this.totalPages.set(1);
                    this._alertService.error('Load Failed', res.message);
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                this._alertService.error('Load Failed', err.error?.message || 'Could not fetch leave requests.');
            },
            complete: () => this.isLoading.set(false)
        });
    }

    onSearch(): void {
        this.currentPage.set(1);
        this.applyFilters();
    }

    onClearSearch(): void {
        this.searchQuery.set('');
        this.selectedStatus.set('');
        this.selectedStartDate.set('');
        this.selectedEndDate.set('');
        this.currentPage.set(1);
        this.applyFilters();
    }

    onPageChange(page: number): void {
        this.currentPage.set(page);
        this.loadLeaveRequests();
    }

    onItemsPerPageChange(count: number): void {
        this.itemsPerPage.set(count);
        this.currentPage.set(1);
        this.loadLeaveRequests();
    }

    /**
     * Filters leave requests on the frontend based on search, status, and date range.
     */
    applyFilters(): void {
        let filteredData = this.allLeaveRequests();
        const query = this.searchQuery().toLowerCase().trim();
        const status = this.selectedStatus();
        const startDate = this.selectedStartDate();
        const endDate = this.selectedEndDate();

        // Filter by search query
        if (query) {
            filteredData = filteredData.filter(req =>
                req.employeeName.toLowerCase().includes(query) ||
                req.leaveDescription.toLowerCase().includes(query) ||
                req.startDate.toLowerCase().includes(query) ||
                req.endDate.toLowerCase().includes(query) ||
                req.leaveDays.toString().includes(query) ||
                req.approvalStatus.toLowerCase().includes(query) ||
                req.balance.toString().includes(query)
            );
        }

        // Filter by status
        if (status) {
            filteredData = filteredData.filter(req => req.approvalStatus === status);
        }

        // Filter by date range
        if (startDate && endDate) {
            const start = moment(startDate);
            const end = moment(endDate);
            filteredData = filteredData.filter(req => {
                const reqStart = moment(req.startDate);
                const reqEnd = moment(req.endDate);
                return reqStart.isSameOrBefore(end) && reqEnd.isSameOrAfter(start);
            });
        }

        this.leaveRequests.set(filteredData);
    }

    /**
     * Updates the status of a leave request to 'Approved' or 'Rejected'.
     * @param leaveRequest - The leave request to update.
     * @param status - The new status.
     */
    updateStatus(leaveRequest: LeaveRequestDetails, status: 'Approved' | 'Rejected'): void {
        this.isSubmitting.set(true);
        this._leaveRequestService.updateLeaveStatus(leaveRequest.id, { approvalStatus: status }).subscribe({
            next: () => {
                this._alertService.success('Success', `Leave request has been ${status.toLowerCase()}.`);
                this.loadLeaveRequests();
            },
            error: (error) => {
                const errorMessage = error?.error?.message || `Failed to ${status.toLowerCase()} the leave request.`;
                this._alertService.error('Update Failed', errorMessage);
                this.isSubmitting.set(false);
            },
            complete: () => this.isSubmitting.set(false),
        });
    }

    /**
     * Returns a Tailwind CSS class based on the approval status.
     * @param status - The approval status.
     * @returns A string of CSS classes.
     */
    getStatusClass(status: string): string {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'Pending':
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        }
    }

    downloadExcel(): void {

        this.isDownloading.set(true);

        const request: LeaveRequestDataTableArg = {
            pageNo: 1, // For Excel export, we typically want all records, so start from page 1
            pageLength: this.totalRecords() || 10000, // Request a large number to get all records
            search: null
        };

        this._leaveRequestService.getLeaveRequestsExcel(request)
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob as Blob); // Cast to Blob
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `LeaveRequests_${moment().format('YYYY-MM-DD')}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this._alertService.success('Success', 'Leave Requests report has been downloaded.');
                },
                error: (err) => this._alertService.error('Download Failed',err.error?.message || 'Could not download the Leave Requests report.'),
                complete: () => this.isDownloading.set(false)
            });
    }

    /**
     * Opens the leave balance modal and fetches the balance details for the selected employee.
     * @param leaveRequest - The leave request item containing the employee details.
     */
    viewBalanceDetails(leaveRequest: LeaveRequestDetails): void {
        this.selectedEmployeeForBalance.set(leaveRequest);
        this.showBalanceModal.set(true);
        this.isLoadingBalance.set(true);
        this.employeeLeaveBalances.set(null); // Clear previous balances

        if (!leaveRequest.employeeId) {
            this._alertService.error('Error', 'Employee ID is missing, cannot fetch balance.');
            this.isLoadingBalance.set(false);
            return;
        }

        this._leaveRequestService.getLeaveBalance(leaveRequest.employeeId).subscribe({
            next: res => {
                if (res.success && res.data) {
                    console.log(res.data);
                    const balances: LeaveBalance[] = res.data.map(item => ({
                        leaveType: item.leaveType,
                        totalBalance: this.LEAVE_BALANCE_TOTALS[item.leaveType] ?? 0, // Map 'days' to 'totalBalance'
                        balance: item.balance ?? 0 // Map 'days' to 'balance'
                    }));
                    this.employeeLeaveBalances.set(balances.length > 0 ? balances : []);
                } else {
                    this._alertService.error('Error', 'Could not fetch leave balances.');
                }
            },
            error: (err) => this._alertService.error('API Error', err.error?.message || 'Failed to fetch leave balance details.'),
            complete: () => this.isLoadingBalance.set(false)
        });
    }

    closeBalanceModal(): void {
        this.showBalanceModal.set(false);
        this.selectedEmployeeForBalance.set(null);
        this.employeeLeaveBalances.set(null);
    }

    /**
     * Opens the leave description modal.
     * @param leaveRequest - The leave request item to show the description for.
     */
    viewDescription(leaveRequest: LeaveRequestDetails): void {
        this.selectedLeaveForDescription.set(leaveRequest);
        this.showDescriptionModal.set(true);
    }

    closeDescriptionModal(): void {
        this.showDescriptionModal.set(false);
        this.selectedLeaveForDescription.set(null);
    }
}
