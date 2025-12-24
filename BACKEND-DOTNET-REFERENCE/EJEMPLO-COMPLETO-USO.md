# GUÍA COMPLETA: Envío de Imágenes con FormData (Ionic + .NET)

## 🔥 NO USES BASE64 - USA FORMDATA + IFORMFILE

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Frontend (Ionic + Angular)
```
src/app/
├── features/vehicles/crud/add/
│   ├── vehicles-add.component.ts   ← Componente modificado
│   ├── vehicles-add.component.html ← HTML con múltiples imágenes
│   └── vehicles-add.component.scss ← Estilos para grid de imágenes
└── utils/
    └── vehicle.service.ts          ← Método createVehicleWithImages()
```

### Backend (.NET 8+)
```
Controllers/
├── VehicleController.cs           ← Endpoint [FromForm]
DTOs/
├── VehicleCreateDto.cs            ← DTO con IFormFile
Models/
├── Vehicle.cs                     ← Entidad
└── VehicleImage.cs                ← Para guardar en DB
```

---

## ✅ FRONTEND: Ionic + Angular

### 1. Componente TypeScript

```typescript
// vehicles-add.component.ts
selectedImages: File[] = [];
imagePreviews: string[] = [];

async saveVehicle() {
  // Crear FormData
  const formData = new FormData();
  
  // Agregar campos normales
  formData.append('name', this.form.get('name')?.value);
  formData.append('plateNumber', this.form.get('plateNumber')?.value);
  // ... más campos
  
  // Agregar imágenes
  this.selectedImages.forEach(image => {
    formData.append('images', image, image.name);
  });
  
  // Enviar con el servicio
  this.vehicleService.createVehicleWithImages(formData).subscribe({
    next: (response) => console.log('Success', response),
    error: (error) => console.error('Error', error)
  });
}
```

### 2. Servicio Angular

```typescript
// vehicle.service.ts
createVehicleWithImages(formData: FormData): Observable<ApiResponse<any>> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    // ⚠️ NO agregar 'Content-Type', el navegador lo hace automáticamente
  });

  return this.http.post<ApiResponse<any>>(
    `${environment.apiUrl}/vehicle/with-images`,
    formData,
    { headers }
  );
}
```

### 3. HTML para múltiples imágenes

```html
<input 
  type="file" 
  id="vehicleImageInput"
  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
  multiple
  (change)="onImageSelected($event)"
  style="display: none;">

<div class="images-grid">
  @for (preview of imagePreviews; track $index) {
    <div class="image-preview-item">
      <img [src]="preview" alt="Vista previa">
      <ion-button (click)="removeImage($index)">
        <ion-icon name="close-circle"></ion-icon>
      </ion-button>
    </div>
  }
</div>
```

---

## ✅ BACKEND: .NET 8+ Web API

### 1. DTO con IFormFile

```csharp
// VehicleCreateDto.cs
public class VehicleCreateDto
{
    [Required]
    public string Name { get; set; }
    
    [Required]
    public string PlateNumber { get; set; }
    
    public string? Model { get; set; }
    public int? Year { get; set; }
    public decimal? Mileage { get; set; }
    
    // ⚠️ IMPORTANTE: IFormFile recibe los archivos de FormData
    public List<IFormFile>? Images { get; set; }
}
```

### 2. Controller con [FromForm]

```csharp
// VehicleController.cs
[HttpPost("with-images")]
public async Task<IActionResult> CreateVehicleWithImages([FromForm] VehicleCreateDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var imagePaths = new List<string>();

    // Procesar cada imagen
    if (dto.Images != null && dto.Images.Any())
    {
        foreach (var image in dto.Images)
        {
            // Opción 1: Convertir a byte[]
            byte[] imageBytes = await ConvertFormFileToBytes(image);
            
            // Opción 2: Guardar en disco
            string savedPath = await SaveImageToDisk(image);
            imagePaths.Add(savedPath);
            
            // Opción 3: Guardar en DB
            // await SaveImageToDatabase(imageBytes, image.FileName);
        }
    }

    // Crear entidad
    var vehicle = new Vehicle
    {
        Name = dto.Name,
        PlateNumber = dto.PlateNumber,
        ImagePaths = string.Join(";", imagePaths)
    };

    // Guardar en DB
    // await _dbContext.Vehicles.AddAsync(vehicle);
    // await _dbContext.SaveChangesAsync();

    return Ok(new { success = true, data = vehicle });
}
```

### 3. Helper: Convertir IFormFile a byte[]

```csharp
private async Task<byte[]> ConvertFormFileToBytes(IFormFile file)
{
    if (file == null || file.Length == 0)
        return Array.Empty<byte>();

    using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);
    return memoryStream.ToArray();
}
```

### 4. Helper: Guardar en disco

```csharp
private async Task<string> SaveImageToDisk(IFormFile file)
{
    var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "vehicles");
    
    if (!Directory.Exists(uploadsFolder))
        Directory.CreateDirectory(uploadsFolder);

    var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

    using (var fileStream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(fileStream);
    }

    return $"/uploads/vehicles/{uniqueFileName}";
}
```

### 5. Helper: Guardar en base de datos

```csharp
private async Task SaveImageToDatabase(byte[] imageBytes, string fileName)
{
    var vehicleImage = new VehicleImage
    {
        Id = Guid.NewGuid(),
        FileName = fileName,
        ImageData = imageBytes, // byte[]
        ContentType = "image/jpeg",
        CreatedAt = DateTime.UtcNow
    };

    // await _dbContext.VehicleImages.AddAsync(vehicleImage);
    // await _dbContext.SaveChangesAsync();
}

// Entity
public class VehicleImage
{
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public byte[] ImageData { get; set; } // Columna varbinary(max) en SQL
    public string ContentType { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

---

## ⚙️ CONFIGURACIÓN IMPORTANTE

### Program.cs - Límite de archivos

```csharp
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50 MB
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52428800; // 50 MB
});
```

### CORS

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8100")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowFrontend");
```

### Servir archivos estáticos

```csharp
app.UseStaticFiles(); // Para acceder a /wwwroot/uploads/...
```

---

## 🔍 DEBUGGING

### Ver FormData en el frontend

```typescript
formData.forEach((value, key) => {
  console.log(key, value);
});
```

### Ver en Network Tab (Chrome DevTools)

1. Abre Network Tab
2. Busca la request POST
3. Ve a "Payload" o "Request Payload"
4. Verás: `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`

### Ver en el backend

```csharp
[HttpPost("with-images")]
public async Task<IActionResult> CreateVehicleWithImages([FromForm] VehicleCreateDto dto)
{
    Console.WriteLine($"Name: {dto.Name}");
    Console.WriteLine($"Images count: {dto.Images?.Count}");
    
    if (dto.Images != null)
    {
        foreach (var img in dto.Images)
        {
            Console.WriteLine($"Image: {img.FileName} - {img.Length} bytes");
        }
    }
    
    return Ok();
}
```

---

## ❌ ERRORES COMUNES

### 1. "Content-Type application/json" error
❌ **Causa**: Agregaste `'Content-Type': 'application/json'` en los headers
✅ **Solución**: NO agregues Content-Type, el navegador lo setea automáticamente

### 2. "Request body too large" (413)
❌ **Causa**: Límite de tamaño excedido
✅ **Solución**: Configurar `FormOptions` y `Kestrel` en Program.cs

### 3. dto.Images es null en el backend
❌ **Causa**: El nombre en FormData no coincide con el DTO
✅ **Solución**: 
```typescript
// Frontend debe ser:
formData.append('images', file, filename); // ← 'images' minúscula

// Backend DTO:
public List<IFormFile>? Images { get; set; } // ← 'Images' con mayúscula inicial
// .NET es case-insensitive por defecto, pero verifica la config
```

### 4. CORS error
❌ **Causa**: Política CORS no configurada
✅ **Solución**: Agregar política CORS en Program.cs

---

## 📊 EJEMPLO DE FLUJO COMPLETO

```
1. Usuario selecciona 3 imágenes en Ionic
   └─> selectedImages = [File1, File2, File3]

2. Click en "Guardar"
   └─> Se crea FormData
       formData.append('name', 'Toyota Corolla')
       formData.append('plateNumber', 'ABC-123')
       formData.append('images', File1, 'img1.jpg')
       formData.append('images', File2, 'img2.jpg')
       formData.append('images', File3, 'img3.jpg')

3. HTTP POST a /api/vehicle/with-images
   └─> Headers: Content-Type: multipart/form-data; boundary=----...

4. Backend recibe [FromForm] VehicleCreateDto
   └─> dto.Name = "Toyota Corolla"
   └─> dto.PlateNumber = "ABC-123"
   └─> dto.Images = [IFormFile, IFormFile, IFormFile]

5. Backend procesa cada IFormFile:
   └─> Opción A: Convertir a byte[] para guardar en DB
   └─> Opción B: Guardar archivo en disco (/uploads/...)
   └─> Opción C: Subir a Azure Blob / AWS S3

6. Backend responde:
   {
     "success": true,
     "data": {
       "id": "guid...",
       "name": "Toyota Corolla",
       "imagePaths": ["/uploads/img1.jpg", "/uploads/img2.jpg", "/uploads/img3.jpg"]
     }
   }

7. Frontend muestra success y navega a lista
```

---

## 🎯 CHECKLIST FINAL

### Frontend
- [ ] Usar `FormData()` para crear el objeto
- [ ] Agregar campos normales con `.append(key, value)`
- [ ] Agregar imágenes con `.append('images', file, filename)`
- [ ] NO agregar `Content-Type` en headers
- [ ] SI agregar `Authorization` si usas JWT

### Backend
- [ ] DTO tiene `public List<IFormFile>? Images { get; set; }`
- [ ] Controller usa `[FromForm] VehicleCreateDto dto`
- [ ] Configurar límite de archivos en Program.cs
- [ ] Configurar CORS si es necesario
- [ ] Usar `app.UseStaticFiles()` si guardas en disco

---

¡Listo! Ahora tienes un sistema completo de envío de imágenes sin Base64.







