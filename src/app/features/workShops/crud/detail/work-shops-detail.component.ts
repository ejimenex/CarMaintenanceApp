import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { WorkshopService } from '../../../../utils/worksShop.service';
import { AlertService } from '../../../../utils/alert.service';
import { WorkShop } from '../../interfaces/work-shop.interface';

@Component({
  selector: 'app-work-shops-detail',
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/workshops"></ion-back-button>
        </ion-buttons>
        <ion-title>Workshop Details</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="editWorkShop()">
            <ion-icon name="create"></ion-icon>
          </ion-button>
          <ion-button (click)="deleteWorkShop()" color="danger">
            <ion-icon name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="ion-padding">
        <div *ngIf="loading" class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Loading workshop...</p>
        </div>

        <div *ngIf="!loading && workShop">
          <!-- Basic Information -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ workShop.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <!-- Notes section removed as WorkshopGetRequest interface doesn't include note property -->
            </ion-card-content>
          </ion-card>

          <!-- Contact Information -->
          <ion-card *ngIf="workShop.address || workShop.phone">
            <ion-card-header>
              <ion-card-title>Contact Information</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-item *ngIf="workShop.address">
                <ion-icon name="location" slot="start"></ion-icon>
                <ion-label>
                  <h3>Address</h3>
                  <p>{{ workShop.address }}</p>
                </ion-label>
              </ion-item>
              <ion-item *ngIf="workShop.phone">
                <ion-icon name="call" slot="start"></ion-icon>
                <ion-label>
                  <h3>Phone</h3>
                  <p>{{ workShop.phone }}</p>
                </ion-label>
              </ion-item>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-container">
          <ion-icon name="alert-circle" color="danger"></ion-icon>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .loading-container p {
      margin-top: 10px;
      color: var(--ion-color-medium);
    }

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
  `],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  providers: [
    WorkshopService,
    AlertService
  ],
  standalone: true
})
export class WorkShopsDetailComponent implements OnInit {
  workShop: WorkShop | null = null;
  loading = false;
  errorMessage = '';
  workShopId: string = '';

  constructor(
    private workshopService: WorkshopService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.workShopId = this.route.snapshot.paramMap.get('id') || '';
    this.loadWorkShop();
  }

  loadWorkShop() {
    this.loading = true;
    this.errorMessage = '';

    this.workshopService.getByIdWorksShop(this.workShopId).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.workShop = response.data;
        } else {
          this.errorMessage = response.message || 'Failed to load workshop';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'An error occurred while loading the workshop';
        console.error('Error loading workshop:', error);
      }
    });
  }

  editWorkShop() {
    this.router.navigate(['/workshops/edit', this.workShopId]);
  }

  async deleteWorkShop() {
    const confirmed = await this.alertService.showConfirm({
      header: 'Delete Workshop',
      message: 'Are you sure you want to delete this workshop?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.loading = true;
      this.workshopService.deleteWorksShop(this.workShopId).subscribe({
        next: async (response: any) => {
          this.loading = false;
          if (response.success) {
            await this.alertService.showSuccess('Workshop deleted successfully!');
            this.router.navigate(['/workshops']);
          } else {
            await this.alertService.showError(response.message || 'Failed to delete workshop');
          }
        },
        error: async (error: any) => {
          this.loading = false;
          await this.alertService.showError('An error occurred while deleting the workshop');
          console.error('Error deleting workshop:', error);
        }
      });
    }
  }
} 