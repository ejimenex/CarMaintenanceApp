# Guía Visual del App Footer

## 📐 Layout del Footer

```
┌──────────────────────────────────────────────────────────┐
│                    APP FOOTER                            │
├──────────────────────────────────────────────────────────┤
│  [← Atrás]     [flexspace]     [🏠]     [✓ Guardar]    │
└──────────────────────────────────────────────────────────┘
```

## 🎨 Estados del Footer

### 1️⃣ Footer Completo (Formulario de Editar/Agregar)
```
┌──────────────────────────────────────────────────────────┐
│  [← Atrás]           [🏠 Home]         [✓ Guardar]      │
└──────────────────────────────────────────────────────────┘
     ↓                    ↓                   ↓
   Volver           Ir a Dashboard      Guardar cambios
```

### 2️⃣ Footer de Navegación (Vista/Lista)
```
┌──────────────────────────────────────────────────────────┐
│  [← Atrás]                        [🏠 Home]              │
└──────────────────────────────────────────────────────────┘
     ↓                                   ↓
   Volver                          Ir a Dashboard
```

### 3️⃣ Footer de Modal (Sin Home)
```
┌──────────────────────────────────────────────────────────┐
│  [← Cancelar]                         [✓ Guardar]        │
└──────────────────────────────────────────────────────────┘
     ↓                                       ↓
  Cerrar Modal                         Guardar y cerrar
```

### 4️⃣ Footer Simple (Solo Guardar)
```
┌──────────────────────────────────────────────────────────┐
│                    [✓ Guardar Cambios]                   │
└──────────────────────────────────────────────────────────┘
                           ↓
                    Guardar formulario
```

## 🎭 Variaciones de Botones

### Botón Volver Atrás
```css
┌─────────────┐
│ ← Atrás     │  Estado normal
└─────────────┘

┌─────────────┐
│ ← Atrás     │  Hover (azul + desplazamiento)
└─────────────┘
```

### Botón Dashboard
```css
┌─────┐
│ 🏠  │  Estado normal (fondo gris claro)
└─────┘

┌─────┐
│ 🏠  │  Hover (fondo azul + elevación)
└─────┘
```

### Botón Guardar
```css
┌──────────────┐
│ ✓ Guardar    │  Estado normal (azul con gradiente)
└──────────────┘

┌──────────────┐
│ ✓ Guardar    │  Hover (elevación + sombra)
└──────────────┘

┌──────────────┐
│ ⏳ Guardando │  Loading (spinner)
└──────────────┘

┌──────────────┐
│ ✓ Guardar    │  Deshabilitado (gris)
└──────────────┘
```

## 📱 Responsive Breakpoints

### Desktop (> 768px)
```
┌────────────────────────────────────────────────────────────────┐
│  [← Atrás]              [🏠 Home]            [✓ Guardar]       │
└────────────────────────────────────────────────────────────────┘
   Texto visible        Texto visible           Texto visible
```

### Tablet (480px - 768px)
```
┌────────────────────────────────────────────────────────┐
│  [←]                  [🏠]              [✓ Guardar]    │
└────────────────────────────────────────────────────────┘
  Solo icono          Solo icono         Texto + icono
```

### Mobile (< 480px)
```
┌──────────────────────────────────────────────────┐
│  [←]            [🏠]          [✓ Guardar]       │
└──────────────────────────────────────────────────┘
Compacto       Compacto         Compacto
```

## 🎨 Paleta de Colores

### Light Mode
```
Fondo Footer:        #FFFFFF (blanco)
Borde:              rgba(0, 0, 0, 0.08)
Sombra:             0 -2px 10px rgba(0, 0, 0, 0.1)

Botón Atrás:
  - Color: #666666 (gris medio)
  - Hover: #3880ff (azul primario)

Botón Home:
  - Fondo: #f4f4f4 (gris claro)
  - Color: #3880ff (azul)
  - Hover fondo: #3880ff (azul)
  - Hover color: #ffffff (blanco)

Botón Guardar:
  - Fondo: linear-gradient(135deg, #3880ff 0%, #3171e0 100%)
  - Color: #ffffff
  - Hover: Elevación + sombra azul
  - Disabled: #94a3b8 (gris)
```

### Dark Mode
```
Fondo Footer:        #1e1e1e (negro suave)
Borde:              rgba(255, 255, 255, 0.1)
Sombra:             0 -2px 10px rgba(0, 0, 0, 0.5)

Botón Atrás:
  - Color: #a0a0a0 (gris claro)
  - Hover: #3880ff (azul primario)

Botón Home:
  - Fondo: #2a2a2a (gris oscuro)
  - Color: #3880ff (azul)
  - Hover: Igual que light mode

Botón Guardar:
  - Igual que light mode
```

## 📏 Dimensiones

```
Altura Footer:           60px
Altura Botones:          44px
Padding Horizontal:      16px
Padding Vertical:        8px
Gap entre botones:       8px

Border Radius:           12px (botones)
Fuente:                  0.95rem (15.2px)
Peso fuente:             600 (semi-bold)

Iconos:
  - Tamaño general:      1.3rem (20.8px)
  - Atrás:              1.4rem (22.4px)
  - Home:               1.5rem (24px)

Ancho mínimo:
  - Botón Guardar:      120px
  - Botón Home:         44px
  - Botón Atrás:        flexible
```

## 🎬 Animaciones

### Entrada del Footer
```
Animation: slideUp
Duration: 0.3s
Easing: ease-out

Keyframes:
  0%:   transform: translateY(100%), opacity: 0
  100%: transform: translateY(0), opacity: 1
```

### Hover en Botones
```
Botón Atrás:
  - transform: translateX(-2px)
  - duration: 0.3s

Botón Home/Guardar:
  - transform: translateY(-2px)
  - box-shadow: aumenta
  - duration: 0.3s
```

### Ripple Effect
```
Click en botón:
  - Círculo se expande desde el centro
  - Color: rgba(255, 255, 255, 0.4)
  - Tamaño final: 200px
  - Duration: 0.3s
```

## 🧩 Composición del Component

```
app-footer
├── ion-footer.app-footer
│   └── ion-toolbar.footer-toolbar
│       └── div.footer-content
│           ├── ion-button.footer-button.back-button [*ngIf]
│           │   ├── ion-icon (arrow-back-outline)
│           │   └── span.button-text
│           ├── div.footer-spacer
│           ├── ion-button.footer-button.home-button [*ngIf]
│           │   └── ion-icon (home-outline)
│           └── ion-button.footer-button.save-button [*ngIf]
│               ├── ion-spinner [*ngIf loading]
│               ├── ion-icon [*ngIf !loading] (checkmark-circle-outline)
│               └── span.button-text [*ngIf !loading]
```

## 🎯 Casos de Uso Visual

### Formulario de Agregar
```
HEADER:  "Agregar Vehículo"
CONTENT: [Formulario con campos]
FOOTER:  [← Atrás] [spacer] [🏠] [✓ Guardar]
```

### Formulario de Editar
```
HEADER:  "Editar Vehículo"
CONTENT: [Formulario con datos cargados]
FOOTER:  [← Atrás] [spacer] [🏠] [✓ Actualizar]
         └─ Solo activo si hay cambios (form.dirty)
```

### Vista de Detalles
```
HEADER:  "Toyota Corolla 2020"
CONTENT: [Información del vehículo]
FOOTER:  [← Atrás] [spacer] [🏠]
         └─ Sin botón guardar
```

### Lista
```
HEADER:  "Vehículos (5)"
CONTENT: [Lista de items con búsqueda]
FOOTER:  [← Atrás] [spacer] [🏠]
```

### Modal
```
HEADER:  "Agregar Repuesto"
CONTENT: [Formulario pequeño]
FOOTER:  [← Cancelar] [spacer] [✓ Agregar]
         └─ Sin botón home
```

## 📱 Screenshots Conceptuales

### Estado Normal
```
╔════════════════════════════════════════════╗
║  Agregar Vehículo                    [X]   ║
╠════════════════════════════════════════════╣
║                                            ║
║  [📝 Formulario de vehículo]              ║
║                                            ║
║  Nombre: [_________________]               ║
║  Placa:  [_________________]               ║
║  Marca:  [▼_________________]              ║
║                                            ║
╠════════════════════════════════════════════╣
║  [← Atrás]        [🏠]     [✓ Guardar]    ║
╚════════════════════════════════════════════╝
```

### Estado Loading
```
╔════════════════════════════════════════════╗
║  Agregar Vehículo                    [X]   ║
╠════════════════════════════════════════════╣
║                                            ║
║  [Formulario deshabilitado mientras        ║
║   se guarda...]                            ║
║                                            ║
╠════════════════════════════════════════════╣
║  [← Atrás]        [🏠]     [⏳ Guardando] ║
╚════════════════════════════════════════════╝
```

### Estado Deshabilitado
```
╔════════════════════════════════════════════╗
║  Agregar Vehículo                    [X]   ║
╠════════════════════════════════════════════╣
║                                            ║
║  Nombre: [_________________] ❌            ║
║  Placa:  [                 ]               ║
║  Marca:  [▼_________________]              ║
║                                            ║
╠════════════════════════════════════════════╣
║  [← Atrás]        [🏠]     [✓ Guardar]    ║
║                                   (Gris)   ║
╚════════════════════════════════════════════╝
```

## 🎪 Interacciones

```
Usuario hace clic en "Atrás"
  ↓
¿Hay cambios sin guardar?
  ├─ Sí → Mostrar diálogo de confirmación
  │         └─ Confirmar → Volver
  │         └─ Cancelar → Quedarse
  └─ No → Volver inmediatamente

Usuario hace clic en "Home"
  ↓
Navegar a Dashboard (/folder/Inbox)

Usuario hace clic en "Guardar"
  ↓
¿Formulario válido?
  ├─ Sí → Mostrar loading
  │         └─ Guardar datos
  │             ├─ Éxito → Navegar
  │             └─ Error → Mostrar mensaje
  └─ No → No hacer nada (botón deshabilitado)
```

## 🎨 Inspiración Instagram

El diseño está inspirado en el footer de Instagram:
- ✅ Minimalista y limpio
- ✅ Botones con iconos claros
- ✅ Colores sutiles en modo claro
- ✅ Transiciones suaves
- ✅ Fixed al fondo de la pantalla
- ✅ Sombra sutil superior
- ✅ Espaciado generoso









