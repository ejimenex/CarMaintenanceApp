import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VehicleGetRequest } from '../../../../utils/vehicle.service';

@Component({
  selector: 'app-vehicle-view-modal',
  templateUrl: './vehicle-view-modal.component.html',
  styleUrls: ['./vehicle-view-modal.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  standalone: true
})
export class VehicleViewModalComponent implements OnInit {
  @Input() vehicle: VehicleGetRequest | null = null;

  constructor(
    private modalController: ModalController,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    console.log('Vehicle data:', this.vehicle);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  editVehicle() {
    this.modalController.dismiss({ action: 'edit', vehicleId: this.vehicle?.id });
  }

  deleteVehicle() {
    this.modalController.dismiss({ action: 'delete', vehicle: this.vehicle });
  }
}
