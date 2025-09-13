import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Import common components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AppHeaderComponent } from './components/app-header';

// Import common directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DebounceDirective } from './directives/debounce.directive';
import { HighlightDirective } from './directives/highlight.directive';

// Import common pipes
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FormatCurrencyPipe } from './pipes/format-currency.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    // Components
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    ImageUploadComponent,
    FileUploadComponent,
    AppHeaderComponent,
    
    // Directives
    ClickOutsideDirective,
    DebounceDirective,
    HighlightDirective,
    
    // Pipes
    SafeUrlPipe,
    FormatDatePipe,
    FormatCurrencyPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    
    // Components
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SearchBarComponent,
    StatusBadgeComponent,
    ImageUploadComponent,
    FileUploadComponent,
    AppHeaderComponent,
    
    // Directives
    ClickOutsideDirective,
    DebounceDirective,
    HighlightDirective,
    
    // Pipes
    SafeUrlPipe,
    FormatDatePipe,
    FormatCurrencyPipe,
    TruncatePipe
  ]
})
export class SharedModule { } 