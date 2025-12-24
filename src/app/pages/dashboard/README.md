# 📊 Dashboard Component - Panel de Estadísticas

## 📁 Ubicación
`src/app/pages/dashboard/`

---

## 🎯 Descripción

Componente standalone que muestra estadísticas de mantenimientos y costos mediante gráficos interactivos. Actualmente utiliza **datos hardcodeados** para demostración, listos para ser reemplazados con datos reales desde servicios HTTP.

---

## 🔧 Tecnologías Utilizadas

- **Angular**: Framework principal
- **Ionic**: Componentes UI
- **Chart.js + ng2-charts**: Librería de gráficos
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos (en `global.scss`)

---

## 📊 Características

### 1. **Tarjetas de Resumen**
Muestra 3 métricas clave:
- Total de mantenimientos: `58`
- Costo total: `€57,643`
- Última actualización: Fecha actual

### 2. **Gráfica de Tipos de Mantenimiento (Doughnut)**
- **Eléctrico**: 30%
- **Mecánico**: 35%
- **Hidráulico**: 25%
- **Preventivo**: 10%

### 3. **Gráfica de Costos (Barras Horizontales)**
- **Combustible**: €34,000
- **Repuestos**: €430
- **Taller**: €23,213

---

## 🚀 Navegación

La ruta `/dashboard` está configurada en `src/app/app.routes.ts`:

```typescript
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadComponent: () =>
    import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
}
```

**El botón "Home" del footer (`app-footer`)** ahora navega automáticamente a `/dashboard`.

---

## 🔄 Conexión con Datos Reales

### Paso 1: Crear un servicio de estadísticas

Crea un servicio en `src/app/utils/dashboard.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaintenanceStats {
  electrical: number;
  mechanical: number;
  hydraulic: number;
  preventive: number;
}

export interface CostStats {
  fuel: number;
  parts: number;
  workshop: number;
}

export interface DashboardSummary {
  totalMaintenances: number;
  totalCost: number;
  lastUpdate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'YOUR_API_URL_HERE';

  constructor(private http: HttpClient) {}

  getMaintenanceStats(): Observable<MaintenanceStats> {
    return this.http.get<MaintenanceStats>(`${this.apiUrl}/stats/maintenance-types`);
  }

  getCostStats(): Observable<CostStats> {
    return this.http.get<CostStats>(`${this.apiUrl}/stats/costs`);
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/stats/summary`);
  }
}
```

### Paso 2: Actualizar el componente

Modifica `dashboard.component.ts`:

```typescript
import { DashboardService } from '../../utils/dashboard.service';

// En el constructor:
constructor(private dashboardService: DashboardService) {}

// En loadMaintenanceStats():
loadMaintenanceStats(): void {
  this.dashboardService.getMaintenanceStats().subscribe({
    next: (data) => {
      this.maintenanceChartData.datasets[0].data = [
        data.electrical,
        data.mechanical,
        data.hydraulic,
        data.preventive
      ];
    },
    error: (error) => {
      console.error('Error al cargar estadísticas:', error);
    }
  });
}

// En loadCostStats():
loadCostStats(): void {
  this.dashboardService.getCostStats().subscribe({
    next: (data) => {
      this.costChartData.datasets[0].data = [
        data.fuel,
        data.parts,
        data.workshop
      ];
    },
    error: (error) => {
      console.error('Error al cargar costos:', error);
    }
  });
}
```

### Paso 3: Cargar el resumen

Agrega un nuevo método en `ngOnInit()`:

```typescript
ngOnInit() {
  this.loadDashboardSummary();
  this.loadMaintenanceStats();
  this.loadCostStats();
}

loadDashboardSummary(): void {
  this.dashboardService.getDashboardSummary().subscribe({
    next: (data) => {
      this.totalMaintenances = data.totalMaintenances;
      this.totalCost = data.totalCost;
      this.lastUpdate = new Date(data.lastUpdate);
    },
    error: (error) => {
      console.error('Error al cargar resumen:', error);
    }
  });
}
```

---

## 🎨 Personalización de Colores

Los colores de los gráficos se pueden personalizar en `dashboard.component.ts`:

### Gráfica de Tipos de Mantenimiento
```typescript
backgroundColor: [
  '#4A90E2', // Azul - Eléctrico
  '#F5A623', // Naranja - Mecánico
  '#7ED321', // Verde - Hidráulico
  '#D0021B'  // Rojo - Preventivo
]
```

### Gráfica de Costos
```typescript
backgroundColor: [
  '#1a1a1a', // Negro - Combustible
  '#4a4a4a', // Gris oscuro - Repuestos
  '#7a7a7a'  // Gris medio - Taller
]
```

---

## 📱 Responsive Design

El dashboard se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop (> 768px)**: Grid de 2 columnas para gráficas
- **Tablet (481px - 768px)**: Grid de 1 columna
- **Mobile (≤ 480px)**: Diseño compacto con tamaños reducidos

---

## 🔄 Actualización Manual

El botón de **refresh** en el header permite recargar los datos:

```typescript
refreshDashboard(): void {
  this.lastUpdate = new Date();
  this.loadMaintenanceStats();
  this.loadCostStats();
  // Agregar aquí la recarga del resumen si usas datos reales
}
```

---

## 📚 Archivos del Componente

| Archivo | Descripción |
|---------|-------------|
| `dashboard.component.ts` | Lógica del componente y configuración de gráficos |
| `dashboard.component.html` | Template con estructura del dashboard |
| `dashboard.component.scss` | Estilos específicos (actualmente vacío, usa global.scss) |
| `README.md` | Este archivo de documentación |

---

## ✨ Características Adicionales

### Método `formatNumber()`
Formatea números con separador de miles:
```typescript
formatNumber(num: number): string {
  return num.toLocaleString('es-ES');
}
```

**Uso**: `{{ formatNumber(totalCost) }}` → `57.643`

---

## 🐛 Troubleshooting

### Los gráficos no se muestran
1. Verifica que `chart.js` y `ng2-charts` estén instalados
2. Asegúrate de que `chart-config.ts` esté importado en `main.ts`
3. Comprueba que `BaseChartDirective` esté en los imports del componente

### Error "Cannot find module chart.js"
Ejecuta:
```bash
npm install chart.js ng2-charts --save
```

### Los datos no se actualizan
- Verifica la consola del navegador para errores HTTP
- Asegúrate de que el servicio esté correctamente inyectado
- Comprueba que las rutas de la API sean correctas

---

## 📄 Licencia

Este componente es parte del proyecto de gestión de mantenimientos y sigue la misma licencia del proyecto principal.

---

**Desarrollado con ❤️ para un dashboard moderno, limpio y profesional**









