import { Injectable, signal } from '@angular/core';
import { Alert, AlertType } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts = signal<Alert[]>([]);

  // Public signal for components to subscribe to
  public currentAlerts = this.alerts.asReadonly();

  /**
   * Show a success alert
   */
  success(title: string, message: string): void {
    this.showAlert('success', title, message);
  }

  /**
   * Show a warning alert
   */
  warning(title: string, message: string): void {
    this.showAlert('warning', title, message);
  }

  /**
   * Show an error alert
   */
  error(title: string, message: string): void {
    this.showAlert('error', title, message);
  }

  /**
   * Dismiss a specific alert by ID
   */
  dismiss(alertId: string): void {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== alertId));
  }

  /**
   * Dismiss all alerts
   */
  dismissAll(): void {
    this.alerts.set([]);
  }

  /**
   * Get alert configuration for a specific type
   */
  getAlertConfig(type: AlertType) {
    switch (type) {
      case 'success':
        return {
          icon: 'fas fa-check-circle',
          bgColor: 'bg-green-100 dark:bg-gray-800',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'warning':
        return {
          icon: 'fas fa-exclamation-triangle',
          bgColor: 'bg-yellow-100 dark:bg-gray-800',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'error':
        return {
          icon: 'fas fa-times-circle',
          bgColor: 'bg-red-100 dark:bg-gray-800',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800'
        };
    }
  }

  /**
   * Private method to show an alert
   */
  private showAlert(type: AlertType, title: string, message: string): void {

    this.alerts.set([]);

    const alert: Alert = {
      id: this.generateId(),
      type,
      title,
      message,
      show: true
    };

    this.alerts.update(alerts => [...alerts, alert]);

    // Auto-dismiss after 5 seconds for success and warning alerts
    if (type === 'success' || type === 'warning') {
      setTimeout(() => {
        //this.dismiss(alert.id);
      }, 5000);
    }
  }

  /**
   * Generate a unique ID for the alert
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}