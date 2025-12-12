import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../service/alert.service';
import { Alert, AlertType} from '../../models/alert.model'

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  private alertService = inject(AlertService);

  // Get current alerts from the service
  alerts = this.alertService.currentAlerts;

  /**
   * Get alert configuration for styling
   */
  getAlertConfig(type: AlertType) {
    return this.alertService.getAlertConfig(type);
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(alertId: string): void {
    this.alertService.dismiss(alertId);
  }

  /**
   * Handle OK button click
   */
  onOkClick(alert: Alert): void {
    this.dismissAlert(alert.id);
  }
}