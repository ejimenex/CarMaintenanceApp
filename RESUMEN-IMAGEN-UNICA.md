# ✅ IMPLEMENTACIÓN: UNA SOLA IMAGEN con FormData

## 🎯 CONFIGURACIÓN ACTUAL

El formulario de vehículos ahora permite **UNA SOLA IMAGEN** (no múltiples) usando FormData.

---

## 📝 CAMBIOS REALIZADOS

### Frontend

#### 1. **Component TypeScript** ✅
```typescript
// Solo UNA imagen
selectedImage: File | null = null;
imagePreview: string | null = null;

// En FormData se envía como 'image' (singular)
formData.append('image', this.selectedImage, this.selectedImage.name);
```

#### 2. **Component HTML** ✅
```html
<!-- Input sin "multiple" -->
<input type="file" id="vehicleImageInput" accept="image/*" (change)="onImageSelected($event)">

<!-- Vista previa de UNA imagen -->
@if (imagePreview) {
  <img [src]="imagePreview" alt="Vista previa">
  <button (click)="clearImage()">Eliminar</button>
  <button (click)="triggerFileInput()">Cambiar</button>
}
```

#### 3. **Component SCSS** ✅
- Estilos para una sola imagen centrada
- Preview grande (max 500px ancho)
- Botones para eliminar/cambiar

---

## 🔧 BACKEND (Referencia)

### DTO Actualizado

```csharp
public class VehicleCreateDto
{
    [Required] public string Name { get; set; }
    [Required] public string PlateNumber { get; set; }
    // ... otros campos
    
    /// <summary>
    /// UNA sola imagen
    /// Frontend envía: formData.append('image', file, fileName)
    /// </summary>
    public IFormFile? Image { get; set; } // ← Singular, no List
}
```

### Controller Actualizado

```csharp
[HttpPost("with-images")]
public async Task<IActionResult> CreateVehicleWithImages([FromForm] VehicleCreateDto dto)
{
    string? imagePath = null;

    // Procesar UNA imagen
    if (dto.Image != null)
    {
        byte[] imageBytes = await ConvertFormFileToBytes(dto.Image);
        imagePath = await SaveImageToDisk(dto.Image);
    }

    var vehicle = new Vehicle
    {
        Name = dto.Name,
        ImagePath = imagePath // ← Singular, no ImagePaths
    };

    return Ok(new { success = true, data = vehicle });
}
```

### Entity Model Actualizado

```csharp
public class Vehicle
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? ImagePath { get; set; } // ← Una sola ruta, no lista
    // ... otros campos
}
```

---

## 🚀 FLUJO COMPLETO

```
1. Usuario selecciona UNA imagen
   └─> selectedImage = File

2. Click en "Guardar"
   └─> FormData
       formData.append('name', 'Toyota')
       formData.append('plateNumber', 'ABC-123')
       formData.append('image', File, 'foto.jpg') // ← Singular

3. POST → /api/vehicle/with-images
   Headers:
     Content-Type: multipart/form-data; boundary=----...
     Authorization: Bearer token...

4. .NET recibe [FromForm] VehicleCreateDto
   dto.Name = "Toyota"
   dto.Image = IFormFile // ← Una sola imagen

5. .NET procesa la imagen:
   - Opción A: byte[] → DB
   - Opción B: Guardar en /uploads/foto.jpg
   - Opción C: Subir a Azure/AWS

6. Respuesta:
   {
     "success": true,
     "data": {
       "id": "guid...",
       "imagePath": "/uploads/foto.jpg"
     }
   }
```

---

## 📋 CARACTERÍSTICAS

### ✅ Frontend
- ✅ Solo permite **UNA imagen**
- ✅ Validación de tipo (JPG, PNG, GIF, WEBP)
- ✅ Validación de tamaño (máx 5MB)
- ✅ Vista previa grande y centrada
- ✅ Botón "Eliminar" para quitar la imagen
- ✅ Botón "Cambiar" para reemplazar la imagen
- ✅ FormData con `image` (singular)
- ✅ NO usa Base64

### ✅ Backend
- ✅ DTO con `IFormFile? Image` (singular)
- ✅ Controller con `[FromForm]`
- ✅ Entity con `ImagePath` (singular)
- ✅ Helper para convertir a byte[]
- ✅ Helper para guardar en disco
- ✅ Helper para guardar en DB

---

## 🔍 TESTING

### Frontend

```typescript
// Ver FormData antes de enviar
formData.forEach((value, key) => {
  console.log(key, value);
});

// Output esperado:
// name: "Toyota Corolla"
// plateNumber: "ABC-123"
// image: File { name: "foto.jpg", size: 123456, type: "image/jpeg" }
```

### Backend

```csharp
[HttpPost("with-images")]
public async Task<IActionResult> CreateVehicleWithImages([FromForm] VehicleCreateDto dto)
{
    Console.WriteLine($"Name: {dto.Name}");
    Console.WriteLine($"Has image: {dto.Image != null}");
    
    if (dto.Image != null)
    {
        Console.WriteLine($"Image: {dto.Image.FileName} ({dto.Image.Length} bytes)");
    }
}
```

---

## ⚠️ IMPORTANTE

### ❌ NO HACER
- ❌ NO agregar `multiple` al input
- ❌ NO usar arrays (`selectedImages[]`)
- ❌ NO enviar como `images` (plural) en FormData
- ❌ NO usar `List<IFormFile>` en el DTO

### ✅ SÍ HACER
- ✅ Input sin `multiple`
- ✅ Variables singulares (`selectedImage`)
- ✅ FormData con `'image'` (singular)
- ✅ DTO con `IFormFile? Image` (singular)
- ✅ Entity con `ImagePath` (singular)

---

## 📁 ARCHIVOS MODIFICADOS

### Frontend
```
src/app/features/vehicles/crud/add/
├── vehicles-add.component.ts    ← selectedImage (singular)
├── vehicles-add.component.html  ← Input sin multiple
└── vehicles-add.component.scss  ← Estilos para una imagen
```

### Backend (Referencias actualizadas)
```
BACKEND-DOTNET-REFERENCE/
├── VehicleController.cs         ← dto.Image (singular)
├── VehicleCreateDto.cs          ← IFormFile? Image
└── EJEMPLO-COMPLETO-USO.md      ← Guía actualizada
```

---

## ✅ COMPILACIÓN EXITOSA

```
✅ Build successful
✅ No linter errors  
✅ Single image implementation ready
```

---

## 🎨 UI/UX

**Antes de seleccionar:**
```
┌─────────────────────────────────────┐
│  ☁️ Subir Imagen                     │
│  Haz clic para seleccionar          │
│  Solo imágenes - Máx. 5MB           │
└─────────────────────────────────────┘
```

**Después de seleccionar:**
```
┌─────────────────────────────────────┐
│  ┌───────────────────────────┐      │
│  │                           │      │
│  │    [Vista previa]         │      │
│  │     de la imagen          │      │
│  │                           │      │
│  └───────────────────────────┘      │
│                                     │
│  [🗑️ Eliminar]  [🔄 Cambiar]        │
└─────────────────────────────────────┘
```

---

**🎉 LISTO PARA USAR - UNA SOLA IMAGEN**







