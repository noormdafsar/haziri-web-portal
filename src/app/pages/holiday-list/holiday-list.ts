import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Observable } from 'rxjs'; 
import moment from 'moment';
import { AlertService } from "../../service/alert.service";
import { APIResponse } from "../../models/api-response-models";
import { HolidayDTO } from "../../models/holiday-list.model";
import { HolidayService } from "../../service/holiday-list.service";
import { ConfirmService } from "../../service/confirm.service";

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    holiday?: HolidayDTO;
}

@Component({
    selector: 'app-holiday-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './holiday-list.html',
})
export class HolidayListComponent implements OnInit {
    private _holidayService = inject(HolidayService);
    private _alertService = inject(AlertService);
    private _confirmService = inject(ConfirmService);
    private _fb = inject(FormBuilder);

    // State Signals
    isLoading = signal<boolean>(false);
    holidays = signal<HolidayDTO[]>([]);
    currentDate = signal(moment());
    isModalOpen = signal(false);
    editingHoliday = signal<HolidayDTO | null>(null);

    holidayForm = this._fb.group({
        holidayName: ['', Validators.required],
        holidayDate: ['', Validators.required],
    });

    // Computed Signals
    calendarDays = computed(() => this.generateCalendarDays(this.currentDate().toDate()));
    currentMonthDisplay = computed(() => this.currentDate().format('MMMM YYYY'));

    ngOnInit(): void {
        this.loadHolidays();
    }

    private loadHolidays(): void {
        this.isLoading.set(true);
        this._holidayService.getAllHolidays()
            .subscribe({
                next: res => {
                    if (res.success && res.data) {
                        this.holidays.set(res.data);
                    } else {
                        this.holidays.set([]);
                        this._alertService.error('Info', res.message || 'Could not load holidays.');
                    }
                    this.isLoading.set(false);
                },
                error: err => {
                    this.holidays.set([]);
                    this._alertService.error('API Error', err.message || 'An error occurred while fetching holidays.');
                    this.isLoading.set(false);
                }
            });
    }

    private generateCalendarDays(date: Date): CalendarDay[] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

        const days: CalendarDay[] = []; 
        const today = moment().toDate();
        today.setHours(0, 0, 0, 0);

        const holidaysMap = new Map(this.holidays().map(h => [new Date(h.holidayDate).toDateString(), h]));

        for (let i = 0; i < 42; i++) {
            const calendarDate = new Date(startDate);
            calendarDate.setDate(startDate.getDate() + i);
            const holiday = holidaysMap.get(calendarDate.toDateString());

            days.push({
                date: calendarDate,
                isCurrentMonth: calendarDate.getMonth() === month,
                isToday: calendarDate.getTime() === today.getTime(),
                holiday: holiday
            });
        }
        return days;
    }

    changeMonth(offset: number): void {
        const newDate = this.currentDate().clone().add(offset, 'months');
        this.currentDate.set(newDate);
    }

    goToToday(): void {
        this.currentDate.set(moment());
    }

    openModal(holiday: HolidayDTO | null = null, date?: Date): void {
        this.holidayForm.reset();
        this.editingHoliday.set(holiday);
        if (holiday) {
            this.holidayForm.setValue({
                holidayName: holiday.holidayName,
                holidayDate: holiday.holidayDate.split('T')[0] // Format for input[type=date]
            });
        } else if (date) {
            this.holidayForm.patchValue({
                holidayDate: date.toISOString().split('T')[0]
            });
        }
        this.isModalOpen.set(true);
    }

    closeModal(): void {
        this.isModalOpen.set(false);
        this.editingHoliday.set(null);
    }

    saveHoliday(): void {
        if (this.holidayForm.invalid) {
            this._alertService.warning('Invalid Form', 'Please fill in all required fields.');
            return;
        }

        const formValue = this.holidayForm.value;
        const holidayData = {
            holidayName: formValue.holidayName!,
            holidayDate: formValue.holidayDate! // Already in "YYYY-MM-DD" format from input[type=date]
        };

        this.isLoading.set(true);
        const editingHoliday = this.editingHoliday();
        const saveOperation = (editingHoliday
            ? this._holidayService.updateHoliday(editingHoliday.id, holidayData)
            : this._holidayService.createHoliday(holidayData)) as Observable<APIResponse<number | boolean>>;

        saveOperation.subscribe({ // This will now resolve correctly
            next: (res: { success: any; message: string; }) => {
                if (res.success) {
                    this._alertService.success('Success', res.message);
                    this.closeModal();
                    this.loadHolidays();
                } else {
                    this._alertService.error('Error', res.message);
                    this.isLoading.set(false);
                }
            },
            error: (err: { message: any; }) => {
                this._alertService.error('API Error', err.message || 'Failed to save holiday.');
                this.isLoading.set(false);
            }
        });
    }

    deleteHoliday(id: number): void {
        this._confirmService.show('Delete Holiday', 'Are you sure you want to delete this holiday?', 'Delete', 'Cancel', 'danger').subscribe(confirmed => {
            if (confirmed) {
                this.isLoading.set(true);
                this._holidayService.deleteHoliday(id)
                    .subscribe({
                        next: res => {
                            if (res.success) {
                                this._alertService.success('Deleted', res.message);
                                this.loadHolidays(); // This will handle its own loading state
                            } else {
                                this._alertService.error('Error', res.message);
                                this.isLoading.set(false);
                            }
                        },
                        error: err => {
                            this._alertService.error('API Error', err.message || 'Failed to delete holiday.');
                            this.isLoading.set(false);
                        }
                    });
            }
        });
    }
}