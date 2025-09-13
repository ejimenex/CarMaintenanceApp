import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [IonButtons, IonButton, IonIcon],
  template: `
    <ion-buttons slot="end">
      <ion-button (click)="previous()" [disabled]="currentPage <= 1">
        <ion-icon name="chevron-back"></ion-icon>
      </ion-button>
      <ion-button disabled>{{ currentPage }} / {{ totalPages }}</ion-button>
      <ion-button (click)="next()" [disabled]="currentPage >= totalPages">
        <ion-icon name="chevron-forward"></ion-icon>
      </ion-button>
    </ion-buttons>
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  previous() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
} 