import { Component, OnInit, ViewChild, signal, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../../service/alert.service';

import moment from 'moment';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { LateCheckout, SummaryCounts } from './dashboard.models';
import { LeaveRequestService } from '../../service/leave-request-details.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('gpVisitChart') gpVisitChart!: ChartComponent; // Reference to the first chart
  @ViewChild('otherActivityChart') otherActivityChart!: ChartComponent; // Reference to the second chart

  private _dashboardService = inject(DashboardService);
  private _leaveRequestService = inject(LeaveRequestService); // Uncommented to fetch pending leaves
  public gpVisitChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    colors: string[];
    fill: ApexFill;
    plotOptions: ApexPlotOptions;
  } | any;
  public otherActivityChartOptions: { // New chart options for other activities
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    colors: string[];
    plotOptions: ApexPlotOptions;
  } | any;
  private _alertService = inject(AlertService);

  isLoading = signal<boolean>(true);
  isLoadingModal = signal<boolean>(false);
  showPendingLeavesModal = signal<boolean>(false);
  showForgotCheckoutModal = signal<boolean>(false);
  isLoadingForgotCheckoutModal = signal<boolean>(false);
  pendingLeaveRequests = signal<any[]>([]); // Consider creating a model for this
  forgotCheckoutList = signal<LateCheckout[]>([]);

  summaryCounts = signal<SummaryCounts>({
    onlineVisits: 0,
    offlineVisits: 0,
    forgotCheckout: 0,
    totalOtherActivities: 0,
    otherVirtualMeetings: 0,
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
        otherVirtualMeetings: 42,
        pendingLeaves: 0 // Initialize with 0
    };
    this.summaryCounts.set(mockSummaryData);

    // Fetch summary counts individually
    this._leaveRequestService.getLeaveRequests({ pageNo: 1, pageLength: 1, search: { approvalStatus: 'Pending' } })
      .pipe(catchError(() => {
        this._alertService.warning('Count Failed', 'Could not fetch pending leave count.');
        return of({ success: false, data: { totalRecords: 0 } });
      }))
      .subscribe(res => {
        if (res.success && res.data) {
          this.summaryCounts.update(counts => ({ ...counts, pendingLeaves: res.data?.totalRecords || 0 }));
        }
      });

    this._dashboardService.getLateGPCheckouts()
      .pipe(catchError(() => {
        this._alertService.warning('Count Failed', 'Could not fetch late checkout count.');
        return of({ success: false, data: { Count: 0 } });
      }))
      .subscribe(res => {
        if (res.success && res.data) {
          this.summaryCounts.update(counts => ({ ...counts, forgotCheckout: res.data?.Count || 0 }));
        }
      });
  }

  ngAfterViewInit(): void {
      this.loadChartData();
  }

    openPendingLeavesModal() {
    this.showPendingLeavesModal.set(true);
    this.isLoadingModal.set(true);
    this.pendingLeaveRequests.set([]);

    const request = {
      pageNo: 1,
      pageLength: 100, // Fetch up to 100 pending requests for the modal
      search: { approvalStatus: 'Pending' }
    };

    this._leaveRequestService.getLeaveRequests(request).subscribe({
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

    this._dashboardService.getLateGPCheckouts().subscribe({
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
  
  // This method was missing, adding a basic implementation.
  // The loadApexCharts method is no longer needed as we are using npm package.

  private loadChartData() {
    const endDate = moment();
    const startDate = moment().subtract(6, 'days');
    const request = {
      pageNo: 1,
      pageLength: 10000, // Fetch all records for the date range
      search: {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      }
    };

  }

  private processVisitDataForChart(visitLogs: any[], activityLogs: any[], meetingLogs: any[]) {
    const categories: string[] = [];
    const online: number[] = [];
    const offline: number[] = [];
    const activities: number[] = [];
    const meetings: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      categories.push(date.format('ddd')); // e.g., 'Mon', 'Tue'
      online.push(0);
      offline.push(0);
      activities.push(0);
      meetings.push(0);
    }

    // Process GP Visits
    visitLogs.forEach(log => {
      const logDate = moment(log.gpinTime);
      const diffDays = moment().startOf('day').diff(logDate.startOf('day'), 'days');
      if (diffDays >= 0 && diffDays < 7) {
        const index = 6 - diffDays;
        if (log.isOnline) {
          online[index]++;
        } else {
          offline[index]++;
        }
      }
    });

    // Process Other Activities
    activityLogs.forEach(log => {
      const logDate = moment(log.startTime);
      const diffDays = moment().startOf('day').diff(logDate.startOf('day'), 'days');
      if (diffDays >= 0 && diffDays < 7) {
        activities[6 - diffDays]++;
      }
    });

    // Process Virtual Meetings
    meetingLogs.forEach(log => {
      const logDate = moment(log.startTime);
      const diffDays = moment().startOf('day').diff(logDate.startOf('day'), 'days');
      if (diffDays >= 0 && diffDays < 7) {
        meetings[6 - diffDays]++;
      }
    });

    return { categories, online, offline, activities, meetings };
  }

  private initGpVisitsChart(categories: string[], onlineData: number[], offlineData: number[]) {
    this.gpVisitChartOptions = { // Assign to gpVisitChartOptions
      series: [
        { name: 'Online Visits', data: onlineData }, // Changed name for clarity
        { name: 'Offline Visits', data: offlineData } // Changed name for clarity
      ],
      chart: {
        type: 'bar',
        height: 350, // Adjusted height for two charts
        toolbar: { show: false },
        background: 'transparent',
        zoom: { enabled: false },
        stacked: true,
        // Removed fill type gradient as it's a bar chart
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
        },
      },
      colors: ['#10b981', '#facc15'], // Green, Yellow
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: categories,
        labels: { style: { colors: '#9ca3af' } }
      },
      yaxis: {
        labels: {
          style: { colors: '#9ca3af' },
          formatter: (val: number) => val.toString()
        }
      },
      grid: {
        borderColor: 'rgba(156, 163, 175, 0.3)',
        strokeDashArray: 3
      },
      legend: {
        position: 'top',
        labels: { colors: '#4b5563', useSeriesColors: false }
      }
    };
  }

  private initOtherActivitiesChart(categories: string[], activityData: number[], meetingData: number[]) {
    this.otherActivityChartOptions = { // Assign to otherActivityChartOptions
      series: [
        { name: 'Other Activities', data: activityData },
        { name: 'Virtual Meetings', data: meetingData }
      ],
      chart: {
        type: 'bar',
        height: 350, // Adjusted height for two charts
        toolbar: { show: false },
        background: 'transparent',
        zoom: { enabled: false },
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
        },
      },
      colors: ['#3b82f6', '#8b5cf6'], // Blue, Purple
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: categories,
        labels: { style: { colors: '#9ca3af' } }
      },
      yaxis: {
        labels: {
          style: { colors: '#9ca3af' },
          formatter: (val: number) => val.toString()
        }
      },
      grid: {
        borderColor: 'rgba(156, 163, 175, 0.3)',
        strokeDashArray: 3
      },
      legend: {
        position: 'top',
        labels: { colors: '#4b5563', useSeriesColors: false }
      }
    };
  }
}
