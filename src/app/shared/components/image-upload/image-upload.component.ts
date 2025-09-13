import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  template: `
    <div class="image-upload">
      <ion-button fill="outline" (click)="fileInput.click()">
        <ion-icon name="camera"></ion-icon>
        Upload Image
      </ion-button>
      <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none;">
    </div>
  `,
  styles: [`
    .image-upload {
      text-align: center;
      padding: 20px;
    }
  `]
})
export class ImageUploadComponent {
  @Output() imageSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageSelected.emit(file);
    }
  }
} 