import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { WorkShop } from '../../interfaces/work-shop.interface';

@Component({
  selector: 'app-workshop-view-modal',
  templateUrl: './workshop-view-modal.component.html',
  styleUrls: ['./workshop-view-modal.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  standalone: true
})
export class WorkshopViewModalComponent {
  @Input() workshop: WorkShop | null = null;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  editWorkshop() {
    this.modalController.dismiss({
      action: 'edit',
      workshopId: this.workshop?.id
    });
  }

  deleteWorkshop() {
    this.modalController.dismiss({
      action: 'delete',
      workshop: this.workshop
    });
  }
}
