import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
        data: { title: 'Dashboard' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        data: { title: 'Profile'}
      },
      {
        path: 'employee',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/employee-list/employee-list').then(m => m.EmployeeList)
          },
          {
            path: 'attendence-details',
            loadComponent: () => import('./pages/attendence-details/attendence-details').then(m => m.AttendenceDetails)
          }
        ],
        data: { title: 'User Management'}
      },
      // {
      //   path: 'gp-list',
      //   loadComponent: () => import('./pages/gp-list/gp-list').then(m => m.GpList),
      //   data: { title: 'GP List' }
      // },
      // {
      //   path: 'gp-visit-log',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () => import('./pages/gp-visit-log-list/gp-visit-log-list').then(m => m.GpVisitLogListComponent)
      //     },
      //     {
      //       path: 'gp-work-log',
      //       loadComponent: () => import('./pages/gp-work-log/gp-work-log').then(m => m.GpWorkLogComponent)
      //     },
      //   ],
      //   data: { title: 'GP Visit List'}
      // },
      // {
      //   path: 'gp-member-list',
      //   loadComponent: () => import('./pages/gp-member list and activity/gp-member-list/gp-member-list').then(m => m.GpMemberListComponent),
      //   data: { title: 'GP Member List'}
      // },
      // {
      //   path: 'gp-assigned-list',
      //   loadComponent: () => import('./pages/gp-assignment-list/gp-assignment-list').then(m => m.AssignedGpList),
      //   data: { title: 'GP Assignment List'}
      // },
      // {
      //   path: 'gis-mapping',
      //   loadComponent: () => import('./pages/gis-mapping/gis-mapping').then(m => m.GisMappingComponent),
      //   data: { title: 'GIS Mapping'}
      // },
      // {
      //   path: 'other-activity',
      //   loadComponent: () => import('./pages/other-activity-list/other-activity/other-activity').then(m => m.OtherActivity),
      //   data: { title: 'Other-Activity'}
      // },
      // {
      //   path: 'other-activity-work-log',
      //   loadComponent: () => import('./pages/other-activity-list/other-activity-work-list/other-activity-work-list').then(m => m.OtherActivityWorkLogComponent),
      //   data: { title: 'Other-activity-Work-Log'}
      // },
      {
        path: 'leave-requests',
        loadComponent: () => import('./pages/leave-request-details/leave-request-details').then(m => m.LeaveRequestDetailsComponent),
        data: { title: 'Leave Request'}
      },
      // {
      //   path: 'district-list',
      //   children: [
      //     {
      //       path: '',
      //       loadComponent: () =>
      //         import('./pages/district-block-list/district-list/district-list').then(m => m.DistrictList)
      //     },
      //     {
      //       path: 'block-list',
      //       loadComponent: () =>
      //         import('./pages/district-block-list/block-list/block-list').then(m => m.BlockList)
      //     }
      //   ],
      //   data: { title: 'District and Block List'}
      // },
      // {
      //   path: 'module-list',
      //   loadComponent: () => import('./pages/module/module-list/module-list').then(m => m.ModuleList),
      //   data: { title: 'Module List'}
      // },
      // {
      //   path: 'module-assign-list',
      //   loadComponent: () => import('./pages/module/module-assign-list/module-assign-list').then(m => m.UserModuleListComponent),
      //   data: { title: 'Module Assignment List'}
      // },
      // {
      //   path: 'support-list',
      //   loadComponent: () => import('./pages/module/support-list/support-list').then(m => m.SupportListComponent),
      //   data: { title: 'Support List'}
      // },
      // {
      //   path: 'problem-list',
      //   loadComponent: () => import('./pages/module/problem-list/problem-list').then(m => m.ProblemListComponent),
      //   data: { title: 'Problem List'}
      // },
      // {
      //   path: 'problem-category',
      //   loadComponent: () => import('./pages/module/problem-category/problem-category').then(m => m.ProblemCategoryComponent),
      //   data: { title: 'Problem Category List'}
      // },
      // {
      //   path: 'problem-category-option',
      //   loadComponent: () => import('./pages/module/problem-category-option/problem-category-option').then(m => m.ProblemCategoryOptionComponent),
      //   data: { title: 'Problem Category Option'}
      // },
      // {
      //   path: 'virtual-meeting-list',
      //   loadComponent: () => import('./pages/mentor-virtual-meeting-list/mentor-virtual-meeting-list').then(m => m.VirtualMeetingListComponent),
      //   data: { title: 'Virtual Meeting List'}
      // },
      {
        path: 'holiday-list',
        loadComponent: () => import('./pages/holiday-list/holiday-list').then(m => m.HolidayListComponent),
        data: { title: 'Holiday List'}
      }
    ]
  },
  // Fallback route
  {
    path: '**',
    redirectTo: '/login'
  }
];
