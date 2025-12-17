import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../service/alert.service';

import { DashboardService } from '../../service/dashboard.service';
import { LateArrival, LateCheckout, LateEmployeeSummary, SummaryCounts } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private _dashboardService = inject(DashboardService);
  private _alertService = inject(AlertService);

  isLoading = signal<boolean>(true);
  isLoadingModal = signal<boolean>(false);
  showPendingLeavesModal = signal<boolean>(false);
  showForgotCheckoutModal = signal<boolean>(false);
  isLoadingForgotCheckoutModal = signal<boolean>(false);
  showLateArrivalsModal = signal<boolean>(false);
  isLoadingLateArrivalsModal = signal<boolean>(false);
  pendingLeaveRequests = signal<any[]>([]); // Consider creating a model for this
  forgotCheckoutList = signal<LateCheckout[]>([]);
  lateEmployeesList = signal<LateEmployeeSummary[]>([]);
  lateArrivalsList = signal<LateArrival[]>([]);

  summaryCounts = signal<SummaryCounts>({
    onlineVisits: 0,
    offlineVisits: 0,
    forgotCheckout: 0,
    totalOtherActivities: 0,
    lateArrivals: 0,
    pendingLeaves: 0
  });

  upcomingHolidays = [
    { name: 'Diwali', date: 'Nov 01, 2025' },
    { name: 'Guru Nanak Jayanti', date: 'Nov 15, 2025' },
    { name: 'Christmas Day', date: 'Dec 25, 2025' },
    { name: 'New Year\'s Day', date: 'Jan 01, 2026' },
    { name: 'Republic Day', date: 'Jan 26, 2026' }
  ];

  ngOnInit() {
    this.isLoading.set(true);

    // Set mock data for general stats
    const mockSummaryData = {
        onlineVisits: 125,
        offlineVisits: 30,
        forgotCheckout: 0,
        totalOtherActivities: 88,
        lateArrivals: 0,
        pendingLeaves: 0 // Initialize with 0
    };
    this.summaryCounts.set(mockSummaryData);

    // Fetch summary counts individually
    this._dashboardService.getPendingLeaves()
      .pipe(catchError(() => {
        this._alertService.warning('Count Failed', 'Could not fetch pending leave count.');
        return of({ success: false, data: { totalRecords: 0 } });
      }))
      .subscribe(res => {
        if (res.success && res.data) {
          this.summaryCounts.update(counts => ({ ...counts, pendingLeaves: res.data?.totalRecords || 0 }));
        }
      });

    this._dashboardService.getForgetCheckInOuts()
      .pipe(catchError(() => {
        this._alertService.warning('Count Failed', 'Could not fetch late checkout count.');
        return of({ success: false, data: { Count: 0 } });
      }))
      .subscribe(res => {
        if (res.success && res.data) {
          this.summaryCounts.update(counts => ({ ...counts, forgotCheckout: res.data?.Count || 0 }));
        }
      });

    this._dashboardService.getLateArrivals()
      .pipe(catchError(() => {
        this._alertService.warning('Count Failed', 'Could not fetch late arrivals count.');
        return of({ success: false, data: { count: 0 } });
      }))
      .subscribe(res => {
        if (res.success && res.data) {
          this.summaryCounts.update(counts => ({ ...counts, lateArrivals: res.data?.count || 0 }));
        }
      });

    // Fetch Monthly Late Report
    this._dashboardService.getMonthlyLateReport().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.lateEmployeesList.set(res.data);
        }
      },
      error: () => this._alertService.error('Error', 'Failed to load late attendance report.')
    });
  }

    openPendingLeavesModal() {
    this.showPendingLeavesModal.set(true);
    this.isLoadingModal.set(true);
    this.pendingLeaveRequests.set([]);

    this._dashboardService.getPendingLeaves().subscribe({
      next: (res) => {
        if (res.success && res.data?.data) {
          this.pendingLeaveRequests.set(res.data.data);
        }
      },
      error: (err) => this._alertService.error('Load Failed', err.error?.message || 'Could not fetch pending leave requests.'),
      complete: () => this.isLoadingModal.set(false)
    });
  }

  closePendingLeavesModal() {
    this.showPendingLeavesModal.set(false);
  }

  openForgotCheckoutModal() {
    this.showForgotCheckoutModal.set(true);
    this.isLoadingForgotCheckoutModal.set(true);
    this.forgotCheckoutList.set([]);

    this._dashboardService.getForgetCheckInOuts().subscribe({
      next: (res) => {
        if (res.success && res.data?.Data) {
          this.forgotCheckoutList.set(res.data.Data);
        }
      },
      error: (err) => this._alertService.error('Load Failed', err.error?.message || 'Could not fetch late checkout list.'),
      complete: () => {
        this.isLoadingForgotCheckoutModal.set(false);
      }
    });
  }

  closeForgotCheckoutModal() {
    this.showForgotCheckoutModal.set(false);
  }

  openLateArrivalsModal() {
    this.showLateArrivalsModal.set(true);
    this.isLoadingLateArrivalsModal.set(true);
    this.lateArrivalsList.set([]);

    this._dashboardService.getLateArrivals().subscribe({
      next: (res) => {
        if (res.success && res.data?.data) {
          this.lateArrivalsList.set(res.data.data);
        }
      },
      error: (err) => this._alertService.error('Load Failed', err.error?.message || 'Could not fetch late arrivals list.'),
      complete: () => {
        this.isLoadingLateArrivalsModal.set(false);
      }
    });
  }

  closeLateArrivalsModal() {
    this.showLateArrivalsModal.set(false);
  }
}
