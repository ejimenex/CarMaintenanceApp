import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <ion-badge [color]="getBadgeColor()">{{ status }}</ion-badge>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  getBadgeColor(): string {
    switch (this.status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'medium';
      case 'maintenance':
        return 'warning';
      default:
        return 'primary';
    }
  }
} 