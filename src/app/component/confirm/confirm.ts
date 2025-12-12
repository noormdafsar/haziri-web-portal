import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../service/confirm.service';

@Component({
  selector: 'app-confirm',
  imports: [CommonModule],
  templateUrl: './confirm.html',
  styleUrl: './confirm.scss'
})
export class Confirm {
  private _confirmService = inject(ConfirmService);

  // Get current dialog from service
  dialog = this._confirmService.currentDialog;

  /**
   * Handle confirm button click
   */
  onConfirm(): void {
    this._confirmService.confirm();
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    this._confirmService.cancel();
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(): void {
    this._confirmService.cancel();
  }

  /**
   * Prevent modal content clicks from closing the modal
   */
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Get dialog configuration for styling
   */
  getDialogConfig(type: 'info' | 'warning' | 'danger') {
    return this._confirmService.getDialogConfig(type);
  }
}