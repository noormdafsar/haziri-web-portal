import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Sidebar } from './sidebar/sidebar';
import { AlertComponent } from '../component/alert/alert.component';
import { Confirm } from '../component/confirm/confirm';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule, Header, Footer, Sidebar, AlertComponent, Confirm],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  // Layout state
  sidebarCollapsed = signal(false);
  sidebarOpen = signal(true);
  darkMode = signal(false);
  userMenuOpen = signal(false);
  currentPageTitle = signal<string>('Dashboard');

  // Computed property for mobile detection
  isMobile = computed(() => window.innerWidth < 1024);

  // Navigation items organized by categories
  navigationCategories = [
    {
      name: 'Employee Management',
      items: [
        { title: 'Dashboard', route: '/dashboard', icon: 'fas fa-home' },
        { title: 'Employee', route: '/employee', icon: 'fas fa-user' },
        { title: 'Leave Requests', route: '/leave-requests', icon: 'fas fa-calendar-alt' },
        { title: 'Holiday List', route: '/holiday-list', icon: 'fas fa-calendar-alt' },
      ]
    },
  ];

  // Flattened navigation items for compatibility
  navigationItems = this.navigationCategories.flatMap(category => category.items);

  private document = inject(DOCUMENT);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      this.darkMode.set(true);
      this.document.documentElement.classList.add('dark');
    }

    // Set initial sidebar state based on screen size
    this.updateSidebarForScreenSize();

    // Close user menu when clicking outside
    this.document.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        this.userMenuOpen.set(false);
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.updateSidebarForScreenSize();
    });
    // Listen to router events to update page title
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe(route => {
      this.currentPageTitle.set(route.snapshot.data['title'] || 'Dashboard');
    });
  }

  private updateSidebarForScreenSize() {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
      this.sidebarCollapsed.set(false);
    } else {
      this.sidebarOpen.set(true);
    }
  }

  toggleSidebar() {
    if (window.innerWidth >= 1024) {
      this.sidebarCollapsed.set(!this.sidebarCollapsed());
    } else {
      this.sidebarOpen.set(!this.sidebarOpen());
    }
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    const isDark = this.darkMode();

    if (isDark) {
      this.document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }

    // Close user menu after toggling
    this.userMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.userMenuOpen.set(!this.userMenuOpen());
  }
}