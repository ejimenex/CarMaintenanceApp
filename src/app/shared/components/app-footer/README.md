# App Footer Component

Footer genérico estilo Instagram para usar en toda la aplicación.

## 📋 Características

- ✅ Botón de volver atrás
- 🏠 Botón de Dashboard/Home
- 💾 Botón de Guardar (para formularios)
- 📱 Responsive (adaptable a móviles)
- 🌓 Dark mode compatible
- ⚡ Animaciones suaves
- 🎨 Diseño profesional tipo Instagram

## 🚀 Uso Básico

### 1. Importar el componente

```typescript
import { AppFooterComponent } from '@shared/components/app-footer/app-footer.component';

@Component({
  standalone: true,
  imports: [AppFooterComponent, ...]
})
```

### 2. Usar en el template

#### Footer simple (solo volver y home)
```html
<app-footer></app-footer>
```

#### Footer con botón de guardar (formularios)
```html
<app-footer
  [showSaveButton]="true"
  [saveButtonDisabled]="!myForm.valid"
  [saveButtonLoading]="isSaving"
  (onSave)="handleSave()">
</app-footer>
```

#### Footer personalizado
```html
<app-footer
  [showBackButton]="true"
  [showHomeButton]="true"
  [showSaveButton]="true"
  [saveButtonText]="'common.update'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="isLoading"
  [customBackRoute]="'/vehicles'"
  (onSave)="save()"
  (onBack)="goBack()"
  (onHome)="goHome()">
</app-footer>
```

## 🎛️ Props (Inputs)

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `showBackButton` | boolean | `true` | Mostrar botón de volver |
| `showHomeButton` | boolean | `true` | Mostrar botón de Dashboard |
| `showSaveButton` | boolean | `false` | Mostrar botón de guardar |
| `saveButtonText` | string | `'common.save'` | Texto del botón guardar |
| `saveButtonDisabled` | boolean | `false` | Deshabilitar botón guardar |
| `saveButtonLoading` | boolean | `false` | Mostrar spinner en botón |
| `backButtonText` | string | `'common.back'` | Texto del botón volver |
| `homeButtonText` | string | `'Dashboard'` | Texto del botón home |
| `customBackRoute` | string | `undefined` | Ruta personalizada al volver |

## 📤 Events (Outputs)

| Evento | Descripción |
|--------|-------------|
| `onSave` | Se emite al hacer clic en Guardar |
| `onBack` | Se emite al hacer clic en Volver |
| `onHome` | Se emite al hacer clic en Home |

## 💡 Ejemplos de Uso

### Formulario de Agregar
```typescript
// component.ts
export class AddVehicleComponent {
  form!: FormGroup;
  isSaving = false;

  async handleSave() {
    if (this.form.valid) {
      this.isSaving = true;
      try {
        await this.vehicleService.add(this.form.value);
        this.router.navigate(['/vehicles']);
      } finally {
        this.isSaving = false;
      }
    }
  }
}
```

```html
<!-- component.html -->
<ion-content>
  <form [formGroup]="form">
    <!-- campos del formulario -->
  </form>
</ion-content>

<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'vehicles.actions.save'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="isSaving"
  (onSave)="handleSave()">
</app-footer>
```

### Formulario de Editar
```html
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'vehicles.actions.update'"
  [saveButtonDisabled]="!form.valid || !form.dirty"
  [saveButtonLoading]="isUpdating"
  [customBackRoute]="'/vehicles'"
  (onSave)="handleUpdate()">
</app-footer>
```

### Vista de Detalles (sin botón guardar)
```html
<app-footer
  [showSaveButton]="false"
  [customBackRoute]="'/vehicles'">
</app-footer>
```

### Solo botón de guardar
```html
<app-footer
  [showBackButton]="false"
  [showHomeButton]="false"
  [showSaveButton]="true"
  (onSave)="save()">
</app-footer>
```

## 🎨 Personalización

### Estilos personalizados
Si necesitas personalizar los estilos, puedes usar las variables CSS:

```scss
app-footer {
  --footer-height: 60px;
  --footer-background: white;
  --footer-border-color: rgba(0, 0, 0, 0.08);
}
```

### Comportamiento personalizado
```typescript
handleBack() {
  // Lógica personalizada antes de volver
  if (this.form.dirty) {
    // Mostrar confirmación
    this.showConfirmDialog().then(() => {
      this.router.navigate(['/back']);
    });
  }
}
```

## 📱 Responsive

El footer se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Muestra todos los textos de los botones
- **Tablet**: Oculta algunos textos, mantiene iconos
- **Mobile**: Modo compacto, solo iconos esenciales y texto en botones principales

## 🌓 Dark Mode

El footer tiene soporte completo para modo oscuro y se adapta automáticamente según las preferencias del sistema.

## ⚠️ Notas Importantes

1. El componente es **standalone**, no necesita ser declarado en ningún módulo
2. Usa `TranslateModule` para internacionalización
3. Si no se proporciona un evento `onBack`, usará `window.history.back()`
4. Si no se proporciona un evento `onHome`, navegará a `/folder/Inbox`
5. El botón de guardar no emite evento si está deshabilitado o en loading

## 🔗 Dependencias

- `@ionic/angular`
- `@ngx-translate/core`
- `@angular/router`

## 📝 Traducciones Necesarias

Asegúrate de tener estas claves en tus archivos de traducción:

```json
{
  "common": {
    "save": "Guardar",
    "back": "Atrás",
    "update": "Actualizar",
    "cancel": "Cancelar"
  }
}
```









