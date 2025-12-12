import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialog {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmDialog = signal<ConfirmDialog | null>(null);
  private confirmSubject!: Subject<boolean>;

  // Public signal for components to subscribe to
  public currentDialog = this.confirmDialog.asReadonly();

  /**
   * Show a confirmation dialog
   * @param title Dialog title
   * @param message Dialog message
   * @param confirmText Text for confirm button (default: 'OK')
   * @param cancelText Text for cancel button (default: 'Cancel')
   * @param type Dialog type for styling (default: 'info')
   * @returns Observable that emits true for OK, false for Cancel
   */
  show(
    title: string,
    message: string,
    confirmText: string = 'OK',
    cancelText: string = 'Cancel',
    type: 'info' | 'warning' | 'danger' = 'info'
  ): Observable<boolean> {
    this.confirmSubject = new Subject<boolean>(); // Create a new subject for each dialog

    this.confirmDialog.set({
      title,
      message,
      confirmText,
      cancelText,
      type
    });

    return this.confirmSubject.asObservable();
  }

  /**
   * Confirm the dialog (user clicked OK)
   */
  confirm(): void {
    this.confirmSubject.next(true);
    this.confirmSubject.complete();
    this.close();
  }

  /**
   * Cancel the dialog (user clicked Cancel or closed)
   */
  cancel(): void {
    this.confirmSubject.next(false);
    this.confirmSubject.complete();
    this.close();
  }

  /**
   * Close the dialog without emitting
   */
  close(): void {
    this.confirmDialog.set(null);
  }

  /**
   * Get dialog configuration for a specific type
   */
  getDialogConfig(type: 'info' | 'warning' | 'danger') {
    switch (type) {
      case 'info':
        return {
          icon: 'fas fa-info-circle',
          iconColor: 'text-blue-600 dark:text-blue-400',
          confirmButtonClass: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200',
          headerBg: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-triangle',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          confirmButtonClass: 'px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200',
          headerBg: 'bg-yellow-50 dark:bg-yellow-900/20'
        };
      case 'danger':
        return {
          icon: 'fas fa-exclamation-circle',
          iconColor: 'text-red-600 dark:text-red-400',
          confirmButtonClass: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200',
          headerBg: 'bg-red-50 dark:bg-red-900/20'
        };
    }
  }
}