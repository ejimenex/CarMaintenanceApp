# 📋 Guía de Separadores para Listas

## 🎨 Descripción

Se han agregado separadores elegantes y modernos para todas las listas en el proyecto. Los separadores están implementados usando CSS puro y no requieren cambios en el HTML.

## ✨ Características

### Separador por Defecto
- **Gradiente suave**: Línea que se desvanece en los extremos
- **Efecto hover**: El separador se atenúa al pasar el cursor
- **Sin separador en último item**: Automáticamente oculto
- **Animación suave**: Transiciones fluidas

### Efectos Interactivos
- **Hover**: Fondo sutil gris cuando se pasa el cursor
- **Active**: Efecto de escala al hacer clic
- **Smooth transitions**: Todas las transiciones son suaves

## 🎯 Uso

### Básico (Ya Implementado)
Todas las listas con la clase `.uniform-list` ya tienen los separadores:

```html
<div class="uniform-list">
  @for (item of items; track item.id) {
    <ion-item>
      <!-- Contenido del item -->
    </ion-item>
  }
</div>
```

### Variantes Disponibles

#### 1. **Separador Estándar** (Default)
Línea delgada con gradiente suave.

```html
<div class="uniform-list">
  <!-- items aquí -->
</div>
```

**Visual**: 
```
━━━━━━━━━━━━━━━━━  (gradiente suave, 1px)
```

---

#### 2. **Separador Más Marcado**
Línea más gruesa y visible.

```html
<div class="uniform-list with-dividers">
  <!-- items aquí -->
</div>
```

**Visual**: 
```
━━━━━━━━━━━━━━━━━  (gradiente marcado, 2px)
```

---

#### 3. **Separador con Color Primario**
Línea con el color primario de la app.

```html
<div class="uniform-list with-color-dividers">
  <!-- items aquí -->
</div>
```

**Visual**: 
```
━━━━━━━━━━━━━━━━━  (color primario con transparencia)
```

---

#### 4. **Separador de Línea Completa**
Línea que va de borde a borde.

```html
<div class="uniform-list full-dividers">
  <!-- items aquí -->
</div>
```

**Visual**: 
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  (de borde a borde)
```

---

#### 5. **Lista con Espaciado**
Items separados con espacio, sin líneas.

```html
<div class="uniform-list spaced">
  <!-- items aquí -->
</div>
```

**Visual**: 
```
┌─────────────┐
│   Item 1    │
└─────────────┘
                 ← espacio
┌─────────────┐
│   Item 2    │
└─────────────┘
```

---

## 📱 Responsive

Los separadores son completamente responsivos y se adaptan automáticamente a:
- ✅ Móviles
- ✅ Tablets
- ✅ Desktop

## 🎨 Personalización

### Cambiar el Color del Separador

Puedes personalizar el color del separador usando CSS custom:

```css
.custom-list ion-item::after {
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 0, 0, 0.2) 20%,  /* Color personalizado */
    rgba(255, 0, 0, 0.2) 80%,
    transparent
  );
}
```

### Cambiar el Grosor

```css
.custom-list ion-item::after {
  height: 3px; /* Cambia el grosor */
}
```

### Ajustar el Espaciado

```css
.custom-list ion-item {
  padding: 20px 0; /* Más espacio arriba y abajo */
}
```

## 🌓 Dark Mode

Los separadores se adaptan automáticamente al modo oscuro:
- En **modo claro**: Línea gris oscura sutil
- En **modo oscuro**: Línea gris clara sutil

## 📍 Ubicación del Código

Los estilos de los separadores están en:
- **Archivo**: `src/global.scss`
- **Líneas**: 230-346
- **Sección**: "SEPARADORES BONITOS PARA LISTAS"

## 🚀 Listas Actualizadas

Las siguientes listas ya tienen los separadores implementados:
- ✅ `vehicles-list`
- ✅ `maintenance-list`
- ✅ `work-shops-list`
- ✅ `maintenance-detail-list`
- ✅ `fuel-detail-list`
- ✅ `insurance-detail-list`

## 💡 Tips

1. **Para listas largas**: Usa el separador estándar (más sutil)
2. **Para destacar items**: Usa `with-dividers` o `with-color-dividers`
3. **Para cards visuales**: Usa `spaced`
4. **Para menús**: Usa `full-dividers`

## 🔧 Solución de Problemas

### El separador no aparece
- Verifica que el contenedor tenga la clase `.uniform-list`
- Asegúrate de que los items sean `<ion-item>`

### El separador es muy grueso
- Revisa si accidentalmente usaste `with-dividers`
- Puedes ajustar el `height` en CSS

### El hover no funciona
- Verifica que no haya estilos conflictivos en el componente
- Usa `!important` si es necesario

## 📝 Ejemplo Completo

```html
<!-- vehicles-list.component.html -->
<div class="uniform-list">
  @for (vehicle of vehicles; track vehicle.id; let i = $index) {
    <ion-item class="vehicle-item">
      <div slot="start" class="vehicle-number">
        <span class="number-badge">{{ i + 1 }}</span>
      </div>
      <ion-label>
        <h2>{{ vehicle.name }}</h2>
        <p>{{ vehicle.plateNumber }}</p>
      </ion-label>
      <ion-button slot="end" fill="clear">
        <ion-icon name="ellipsis-vertical"></ion-icon>
      </ion-button>
    </ion-item>
  }
</div>
```

---

**Resultado**: 🎉 Lista con separadores bonitos, elegantes y con efectos suaves de hover!









