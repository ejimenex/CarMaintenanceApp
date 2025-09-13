# Alert Service

A comprehensive alert service for Ionic Angular applications that provides toast notifications, question alerts, and action sheets.

## Features

- **Toast Notifications**: Success, error, warning, and info toasts with customizable options
- **Question Alerts**: Confirmation dialogs and prompt dialogs
- **Action Sheets**: Bottom sheet menus with multiple options
- **Observable Support**: All methods have Observable variants for reactive programming
- **TypeScript Support**: Fully typed interfaces and methods

## Usage

### Basic Import

```typescript
import { AlertService } from './utils/alert.service';

constructor(private alertService: AlertService) {}
```

### Toast Notifications

#### Simple Toast
```typescript
await this.alertService.showToast({
  message: 'This is a toast message',
  duration: 3000,
  position: 'bottom',
  color: 'primary'
});
```

#### Predefined Toast Types
```typescript
// Success toast
await this.alertService.showSuccess('Operation completed successfully!');

// Error toast
await this.alertService.showError('An error occurred. Please try again.');

// Warning toast
await this.alertService.showWarning('Please check your input.');

// Info toast
await this.alertService.showInfo('This is an informational message.');
```

### Question Alerts

#### Confirmation Dialog
```typescript
const confirmed = await this.alertService.showConfirm({
  header: 'Delete Item',
  message: 'Are you sure you want to delete this item?',
  confirmText: 'Delete',
  cancelText: 'Cancel'
});

if (confirmed) {
  // User confirmed
  await this.alertService.showSuccess('Item deleted!');
} else {
  // User cancelled
  await this.alertService.showInfo('Operation cancelled.');
}
```

#### Prompt Dialog
```typescript
const result = await this.alertService.showPrompt({
  header: 'Enter Name',
  message: 'Please enter your name:',
  placeholder: 'Your name',
  confirmText: 'Save',
  cancelText: 'Cancel'
});

if (result) {
  await this.alertService.showSuccess(`Hello, ${result}!`);
}
```

### Action Sheets

```typescript
const buttons = [
  {
    text: 'Delete',
    role: 'destructive',
    icon: 'trash'
  },
  {
    text: 'Share',
    icon: 'share'
  },
  {
    text: 'Cancel',
    role: 'cancel',
    icon: 'close'
  }
];

const result = await this.alertService.showActionSheet('Choose an action', buttons);
if (result) {
  await this.alertService.showInfo(`You selected: ${result}`);
}
```

### Observable Pattern

All methods have Observable variants for reactive programming:

```typescript
// Observable toast
this.alertService.showToast$({
  message: 'Observable toast',
  color: 'success'
}).subscribe(() => {
  console.log('Toast dismissed');
});

// Observable confirmation
this.alertService.showConfirm$({
  header: 'Confirm',
  message: 'Do you want to proceed?'
}).subscribe(confirmed => {
  if (confirmed) {
    this.alertService.showSuccess('Proceeded!');
  }
});
```

## Interfaces

### AlertOptions
```typescript
interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string;
  buttons?: string[];
  cssClass?: string;
  backdropDismiss?: boolean;
}
```

### ToastOptions
```typescript
interface ToastOptions {
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'medium' | 'light' | 'dark';
  cssClass?: string;
  icon?: string;
}
```

### QuestionAlertOptions
```typescript
interface QuestionAlertOptions extends AlertOptions {
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'prompt';
  placeholder?: string;
  inputType?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
  inputValue?: string;
}
```

## Methods

### Toast Methods
- `showToast(options: ToastOptions): Promise<void>`
- `showToast$(options: ToastOptions): Observable<void>`
- `showSuccess(message: string, duration?: number): Promise<void>`
- `showError(message: string, duration?: number): Promise<void>`
- `showWarning(message: string, duration?: number): Promise<void>`
- `showInfo(message: string, duration?: number): Promise<void>`

### Alert Methods
- `showAlert(options: AlertOptions): Promise<void>`
- `showAlert$(options: AlertOptions): Observable<void>`
- `showConfirm(options: QuestionAlertOptions): Promise<boolean>`
- `showConfirm$(options: QuestionAlertOptions): Observable<boolean>`
- `showPrompt(options: QuestionAlertOptions): Promise<string | null>`
- `showPrompt$(options: QuestionAlertOptions): Observable<string | null>`

### Action Sheet Methods
- `showActionSheet(header: string, buttons: any[]): Promise<string | null>`
- `showActionSheet$(header: string, buttons: any[]): Observable<string | null>`

### Utility Methods
- `dismissAll(): Promise<void>` - Dismisses all active alerts, toasts, and action sheets

## Best Practices

1. **Use appropriate toast types**: Use success for positive actions, error for failures, warning for cautions, and info for general information.

2. **Keep messages concise**: Toast messages should be brief and actionable.

3. **Handle user responses**: Always handle the return values from confirmation and prompt dialogs.

4. **Use Observable pattern for complex flows**: When you need to chain multiple alerts or handle complex user interactions.

5. **Customize appearance**: Use `cssClass` to apply custom styling when needed.

6. **Set appropriate durations**: Error messages should stay longer (4000ms) than success messages (3000ms).

## Example Component

See `alert.service.example.ts` for a complete example of how to use all the alert service features. 