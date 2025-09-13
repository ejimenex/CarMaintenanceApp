import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface ToastOptions {
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'medium' | 'light' | 'dark';
  cssClass?: string;
  icon?: string;
}

export interface QuestionAlertOptions {
  header?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  cssClass?: string;
  backdropDismiss?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private translate: TranslateService
  ) { }

  /**
   * Show a confirmation dialog
   */
  async showConfirm(options: QuestionAlertOptions): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: options.header || 'Confirm',
        message: options.message,
        buttons: [
          {
            text: options.cancelText || 'Cancel',
            role: 'cancel',
            cssClass: 'alert-button-cancel'
          },
          {
            text: options.confirmText || 'Confirm',
            role: 'confirm',
            cssClass: 'alert-button-confirm'
          }
        ],
        cssClass: options.cssClass,
        backdropDismiss: options.backdropDismiss !== false
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      resolve(role === 'confirm');
    });
  }

  /**
   * Show confirmation as Observable
   */
  showConfirm$(options: QuestionAlertOptions): Observable<boolean> {
    return from(this.showConfirm(options));
  }

  /**
   * Show confirmation dialog with callback function
   */
  async showConfirmWithCallback(
    options: QuestionAlertOptions, 
    onConfirm: () => void | Promise<void>, 
    onCancel?: () => void | Promise<void>
  ): Promise<void> {
    const confirmed = await this.showConfirm(options);
    
    if (confirmed) {
      await onConfirm();
    } else if (onCancel) {
      await onCancel();
    }
  }

  /**
   * Show confirmation dialog with callback function (Observable version)
   */
  showConfirmWithCallback$(
    options: QuestionAlertOptions, 
    onConfirm: () => void | Promise<void>, 
    onCancel?: () => void | Promise<void>
  ): Observable<void> {
    return from(this.showConfirmWithCallback(options, onConfirm, onCancel));
  }



  /**
   * Show a toast notification
   */
  async showToast(options: ToastOptions): Promise<void> {
    const toast = await this.toastController.create({
      message: options.message,
      duration: options.duration || 3000,
      position: options.position || 'bottom',
      color: options.color,
      cssClass: options.cssClass,
      icon: options.icon
    });

    await toast.present();
  }

  /**
   * Show toast as Observable
   */
  showToast$(options: ToastOptions): Observable<void> {
    return from(this.showToast(options));
  }

  /**
   * Show success toast
   */
  async showSuccess(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'success',
      icon: 'checkmark-circle',
      duration: duration || 3000
    });
  }

  /**
   * Show error toast
   */
  async showError(message: string, listErrors?: string[],duration?: number): Promise<void> {
    debugger
    if(message){
      message =  this.translate.instant(message);
    }
    if(listErrors){
      const translatedErrors = listErrors.map(msg => this.translate.instant(msg));
      message = message + ' ' + translatedErrors.join(', ');
    }
    await this.showToast({
      message,
      color: 'danger',
      icon: 'close-circle',
      duration: duration || 4000
    });
  }

  /**
   * Show warning toast
   */
  async showWarning(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'warning',
      icon: 'warning',
      duration: duration || 3500
    });
  }

  /**
   * Show info toast
   */
  async showInfo(message: string, duration?: number): Promise<void> {
    await this.showToast({
      message,
      color: 'primary',
      icon: 'information-circle',
      duration: duration || 3000
    });
  }

  /**
   * Dismiss all alerts and toasts
   */
  async dismissAll(): Promise<void> {
    await this.alertController.dismiss();
    await this.toastController.dismiss();
  }
}
