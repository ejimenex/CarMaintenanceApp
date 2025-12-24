using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace YourNamespace.DTOs
{
    /// <summary>
    /// DTO para crear vehículo con imágenes
    /// Usa [FromForm] en el controller para recibir FormData
    /// </summary>
    public class VehicleCreateDto
    {
        [Required(ErrorMessage = "El nombre es requerido")]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        [Required(ErrorMessage = "La placa es requerida")]
        [StringLength(20, MinimumLength = 3)]
        public string PlateNumber { get; set; }

        [Required(ErrorMessage = "La marca es requerida")]
        public string BrandCode { get; set; } // Guid como string

        [Required(ErrorMessage = "El tipo de vehículo es requerido")]
        public string VehicleTypeId { get; set; } // Guid como string

        [Required(ErrorMessage = "El color es requerido")]
        public string Color { get; set; }

        [Required(ErrorMessage = "El tipo de motor es requerido")]
        public string VehicleMotorTypeId { get; set; } // Guid como string

        public string? Model { get; set; }

        [Range(1900, 2100, ErrorMessage = "Año inválido")]
        public int? Year { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El kilometraje debe ser positivo")]
        public decimal? Mileage { get; set; }

        /// <summary>
        /// Una sola imagen - IFormFile recibe el archivo directamente desde FormData
        /// En FormData debe enviarse como: formData.append('image', file, fileName)
        /// </summary>
        public IFormFile? Image { get; set; }
    }

    /// <summary>
    /// DTO para actualizar vehículo con imágenes
    /// </summary>
    public class VehicleUpdateDto : VehicleCreateDto
    {
        // Hereda todos los campos de VehicleCreateDto
        // Puedes agregar campos adicionales específicos para update si necesitas
    }
}

