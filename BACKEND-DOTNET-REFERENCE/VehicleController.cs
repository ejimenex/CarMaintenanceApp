using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Si usas autenticación
    public class VehicleController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<VehicleController> _logger;
        // Agrega tu DbContext o servicio aquí

        public VehicleController(
            IWebHostEnvironment environment,
            ILogger<VehicleController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Crear vehículo con imágenes usando FormData
        /// </summary>
        [HttpPost("with-images")]
        public async Task<IActionResult> CreateVehicleWithImages([FromForm] VehicleCreateDto dto)
        {
            try
            {
                // Validar DTO
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Datos inválidos",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                // Variable para guardar el path de la imagen
                string? imagePath = null;

                // Procesar la imagen recibida
                if (dto.Image != null)
                {
                    // Convertir IFormFile a byte[]
                    byte[] imageBytes = await ConvertFormFileToBytes(dto.Image);

                    // Opción 1: Guardar en disco
                    imagePath = await SaveImageToDisk(dto.Image);

                    // Opción 2: Guardar en base de datos
                    // await SaveImageToDatabase(imageBytes, dto.Image.FileName);

                    // Opción 3: Subir a Azure/AWS/etc
                    // string cloudUrl = await UploadToCloud(imageBytes, dto.Image.FileName);
                }

                // Crear entidad Vehicle
                var vehicle = new Vehicle
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    PlateNumber = dto.PlateNumber,
                    BrandCode = Guid.Parse(dto.BrandCode),
                    VehicleTypeId = Guid.Parse(dto.VehicleTypeId),
                    Color = dto.Color,
                    VehicleMotorTypeId = Guid.Parse(dto.VehicleMotorTypeId),
                    Model = dto.Model,
                    Year = dto.Year,
                    Mileage = dto.Mileage,
                    ImagePath = imagePath, // Guardar el path de la imagen
                    CreatedAt = DateTime.UtcNow
                };

                // Guardar en base de datos
                // await _dbContext.Vehicles.AddAsync(vehicle);
                // await _dbContext.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Vehículo creado exitosamente",
                    data = new
                    {
                        id = vehicle.Id,
                        name = vehicle.Name,
                        imagePath = imagePath
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear vehículo con imágenes");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error al crear vehículo",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Actualizar vehículo con imágenes
        /// </summary>
        [HttpPut("with-images/{id}")]
        public async Task<IActionResult> UpdateVehicleWithImages(string id, [FromForm] VehicleUpdateDto dto)
        {
            try
            {
                // Buscar vehículo existente
                // var vehicle = await _dbContext.Vehicles.FindAsync(Guid.Parse(id));
                // if (vehicle == null) return NotFound();

                // Actualizar campos
                // vehicle.Name = dto.Name;
                // ... resto de campos

                // Procesar nueva imagen si existe
                if (dto.Image != null)
                {
                    string savedPath = await SaveImageToDisk(dto.Image);
                    // vehicle.ImagePath = savedPath;
                }

                // await _dbContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Vehículo actualizado" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar vehículo");
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        #region Helper Methods

        /// <summary>
        /// Convertir IFormFile a byte[]
        /// </summary>
        private async Task<byte[]> ConvertFormFileToBytes(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return Array.Empty<byte>();

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }

        /// <summary>
        /// Guardar imagen en disco
        /// </summary>
        private async Task<string> SaveImageToDisk(IFormFile file)
        {
            // Crear directorio si no existe
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "vehicles");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generar nombre único
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Guardar archivo
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Retornar path relativo
            return $"/uploads/vehicles/{uniqueFileName}";
        }

        /// <summary>
        /// Guardar imagen en base de datos como byte[]
        /// </summary>
        private async Task SaveImageToDatabase(byte[] imageBytes, string fileName)
        {
            // Ejemplo de guardado en DB
            var vehicleImage = new VehicleImage
            {
                Id = Guid.NewGuid(),
                FileName = fileName,
                ImageData = imageBytes,
                ContentType = "image/jpeg", // O detectar automáticamente
                CreatedAt = DateTime.UtcNow
            };

            // await _dbContext.VehicleImages.AddAsync(vehicleImage);
            // await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Subir imagen a servicio cloud (ejemplo)
        /// </summary>
        private async Task<string> UploadToCloud(byte[] imageBytes, string fileName)
        {
            // Aquí implementarías la lógica para subir a Azure Blob Storage, AWS S3, etc.
            // Ejemplo pseudocódigo:
            // var blobClient = _blobServiceClient.GetBlobContainerClient("vehicles");
            // using var stream = new MemoryStream(imageBytes);
            // await blobClient.UploadBlobAsync(fileName, stream);
            // return blobClient.Uri.ToString();

            return await Task.FromResult($"https://cloudurl.com/{fileName}");
        }

        #endregion
    }

    #region Entity Model (ejemplo)
    public class Vehicle
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string PlateNumber { get; set; }
        public Guid BrandCode { get; set; }
        public Guid VehicleTypeId { get; set; }
        public string Color { get; set; }
        public Guid VehicleMotorTypeId { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public decimal? Mileage { get; set; }
        public string? ImagePath { get; set; } // Path de la imagen única
        public DateTime CreatedAt { get; set; }
    }

    public class VehicleImage
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public byte[] ImageData { get; set; }
        public string ContentType { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    #endregion
}

