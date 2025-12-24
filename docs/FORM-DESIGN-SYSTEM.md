# 📋 Sistema de Diseño de Formularios

## Diseño Moderno Blanco y Negro para Ionic

Este documento describe el sistema de diseño de formularios implementado en la aplicación Ionic con temática **blanco y negro profesional**.

---

## 🎨 Características Principales

### ✅ Diseño Uniforme
- **Ion-input**, **ion-select** y **ion-textarea** tienen el mismo aspecto visual
- Bordes, padding, altura y estilos consistentes en todos los campos
- Estados hover y focus claramente definidos

### ✅ Temática Blanca y Negra
- Fondo blanco (#ffffff)
- Textos en negro/gris oscuro (#1a1a1a, #666666)
- Bordes en tonos grises (#e0e0e0, #b0b0b0, #2a2a2a)
- Focus state en negro puro (#000000)

### ✅ Responsive
- Adapta automáticamente en móviles, tablets y desktop
- Grid de 2 columnas se convierte en 1 columna en móviles
- Tamaños de fuente y espaciado ajustados según el dispositivo

### ✅ Iconos Descriptivos
- Cada campo tiene un icono que representa visualmente su contenido
- Ejemplos: `car-sport-outline` para vehículos, `construct-outline` para talleres

### ✅ Validación Visual
- Estados de error con fondo rojo claro y borde rojo
- Mensajes de error con iconos
- Estados focus con sombra sutil

---

## 📦 Componentes del Sistema

### 1. Variables CSS (`:root` en `global.scss`)

```css
:root {
  /* Colores Base - Blanco y Negro */
  --form-bg-primary: #ffffff;
  --form-bg-secondary: #fafafa;
  --form-text-primary: #1a1a1a;
  --form-text-secondary: #666666;
  --form-text-placeholder: #999999;
  
  /* Bordes y Líneas */
  --form-border-light: #e0e0e0;
  --form-border-medium: #b0b0b0;
  --form-border-dark: #2a2a2a;
  --form-border-focus: #000000;
  
  /* Sombras */
  --form-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --form-shadow-md: 0 2px 8px rgba(0, 0, 0, 0.12);
  --form-shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.16);
  --form-shadow-focus: 0 0 0 3px rgba(0, 0, 0, 0.08);
  
  /* Espaciado */
  --form-field-height: 52px;
  --form-field-padding-x: 16px;
  --form-field-padding-y: 12px;
  --form-field-gap: 20px;
  --form-border-width: 2px;
  --form-border-radius: 8px;
}
```

---

## 🏗️ Estructura HTML de Formularios

### Estructura Básica

```html
<ion-content [fullscreen]="true">
  <div class="form-container">
    <form [formGroup]="myForm" (ngSubmit)="save()">
      
      <!-- HEADER -->
      <div class="form-header">
        <ion-icon name="car-sport-outline" class="header-icon"></ion-icon>
        <h2>Título del Formulario</h2>
        <p>Descripción breve</p>
      </div>

      <!-- SECCIÓN 1 -->
      <div class="form-section">
        <div class="section-title">
          <ion-icon name="information-circle-outline"></ion-icon>
          <span>Sección Título</span>
        </div>

        <div class="form-fields">
          <!-- Campo 1 -->
          <div class="field-group" [class.has-error]="form.get('fieldName')?.invalid && form.get('fieldName')?.touched">
            <label class="field-label">
              <ion-icon name="text-outline"></ion-icon>
              Campo Label *
            </label>
            <ion-input 
              formControlName="fieldName" 
              placeholder="Introduce el valor">
            </ion-input>
            @if (form.get('fieldName')?.invalid && form.get('fieldName')?.touched) {
              <div class="error-message">
                <ion-icon name="alert-circle-outline"></ion-icon>
                {{ getFieldError('fieldName') }}
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Separador -->
      <hr class="form-divider">

      <!-- SECCIÓN 2 -->
      <!-- ... más secciones ... -->

    </form>

    <!-- Loading Overlay -->
    @if (loading) {
      <div class="loading-overlay">
        <div class="loading-content">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Guardando...</p>
        </div>
      </div>
    }
  </div>
</ion-content>

<!-- Footer con botones -->
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'common.save'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="loading"
  [customBackRoute]="'/back-route'"
  (onSave)="save()"
  (onBack)="cancel()">
</app-footer>
```

---

## 📐 Clases CSS Disponibles

### Contenedores

| Clase | Descripción |
|-------|-------------|
| `.form-container` | Contenedor principal del formulario (max-width: 800px, centrado) |
| `.form-header` | Cabecera del formulario con ícono, título y descripción |
| `.form-section` | Sección agrupada de campos con título |
| `.form-fields` | Contenedor de campos de formulario |

### Campos

| Clase | Descripción |
|-------|-------------|
| `.field-group` | Grupo de campo con label, input y mensaje de error |
| `.field-label` | Label del campo con icono opcional |
| `.field-hint` | Texto de ayuda debajo del campo |
| `.error-message` | Mensaje de error con icono |
| `.has-error` | Añadir a `.field-group` cuando hay error |

### Layout

| Clase | Descripción |
|-------|-------------|
| `.form-row` | Grid de 2 columnas (1 columna en móvil) |
| `.form-divider` | Línea separadora entre secciones |
| `.section-title` | Título de sección con icono |

### Estados y Overlays

| Clase | Descripción |
|-------|-------------|
| `.loading-overlay` | Overlay de carga a pantalla completa |
| `.loading-content` | Contenido del overlay (spinner + texto) |
| `.input-loading` | Indicador de carga en input específico |

---

## 🎯 Ejemplos de Uso

### Campo de Texto Simple

```html
<div class="field-group" [class.has-error]="form.get('name')?.invalid && form.get('name')?.touched">
  <label class="field-label">
    <ion-icon name="text-outline"></ion-icon>
    Nombre *
  </label>
  <ion-input 
    formControlName="name" 
    placeholder="Introduce el nombre">
  </ion-input>
  @if (form.get('name')?.invalid && form.get('name')?.touched) {
    <div class="error-message">
      <ion-icon name="alert-circle-outline"></ion-icon>
      {{ getFieldError('name') }}
    </div>
  }
</div>
```

### Select Dropdown

```html
<div class="field-group" [class.has-error]="form.get('vehicleId')?.invalid && form.get('vehicleId')?.touched">
  <label class="field-label">
    <ion-icon name="car-sport-outline"></ion-icon>
    Vehículo *
  </label>
  <ion-select 
    formControlName="vehicleId" 
    placeholder="Selecciona un vehículo"
    interface="popover">
    @for (vehicle of vehicles; track vehicle.id) {
      <ion-select-option [value]="vehicle.id">
        {{ vehicle.name }}
      </ion-select-option>
    }
  </ion-select>
  @if (form.get('vehicleId')?.invalid && form.get('vehicleId')?.touched) {
    <div class="error-message">
      <ion-icon name="alert-circle-outline"></ion-icon>
      {{ getFieldError('vehicleId') }}
    </div>
  }
</div>
```

### Grid de 2 Columnas

```html
<div class="form-row">
  <!-- Campo 1 -->
  <div class="field-group">
    <label class="field-label">
      <ion-icon name="calendar-outline"></ion-icon>
      Año
    </label>
    <ion-input 
      formControlName="year" 
      type="number" 
      placeholder="2024">
    </ion-input>
  </div>

  <!-- Campo 2 -->
  <div class="field-group">
    <label class="field-label">
      <ion-icon name="speedometer-outline"></ion-icon>
      Kilometraje
    </label>
    <ion-input 
      formControlName="mileage" 
      type="number" 
      placeholder="50000">
    </ion-input>
  </div>
</div>
```

### Textarea con Hint

```html
<div class="field-group">
  <label class="field-label">
    <ion-icon name="document-text-outline"></ion-icon>
    Notas
  </label>
  <ion-textarea 
    formControlName="notes" 
    placeholder="Añade notas adicionales">
  </ion-textarea>
  <div class="field-hint">
    Máximo 500 caracteres
  </div>
</div>
```

---

## 🎨 Botones

### Estilos de Botones

| Color | Uso | Ejemplo |
|-------|-----|---------|
| `color="primary"` | Acción principal (Negro) | Guardar, Actualizar |
| `fill="outline"` | Acción secundaria (Outline negro) | Cancelar |
| `fill="clear"` | Acción terciaria (Sin fondo) | Opciones |
| `color="medium"` | Acción neutral (Gris) | Volver |
| `color="danger"` | Acción destructiva (Rojo) | Eliminar |
| `color="success"` | Acción positiva (Verde oscuro) | Confirmar |

### Ejemplo de Botones

```html
<!-- Botón Primario -->
<ion-button color="primary">
  <ion-icon name="checkmark-outline" slot="start"></ion-icon>
  Guardar
</ion-button>

<!-- Botón Outline -->
<ion-button fill="outline">
  <ion-icon name="close-outline" slot="start"></ion-icon>
  Cancelar
</ion-button>

<!-- Botón Danger -->
<ion-button color="danger">
  <ion-icon name="trash-outline" slot="start"></ion-icon>
  Eliminar
</ion-button>
```

---

## 🧩 Componente App-Footer

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `showBackButton` | boolean | `true` | Mostrar botón "Volver" |
| `showHomeButton` | boolean | `true` | Mostrar botón "Dashboard" |
| `showSaveButton` | boolean | `false` | Mostrar botón "Guardar" |
| `saveButtonText` | string | `'common.save'` | Texto del botón guardar |
| `saveButtonDisabled` | boolean | `false` | Deshabilitar botón guardar |
| `saveButtonLoading` | boolean | `false` | Mostrar spinner en botón |
| `customBackRoute` | string | `undefined` | Ruta personalizada para volver |

### Eventos

| Evento | Descripción |
|--------|-------------|
| `(onSave)` | Evento al hacer clic en "Guardar" |
| `(onBack)` | Evento al hacer clic en "Volver" |
| `(onHome)` | Evento al hacer clic en "Dashboard" |

### Ejemplo de Uso

```html
<app-footer
  [showSaveButton]="true"
  [saveButtonText]="'vehicles.actions.save'"
  [saveButtonDisabled]="!form.valid"
  [saveButtonLoading]="loading"
  [customBackRoute]="'/vehicles'"
  (onSave)="saveVehicle()"
  (onBack)="cancelForm()">
</app-footer>
```

---

## 📱 Responsive Breakpoints

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|----------------|
| Desktop | > 768px | Grid 2 columnas, botones horizontales |
| Tablet | 481px - 768px | Grid 2 columnas, botones horizontales |
| Mobile | ≤ 480px | Grid 1 columna, botones verticales, padding reducido |

---

## 🌙 Dark Mode (Opcional)

El sistema incluye soporte para dark mode automático basado en la preferencia del sistema:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --form-bg-primary: #1a1a1a;
    --form-bg-secondary: #2a2a2a;
    --form-text-primary: #ffffff;
    --form-border-focus: #ffffff;
    /* ... más variables ... */
  }
}
```

---

## ✨ Mejores Prácticas

1. **Siempre usa iconos descriptivos** en los labels para mejorar la UX
2. **Agrupa campos relacionados** en `<div class="form-section">`
3. **Usa `form-row`** para campos que van juntos (ej: año y kilometraje)
4. **Añade `field-hint`** para dar contexto adicional al usuario
5. **Valida en tiempo real** mostrando errores cuando el campo pierde el foco
6. **Usa el loading overlay** durante operaciones asíncronas
7. **Mantén consistencia** en los placeholders y mensajes de error
8. **No uses clases CSS personalizadas** en los componentes de formulario individuales

---

## 🚀 Formularios Actualizados

Los siguientes formularios ya han sido actualizados con el nuevo diseño:

✅ `vehicles-add.component.html`
✅ `vehicles-edit.component.html`
✅ `work-shops-add.component.html`
✅ `work-shops-edit.component.html`
✅ `maintenance-add.component.html`

---

## 📚 Iconos Ionic Recomendados

### Por Tipo de Campo

| Tipo de Campo | Icono Recomendado |
|---------------|-------------------|
| Nombre/Texto | `text-outline` |
| Vehículo | `car-sport-outline` |
| Taller | `construct-outline` |
| Dirección | `location-outline` |
| Teléfono | `call-outline` |
| Email | `mail-outline` |
| Fecha | `calendar-outline` |
| Hora | `time-outline` |
| Precio/Dinero | `cash-outline` |
| Kilometraje | `speedometer-outline` |
| Color | `color-palette-outline` |
| Marca | `logo-buffer` |
| Tipo | `options-outline` |
| Notas | `document-text-outline` |

---

## 🐛 Troubleshooting

### Los inputs no tienen bordes
- Verifica que `global.scss` esté correctamente importado
- Asegúrate de no tener `fill="outline"` en los inputs
- Revisa que no haya CSS personalizado sobrescribiendo los estilos globales

### Los selects se ven diferentes a los inputs
- Usa `interface="popover"` en todos los `ion-select`
- No uses clases como `modern-input` o `modern-select`
- Los estilos globales ya se encargan de todo

### El responsive no funciona
- Verifica que uses `.form-row` para grids de 2 columnas
- No uses `ion-grid`, `ion-row`, `ion-col` dentro de formularios
- Los media queries están en `global.scss`

---

## 📄 Archivos Clave

- **Estilos globales**: `src/global.scss`
- **Componente Footer**: `src/app/shared/components/app-footer/`
- **Formularios de ejemplo**: `src/app/features/vehicles/crud/add/`

---

**Desarrollado con ❤️ para un diseño moderno, limpio y profesional**









