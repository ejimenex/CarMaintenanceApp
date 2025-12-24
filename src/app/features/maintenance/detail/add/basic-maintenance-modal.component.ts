import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Catalog } from 'src/app/utils/catalog.service';
import { TranslateModule } from '@ngx-translate/core';

interface BasicMaintenance {
  id: string;
  name: string;
}

@Component({
  selector: 'app-basic-maintenance-modal',
  templateUrl: './basic-maintenance-modal.component.html',
  styleUrls: ['./basic-maintenance-modal.component.scss'],
  imports: [CommonModule, IonicModule, TranslateModule],
  standalone: true
})
export class BasicMaintenanceModalComponent {
  
  selectedIds: Set<string> = new Set();
  @Input() basicMaintenancesCatalog: Catalog[] = [];
  constructor(private modalController: ModalController) {}

  toggleSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  addSelectedMaintenances() {
    const selected = this.basicMaintenancesCatalog.filter(m => this.selectedIds.has(m.id || ''));
    this.modalController.dismiss(selected);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
