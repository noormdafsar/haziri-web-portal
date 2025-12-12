import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Input() navigationItems: any[] = [];
  @Input() navigationCategories: any[] = [];
  @Input() sidebarCollapsed: any;
  @Input() sidebarOpen: any;
  @Input() isMobile: boolean = false;
  @Input() userMenuOpen: any;
  @Input() darkMode: any;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() toggleUserMenu = new EventEmitter<void>();
  @Output() toggleDarkMode = new EventEmitter<void>();

  // isUserMenuOpen = false;

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _logger = inject(LoggerService).createChild('Sidebar');

  logout(): void {
    this._authService.logout().subscribe({
      next: () => {
        this._router.navigate(['/login']);
      },
      error: (error) => {
        this._logger.error('Logout failed', error);
        // Even if logout fails, clear local data and redirect to login
        this._router.navigate(['/login']);
      }
    })
  }
  getCurrentUser() {
    return this._authService.getCurrentUser();
  }
}
