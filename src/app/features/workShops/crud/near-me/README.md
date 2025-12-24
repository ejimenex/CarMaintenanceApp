# Componente "Talleres Cerca de Mí" / "Workshops Near Me"

## Descripción

Este componente muestra un mapa interactivo con los talleres y repuestos cercanos a la ubicación del usuario. Utiliza la geolocalización del dispositivo y Google Maps para proporcionar una experiencia visual e interactiva.

## Características

- 🗺️ **Mapa interactivo**: Visualización de talleres en un mapa de Google Maps
- 📍 **Geolocalización**: Obtiene automáticamente la ubicación del usuario
- 🔍 **Filtrado por distancia**: Muestra solo talleres dentro de un radio de 10 km
- 📱 **Acciones rápidas**: Llamar, obtener direcciones o ver detalles de cada taller
- 🌐 **Multiidioma**: Soporte para español, inglés, portugués y ruso
- 📊 **Lista de talleres**: Vista de tarjetas con información detallada
- 🔄 **Actualización en tiempo real**: Botón para refrescar la ubicación y talleres

## Estructura de Archivos

```
src/app/features/workShops/crud/near-me/
├── workshops-near-me.component.ts      # Lógica del componente
├── workshops-near-me.component.html    # Template HTML
├── workshops-near-me.component.scss    # Estilos CSS/SCSS
└── README.md                           # Esta documentación
```

## Rutas

El componente está registrado en la ruta:
```
/workshops/near-me
```

## Configuración de Google Maps API

### Paso 1: Obtener una API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Places API (opcional, para búsqueda avanzada)
4. Crea credenciales (API Key) para tu proyecto
5. Configura restricciones de API Key:
   - Restricción de aplicación: Sitios web/Android/iOS según tu caso
   - Restricción de API: Maps JavaScript API

### Paso 2: Configurar la API Key en el Componente

Abre el archivo `workshops-near-me.component.ts` y reemplaza la línea:

```typescript
private readonly GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
```

Por tu API Key real:

```typescript
private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
```

### Paso 3: Variables de Entorno (Recomendado)

Para mayor seguridad, es recomendable usar variables de entorno:

1. En `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  googleMapsApiKey: 'YOUR_DEV_API_KEY'
};
```

2. En `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  googleMapsApiKey: 'YOUR_PROD_API_KEY'
};
```

3. En el componente:
```typescript
import { environment } from '../../../../../environments/environment';

// ...

private readonly GOOGLE_MAPS_API_KEY = environment.googleMapsApiKey;
```

## Permisos de Geolocalización

### Android (android/app/src/main/AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS (ios/App/App/Info.plist)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Esta aplicación necesita acceder a tu ubicación para mostrarte talleres cercanos.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>Esta aplicación necesita acceder a tu ubicación para mostrarte talleres cercanos.</string>
```

## Funcionalidades

### 1. Obtención de Ubicación

El componente solicita permisos de ubicación al usuario y obtiene las coordenadas actuales usando `@capacitor/geolocation`.

### 2. Visualización del Mapa

- Si Google Maps está disponible: Muestra un mapa interactivo con marcadores
- Si Google Maps no está disponible: Muestra un mapa mock con información visual

### 3. Marcadores en el Mapa

- **Marcador azul**: Tu ubicación actual
- **Marcadores rojos**: Ubicaciones de talleres cercanos

### 4. Tarjetas de Talleres

Cada taller muestra:
- Nombre
- Dirección
- Teléfono
- Tipo de taller
- Tipo de comercio
- Distancia desde tu ubicación

### 5. Acciones Disponibles

- **Llamar**: Abre la aplicación de teléfono con el número del taller
- **Indicaciones**: Abre Google Maps con direcciones desde tu ubicación
- **Ver**: Navega a los detalles completos del taller

## Personalización

### Cambiar el Radio de Búsqueda

En `workshops-near-me.component.ts`, modifica:

```typescript
searchRadius = 10; // km
```

### Modificar la Ubicación por Defecto

En `workshops-near-me.component.ts`, modifica:

```typescript
this.currentLocation = { lat: 10.4806, lng: -66.9036 }; // Caracas, Venezuela
```

### Personalizar Marcadores

Puedes cambiar los iconos de los marcadores en el método `addWorkshopMarkers()`:

```typescript
icon: {
  url: 'URL_TO_YOUR_CUSTOM_ICON',
  scaledSize: new google.maps.Size(40, 40)
}
```

## Traducciones

Las traducciones están disponibles en los siguientes archivos:

- `src/assets/i18n/en.json` - Inglés
- `src/assets/i18n/es.json` - Español
- `src/assets/i18n/pt.json` - Portugués
- `src/assets/i18n/ru.json` - Ruso

Claves de traducción principales:
- `workshops_near_me_title`
- `workshops_near_me_loading`
- `workshops_near_me_found`
- `workshops_near_me_call`
- `workshops_near_me_directions`
- Y más...

## Datos Mock

El componente incluye ubicaciones mock para demostración:

```typescript
private mockWorkshopLocations = [
  { lat: 10.4806, lng: -66.9036 }, // Caracas
  { lat: 10.4910, lng: -66.8792 },
  { lat: 10.5008, lng: -66.9145 },
  { lat: 10.4734, lng: -66.8856 },
  { lat: 10.4879, lng: -66.8965 }
];
```

**Nota**: En producción, deberías obtener las coordenadas reales desde tu backend o servicio.

## Integración con el Backend

Para obtener talleres con coordenadas reales, modifica el método `loadNearbyWorkshops()`:

```typescript
private async loadNearbyWorkshops() {
  try {
    this.loading = true;
    
    // Envía la ubicación actual al backend para obtener talleres cercanos
    const params = {
      latitude: this.currentLocation?.lat,
      longitude: this.currentLocation?.lng,
      radius: this.searchRadius
    };
    
    this.workshopService.getNearbyWorkshops(params).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.workshops = response.data;
          this.nearbyWorkshops = this.workshops;
          this.addWorkshopMarkers();
        }
      },
      error: (error) => {
        console.error('Error loading workshops:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  } catch (error) {
    console.error('Error loading nearby workshops:', error);
    this.loading = false;
  }
}
```

## Troubleshooting

### El mapa no se carga

1. Verifica que la API Key de Google Maps sea válida
2. Asegúrate de que Maps JavaScript API esté habilitada
3. Revisa las restricciones de la API Key
4. Verifica la consola del navegador para errores

### La geolocalización no funciona

1. Verifica los permisos en AndroidManifest.xml (Android) o Info.plist (iOS)
2. Asegúrate de que el usuario haya otorgado permisos
3. En el navegador, verifica que el sitio use HTTPS (geolocalización requiere contexto seguro)

### No se muestran talleres

1. Verifica que el servicio `WorkshopService` esté retornando datos
2. Revisa la consola para errores de red
3. Asegúrate de que los talleres tengan coordenadas asignadas

## Próximas Mejoras

- [ ] Agregar filtros por tipo de taller
- [ ] Implementar búsqueda de direcciones
- [ ] Agregar clustering de marcadores para muchos talleres
- [ ] Modo de vista satélite/mapa
- [ ] Guardar talleres favoritos
- [ ] Compartir ubicación del taller
- [ ] Integración con Waze para direcciones alternativas

## Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025

