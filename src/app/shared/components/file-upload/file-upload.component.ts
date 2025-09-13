import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <div class="file-upload">
      <ion-button fill="outline" (click)="fileInput.click()">
        <ion-icon name="document"></ion-icon>
        Upload File
      </ion-button>
      <input #fileInput type="file" (change)="onFileSelected($event)" style="display: none;">
    </div>
  `,
  styles: [`
    .file-upload {
      text-align: center;
      padding: 20px;
    }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
} 