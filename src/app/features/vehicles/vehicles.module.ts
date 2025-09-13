import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// import { VehiclesAddComponent } from './crud/add/vehicles-add.component';
// import { VehiclesEditComponent } from './crud/edit/vehicles-edit.component';
// import { VehiclesDetailComponent } from './crud/detail/vehicles-detail.component';

// Import shared modules
import { SharedModule } from '../../shared/shared.module';
import { VehiclesListComponent } from './crud/list/vehicles-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: VehiclesListComponent
  },
  // {
  //   path: 'add',
  //   component: VehiclesAddComponent
  // },
  // {
  //   path: 'edit/:id',
  //   component: VehiclesEditComponent
  // },
  // {
  //   path: 'detail/:id',
  //   component: VehiclesDetailComponent
  // }
];

@NgModule({
  declarations: [
    VehiclesListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class VehiclesModule { } 