import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule]
})
export class AppFooterComponent {
  @Input() showBackButton: boolean = true;
  @Input() showHomeButton: boolean = true;
  @Input() showSaveButton: boolean = false;
  @Input() saveButtonText: string = 'common.save';
  @Input() saveButtonDisabled: boolean = false;
  @Input() saveButtonLoading: boolean = false;
  @Input() backButtonText: string = 'common.back';
  @Input() homeButtonText: string = 'Dashboard';
  @Input() customBackRoute?: string;
  
  @Output() onSave = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();
  @Output() onHome = new EventEmitter<void>();

  constructor(private router: Router) {}

  handleBack(): void {
    if (this.onBack.observers.length > 0) {
      this.onBack.emit();
    } else if (this.customBackRoute) {
      this.router.navigate([this.customBackRoute]);
    } else {
      window.history.back();
    }
  }

  handleHome(): void {
    if (this.onHome.observers.length > 0) {
      this.onHome.emit();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  handleSave(): void {
    if (!this.saveButtonDisabled && !this.saveButtonLoading) {
      this.onSave.emit();
    }
  }
}

