import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() sidebarCollapsed: any;
  @Input() pageTitle: string = 'Dashboard';
  @Output() toggleSidebar = new EventEmitter<void>();
}
