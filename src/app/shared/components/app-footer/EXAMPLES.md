# Ejemplos de Uso del App Footer

## 📝 Ejemplo Completo: Formulario de Agregar Vehículo

```typescript
// vehicles-add.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Importar el footer
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-vehicles-add',
  templateUrl: './vehicles-add.component.html',
  styleUrls: ['./vehicles-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    AppFooterComponent  // ✅ Importar el footer
  ]
})
export class VehiclesAddComponent implements OnInit {
  form!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      plateNumber: ['', Validators.required],
      brand: ['', Validators.required],
      model: [''],
      color: [''],
      year: ['']
    });
  }

  async handleSave() {
    if (this.form.valid) {
      this.isSaving = true;
      try {
        const vehicle = await this.vehicleService.create(this.form.value);
        await this.router.navigate(['/vehicles', vehicle.id]);
      } catch (error) {
        console.error('Error saving vehicle:', error);
      } finally {
        this.isSaving = false;
      }
    }
  }

  handleBack() {
    if (this.form.dirty) {
      // Mostrar confirmación si hay cambios sin guardar
      this.showConfirmDialog();
    } else {
      this.router.navigate(['/vehicles']);
    }
  }
}
```

```html
<!-- vehicles-add.component.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>{{ 'vehicles.addVehicle' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="form">
    <ion-list>
      <ion-item>
        <ion-label position="stacked">{{ 'vehicles.form.name' | translate }}</ion-label>
        <ion-input formControlName="name" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">{{ 'vehicles.form.plateNumber' | translate }}</ion-label>
        <ion-input formControlName="plateNumber" type="text"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">{{ 'vehicles.form.brand' | translate }}</ion-label>
        <ion-input formControlName="brand" type="text"></ion-input>
      </ion-item>

      <!-- Más campos... -->
    </ion-list>
  </form>
</ion-content>

<!-- ✅ FOOTER con botón de guardar -->
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'vehicles.actions.save'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="isSaving"
  [customBackRoute]="'/vehicles'"
  (onSave)="handleSave()"
  (onBack)="handleBack()">
</app-footer>
```

## 📝 Ejemplo: Formulario de Editar Taller

```typescript
// work-shops-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-work-shops-edit',
  templateUrl: './work-shops-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    AppFooterComponent
  ]
})
export class WorkShopsEditComponent implements OnInit {
  form!: FormGroup;
  isUpdating = false;
  workshopId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workshopService: WorkShopService
  ) {}

  async ngOnInit() {
    this.workshopId = this.route.snapshot.params['id'];
    await this.loadWorkshop();
  }

  async loadWorkshop() {
    const workshop = await this.workshopService.getById(this.workshopId);
    this.form = this.fb.group({
      name: [workshop.name, Validators.required],
      address: [workshop.address, Validators.required],
      phone: [workshop.phone, Validators.required],
      workShopType: [workshop.workShopType, Validators.required]
    });
  }

  async handleUpdate() {
    if (this.form.valid && this.form.dirty) {
      this.isUpdating = true;
      try {
        await this.workshopService.update(this.workshopId, this.form.value);
        await this.router.navigate(['/workshops', this.workshopId]);
      } finally {
        this.isUpdating = false;
      }
    }
  }
}
```

```html
<!-- work-shops-edit.component.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>{{ 'workshops.edit.title' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="form">
    <!-- Campos del formulario -->
  </form>
</ion-content>

<!-- ✅ FOOTER para edición -->
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'workshops.actions.update'"
  [saveButtonDisabled]="!form.valid || !form.dirty"
  [saveButtonLoading]="isUpdating"
  [customBackRoute]="'/workshops/' + workshopId"
  (onSave)="handleUpdate()">
</app-footer>
```

## 📝 Ejemplo: Vista de Detalles (Sin Guardar)

```typescript
// vehicle-view.component.ts
import { Component } from '@angular/core';
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    AppFooterComponent
  ]
})
export class VehicleViewComponent {
  vehicle: any;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.vehicle = await this.vehicleService.getById(id);
  }
}
```

```html
<!-- vehicle-view.component.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>{{ vehicle?.name }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ vehicle?.name }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p><strong>Placa:</strong> {{ vehicle?.plateNumber }}</p>
      <p><strong>Marca:</strong> {{ vehicle?.brand }}</p>
      <p><strong>Modelo:</strong> {{ vehicle?.model }}</p>
    </ion-card-content>
  </ion-card>
</ion-content>

<!-- ✅ FOOTER solo con navegación -->
<app-footer
  [showSaveButton]="false"
  [customBackRoute]="'/vehicles'">
</app-footer>
```

## 📝 Ejemplo: Lista con Búsqueda

```typescript
// maintenance-list.component.ts
import { Component } from '@angular/core';
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    AppFooterComponent
  ]
})
export class MaintenanceListComponent {
  maintenances: any[] = [];
}
```

```html
<!-- maintenance-list.component.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>{{ 'maintenance.title' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-searchbar placeholder="Buscar..."></ion-searchbar>
  
  <ion-list>
    <ion-item *ngFor="let maintenance of maintenances">
      <ion-label>
        <h2>{{ maintenance.name }}</h2>
        <p>{{ maintenance.vehicle }}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</ion-content>

<!-- ✅ FOOTER simple en listas -->
<app-footer
  [showSaveButton]="false">
</app-footer>
```

## 📝 Ejemplo: Modal con Formulario

```typescript
// add-part-modal.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-add-part-modal',
  templateUrl: './add-part-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    AppFooterComponent
  ]
})
export class AddPartModalComponent {
  form!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost: [0, [Validators.required, Validators.min(0)]]
    });
  }

  async handleSave() {
    if (this.form.valid) {
      this.isSaving = true;
      try {
        await this.modalCtrl.dismiss(this.form.value, 'save');
      } finally {
        this.isSaving = false;
      }
    }
  }

  handleBack() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
```

```html
<!-- add-part-modal.component.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>{{ 'maintenance.parts.add.title' | translate }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="form">
    <!-- Campos del formulario -->
  </form>
</ion-content>

<!-- ✅ FOOTER en modal -->
<app-footer
  [showHomeButton]="false"
  [showSaveButton]="true"
  [saveButtonText]="'common.add'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="isSaving"
  (onSave)="handleSave()"
  (onBack)="handleBack()">
</app-footer>
```

## 🎯 Configuraciones Comunes

### Solo Guardar (Wizard o Paso Final)
```html
<app-footer
  [showBackButton]="false"
  [showHomeButton]="false"
  [showSaveButton]="true"
  [saveButtonText]="'common.finish'"
  (onSave)="complete()">
</app-footer>
```

### Navegación + Acción Personalizada
```html
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'common.publish'"
  (onSave)="publish()"
  (onBack)="saveAsDraft()">
</app-footer>
```

### Con Validación Asíncrona
```typescript
get isSaveDisabled(): boolean {
  return !this.form.valid || this.isCheckingUnique || this.isDuplicateName;
}
```

```html
<app-footer
  [showSaveButton]="true"
  [saveButtonDisabled]="isSaveDisabled"
  [saveButtonLoading]="isSaving"
  (onSave)="save()">
</app-footer>
```

## 💡 Tips

1. **Siempre valida el formulario** antes de habilitar el botón guardar
2. **Usa el loading state** para evitar múltiples clics
3. **Personaliza el texto** según el contexto (Guardar, Actualizar, Crear, etc.)
4. **Maneja los cambios sin guardar** en el evento `onBack`
5. **Usa customBackRoute** cuando necesites una navegación específica
6. **En modales**, oculta el botón Home con `[showHomeButton]="false"`

## 🔧 Personalización Avanzada

### Cambiar colores del botón guardar
```scss
// component.scss
app-footer {
  .save-button {
    --background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}
```

### Agregar más botones
Si necesitas más botones, puedes extender el componente o crear variantes específicas para tu caso de uso.









