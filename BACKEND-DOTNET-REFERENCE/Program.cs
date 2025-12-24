// ========================================
// CONFIGURACIÓN EN Program.cs (.NET 8+)
// ========================================

var builder = WebApplication.CreateBuilder(args);

// Configurar límite de tamaño de archivos (importante para imágenes)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 52428800; // 50 MB
    options.ValueLengthLimit = 52428800;
    options.MultipartHeadersLengthLimit = 52428800;
});

// Si usas Kestrel, también configura el límite ahí
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52428800; // 50 MB
});

// Configurar CORS si tu frontend está en otro dominio
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8100") // URL de Ionic
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Servir archivos estáticos (para que las imágenes sean accesibles)
app.UseStaticFiles(); // Esto permite acceder a /wwwroot/uploads/vehicles/...

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


// ========================================
// NOTA IMPORTANTE SOBRE IISEXPRESS / IIS
// ========================================
// Si usas IIS o IISExpress, también debes configurar en web.config:
/*
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="52428800" /> <!-- 50 MB en bytes -->
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
*/







