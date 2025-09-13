import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-container" *ngIf="message">
      <ion-icon name="alert-circle" color="danger"></ion-icon>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: var(--ion-color-danger-tint);
      border-radius: 8px;
      margin: 10px 0;
    }
    
    .error-container p {
      margin: 0;
      color: var(--ion-color-danger);
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message: string = '';
} 