# 🚀 Quick Start - App Footer

Guía rápida para empezar a usar el footer en 2 minutos.

## 📦 Instalación en 3 Pasos

### 1️⃣ Importa el componente
```typescript
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  standalone: true,
  imports: [
    // ... otros imports
    AppFooterComponent  // 👈 Agregar aquí
  ]
})
```

### 2️⃣ Agrega al template
```html
<!-- Al final de tu template, después de ion-content -->
<app-footer></app-footer>
```

### 3️⃣ ¡Listo! 🎉

## 🎯 Casos de Uso Comunes

### Formulario de Agregar
```html
<app-footer
  [showSaveButton]="true"
  [saveButtonDisabled]="!form.valid"
  (onSave)="save()">
</app-footer>
```

### Formulario de Editar
```html
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'common.update'"
  [saveButtonDisabled]="!form.valid || !form.dirty"
  (onSave)="update()">
</app-footer>
```

### Vista/Detalles
```html
<app-footer [showSaveButton]="false"></app-footer>
```

### Modal
```html
<app-footer
  [showHomeButton]="false"
  [showSaveButton]="true"
  (onSave)="save()"
  (onBack)="close()">
</app-footer>
```

## 📋 Template Completo

```html
<!-- tu-componente.html -->
<ion-header>
  <ion-toolbar>
    <ion-title>Tu Título</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- Tu contenido aquí -->
  <form [formGroup]="form">
    <!-- campos -->
  </form>
</ion-content>

<!-- 👇 Footer al final -->
<app-footer
  [showSaveButton]="true"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="isSaving"
  (onSave)="handleSave()">
</app-footer>
```

## 💻 Código del Componente

```typescript
// tu-componente.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppFooterComponent } from '@shared/components/app-footer';

@Component({
  selector: 'app-tu-componente',
  templateUrl: './tu-componente.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    AppFooterComponent  // 👈 Importar
  ]
})
export class TuComponente {
  form!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  async handleSave() {
    if (this.form.valid) {
      this.isSaving = true;
      try {
        // Tu lógica de guardado
        await this.service.save(this.form.value);
        this.router.navigate(['/success']);
      } finally {
        this.isSaving = false;
      }
    }
  }
}
```

## 🎛️ Props Más Usadas

| Prop | Valor por Defecto | Cuándo Usarla |
|------|-------------------|---------------|
| `showSaveButton` | `false` | Formularios (agregar/editar) |
| `saveButtonDisabled` | `false` | Mientras form no sea válido |
| `saveButtonLoading` | `false` | Mientras se guarda |
| `showHomeButton` | `true` | Ocultar en modales |
| `customBackRoute` | `undefined` | Navegar a ruta específica |

## ⚡ Tips Rápidos

1. **Siempre usa `[saveButtonDisabled]="!form.valid"`** en formularios
2. **Usa `[saveButtonLoading]="isSaving"`** para evitar doble clic
3. **En modales, oculta Home**: `[showHomeButton]="false"`
4. **Para edición, verifica cambios**: `!form.dirty`
5. **Personaliza el texto**: `[saveButtonText]="'mi.texto'"`

## 🐛 Problemas Comunes

### Footer no aparece
✅ Asegúrate de importar `AppFooterComponent`
✅ Verifica que esté después de `<ion-content>`

### Botón guardar no se habilita
✅ Revisa que el formulario sea válido
✅ Verifica `[saveButtonDisabled]`

### Navegación no funciona
✅ Importa y usa `Router` de `@angular/router`
✅ Verifica las rutas en tu app

## 📚 Más Información

- `README.md` - Documentación completa
- `EXAMPLES.md` - Ejemplos detallados
- `VISUAL-GUIDE.md` - Guía visual y diseño

## 🎨 Personalización Rápida

```scss
// En tu component.scss
app-footer {
  // Cambiar color del botón guardar
  .save-button {
    --background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}
```

## ✅ Checklist

- [ ] Importé `AppFooterComponent`
- [ ] Agregué `<app-footer>` al template
- [ ] Configuré `showSaveButton` si es formulario
- [ ] Conecté el evento `(onSave)`
- [ ] Agregué validación del formulario
- [ ] Implementé estado de loading
- [ ] Probé en móvil y desktop

¡Eso es todo! Ya tienes un footer profesional funcionando. 🎉









