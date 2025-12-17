import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexStroke, ApexXAxis, ApexYAxis } from "ng-apexcharts";
import { APIResponse } from "../models/api-response-models";

export interface DashboardSummaryCounts {
  onlineVisits: number;
  offlineVisits: number;
  forgotCheckout: number;
  totalOtherActivities: number;
  lateArrivals: number;
  pendingLeaves: number;
}

export interface ForgotCheckoutItem {
  userId: string;
  UserName: string;
  Gpid: string;
  GpName: string;
}

export interface ChartOptions {
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
}
export interface SummaryCounts {
  onlineVisits: number;
  offlineVisits: number;
  forgotCheckout: number;
  totalOtherActivities: number;
  lateArrivals: number;
  pendingLeaves: number;
}

export interface LateCheckout {
  userId: string;
  userName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
}

export type LateCheckoutApiResponse = APIResponse<{ Data: LateCheckout[], Count: number }>;

export interface PendingLeaveRequest {
  id: number;
  userName: string;
  startDate: string;
  endDate: string;
  leaveDays: number;
  approvalStatus: string;
}

export interface PendingLeaveResponse {
  data: PendingLeaveRequest[];
  totalRecords: number;
}

export interface LateEmployeeSummary {
  employeeId: string;
  name: string;
  designation: string;
  totalLateDays: number;
  averageLateDuration: string;
}

export interface LateArrival {
  employeeId: string;
  name: string;
  date: string;
  checkInTime: string;
}