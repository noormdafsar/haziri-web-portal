import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexStroke, ApexXAxis, ApexYAxis } from "ng-apexcharts";

export interface DashboardSummaryCounts {
  onlineVisits: number;
  offlineVisits: number;
  forgotCheckout: number;
  totalOtherActivities: number;
  otherVirtualMeetings: number;
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