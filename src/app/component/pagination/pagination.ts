import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {
  // Inputs
  @Input({ required: true }) set currentPage(value: number) {
    this._currentPage.set(value);
  }
  @Input({ required: true }) set totalPages(value: number) {
    this._totalPages.set(value);
  }
  @Input({ required: true }) set totalItems(value: number) {
    this._totalItems.set(value);
  }
  @Input({ required: true }) set itemsPerPage(value: number) {
    this._itemsPerPage.set(value);
  }
  @Input() set isLoading(value: boolean) {
    this._isLoading.set(value);
  }

  // Outputs
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  // Internal signals
  private _currentPage = signal(1);
  private _totalPages = signal(1);
  private _totalItems = signal(0);
  private _itemsPerPage = signal(10);
  private _isLoading = signal(false);

  // Page size options
  pageSizes = [10, 25, 50, 100];

  // Computed values
  startIndex = computed(() => {
    return (this._currentPage() - 1) * this._itemsPerPage() + 1;
  });

  endIndex = computed(() => {
    return Math.min(this._currentPage() * this._itemsPerPage(), this._totalItems());
  });

  hasPreviousPage = computed(() => this._currentPage() > 1);
  hasNextPage = computed(() => this._currentPage() < this._totalPages());

  // Computed page numbers for display
  displayPages = computed(() => {
    const current = this._currentPage();
    const total = this._totalPages();
    const pages: (number | string)[] = [];

    if (total <= 5) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      // Always show last page
      if (total > 1) {
        pages.push(total);
      }
    }

    return pages;
  });

  // Public getters for template
  get currentPage() { return this._currentPage(); }
  get totalPages() { return this._totalPages(); }
  get totalItems() { return this._totalItems(); }
  get isLoading() { return this._isLoading(); }

  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page !== this._currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSize = Number(selectElement.value);
    this.itemsPerPageChange.emit(newSize);
  }

  onPreviousPage(): void {
    if (this.hasPreviousPage()) {
      this.pageChange.emit(this._currentPage() - 1);
    }
  }

  onNextPage(): void {
    if (this.hasNextPage()) {
      this.pageChange.emit(this._currentPage() + 1);
    }
  }

  trackByPage(index: number, page: number | string): number | string {
    return page;
  }
}
