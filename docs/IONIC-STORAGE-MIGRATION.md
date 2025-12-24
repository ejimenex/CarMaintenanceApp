# 🔄 Migración de localStorage a Ionic Storage

## 📋 Resumen

Se ha migrado completamente el sistema de autenticación de `localStorage` a `Ionic Storage` para mejorar la seguridad, compatibilidad y rendimiento en dispositivos móviles.

## ✅ Cambios Realizados

### 1. **Instalación de Dependencias**

```bash
npm install @ionic/storage-angular --save
```

### 2. **Archivos Modificados**

#### 📄 `src/app/utils/api.service.ts`

**Cambios principales:**

1. **Importación de Ionic Storage**
   ```typescript
   import { Storage } from '@ionic/storage-angular';
   ```

2. **Inyección y inicialización del Storage**
   ```typescript
   constructor(
     private http: HttpClient,
     private storage: Storage
   ) {
     this.initStorage();
   }
   ```

3. **Método para obtener token**
   ```typescript
   async getToken(): Promise<string | null> {
     const userData = await this._storage!.get(this.USER_STORAGE_KEY);
     return userData?.token || null;
   }
   ```

4. **Actualización de CrudService**
   - Todos los métodos HTTP ahora usan `createAuthHeaders()` que obtiene el token del Storage
   - Se usa el patrón `from().pipe(switchMap())` para convertir Promises en Observables
   - El token se obtiene de manera asíncrona antes de cada petición

5. **Ejemplo de cambio en métodos**
   ```typescript
   // Antes
   getAll(): Observable<ApiResponse<T[]>> {
     const token = JSON.parse(localStorage.getItem('currentUser')).token;
     this.headers.set('Authorization', `Bearer ${token}`);
     return this.http.get(url, { headers });
   }
   
   // Después
   getAll(): Observable<ApiResponse<T[]>> {
     return from(this.createAuthHeaders()).pipe(
       switchMap(headers => 
         this.http.get(url, { headers })
       )
     );
   }
   ```

#### 📄 `src/app/features/auth/services/auth.service.ts`

**Cambios principales:**

1. **Importación de Ionic Storage**
   ```typescript
   import { Storage } from '@ionic/storage-angular';
   ```

2. **Inyección del Storage**
   ```typescript
   constructor(
     // ... otros servicios
     private storage: Storage
   ) {
     this.initStorage(); // Inicializar storage
   }
   ```

3. **Inicialización del Storage**
   ```typescript
   private async initStorage(): Promise<void> {
     this._storage = await this.storage.create();
     this.storageInitialized = true;
     await this.checkStoredUser();
   }
   ```

4. **Métodos Actualizados a Async**
   - `checkStoredUser()`: `void` → `Promise<void>`
   - `storeUser()`: `void` → `Promise<void>`
   - `clearStoredUser()`: `void` → `Promise<void>`
   - `getStoredUser()`: Nuevo método → `Promise<UserData | null>`
   - `isAuthenticated()`: `boolean` → `Promise<boolean>`
   - `handleExpiredToken()`: `void` → `Promise<void>`
   - `handleTokenExpiration()`: `void` → `Promise<void>`

5. **Validación de Token Separada**
   ```typescript
   private async validateToken(userData: UserData): Promise<boolean> {
     // Lógica de validación JWT
   }
   ```

#### 📄 `src/app/features/auth/guards/auth.guard.ts`

**Cambios:**

- `canActivate()` ahora es **async** y devuelve `Promise<boolean>`
- Usa `await` para esperar la respuesta de `isAuthenticated()`

```typescript
async canActivate(): Promise<boolean> {
  const isAuthenticated = await this.authService.isAuthenticated();
  // ...
}
```

#### 📄 `src/main.ts`

**Cambios:**

1. **Importación de Storage**
   ```typescript
   import { Storage } from '@ionic/storage-angular';
   ```

2. **Registro como Provider**
   ```typescript
   bootstrapApplication(AppComponent, {
     providers: [
       // ... otros providers
       Storage, // ← Ionic Storage provider
       // ...
     ],
   });
   ```

---

## 🔑 Ventajas de Ionic Storage sobre localStorage

### 1. **Compatibilidad Multiplataforma**
- ✅ Web
- ✅ iOS (usa SQLite)
- ✅ Android (usa SQLite)
- ✅ Electron

### 2. **Mayor Seguridad**
- Datos encriptados en dispositivos nativos
- No accesible desde DevTools en producción
- Mejor protección contra XSS

### 3. **Mayor Capacidad**
- localStorage: ~5-10 MB
- Ionic Storage: ~50 MB+ (dependiendo del dispositivo)

### 4. **Mejor Rendimiento**
- Operaciones asíncronas no bloquean el UI
- Optimizado para móviles
- Cache inteligente

### 5. **API Consistente**
- Misma API en todas las plataformas
- Manejo automático de serializacion/deserialización
- Soporte para tipos complejos

---

## 🔄 Flujo de Autenticación

### Login Exitoso
```
1. Usuario ingresa credenciales
2. API valida y devuelve token
3. AuthService.signInWithEmail()
   ├─ Guarda en BehaviorSubject (memoria)
   └─ Guarda en Ionic Storage (persistente)
4. Navega a /dashboard
```

### Verificación de Autenticación
```
1. AuthGuard.canActivate()
2. AuthService.isAuthenticated()
   ├─ ¿Usuario en memoria? → Validar token
   └─ ¿No? → Cargar desde Ionic Storage
3. Validar expiración JWT
4. Permitir o denegar acceso
```

### Logout
```
1. Usuario hace logout
2. AuthService.signOut()
   ├─ Limpia BehaviorSubject
   ├─ Elimina de Ionic Storage
   └─ Navega a /login
```

---

## 📝 Métodos del AuthService

### Métodos Públicos

| Método | Tipo | Descripción |
|--------|------|-------------|
| `getCurrentUser()` | `Observable<UserData \| null>` | Observable del usuario actual |
| `signInWithEmail(email, password)` | `Promise<void>` | Login con email y contraseña |
| `signInWithGoogle()` | `Promise<void>` | Login con Google (pendiente) |
| `signUp(username, password, name)` | `Promise<void>` | Registro de nuevo usuario |
| `resetPassword(email)` | `Promise<void>` | Resetear contraseña |
| `signOut()` | `Promise<void>` | Cerrar sesión |
| `isAuthenticated()` | `Promise<boolean>` | Verifica si está autenticado |
| `handleTokenExpiration()` | `Promise<void>` | Maneja token expirado |

### Métodos Privados

| Método | Descripción |
|--------|-------------|
| `initStorage()` | Inicializa Ionic Storage |
| `checkStoredUser()` | Carga usuario del storage al inicio |
| `storeUser(user)` | Guarda usuario en storage |
| `clearStoredUser()` | Elimina usuario del storage |
| `getStoredUser()` | Obtiene usuario del storage |
| `validateToken(userData)` | Valida el JWT token |
| `handleExpiredToken()` | Limpia datos cuando token expira |

---

## 🔍 Depuración

### Logs Importantes

El `AuthService` incluye logs detallados:

```
✅ Ionic Storage initialized successfully
📦 User data found in Ionic Storage
💾 User data stored in Ionic Storage
🗑️ User data cleared from Ionic Storage
🔍 Token validation result: true/false
✅ Token valid. Expires: [fecha]
❌ Token expired
```

### Ver Datos en DevTools (Solo Web)

```javascript
// En la consola del navegador
import { Storage } from '@ionic/storage-angular';

// Crear instancia
const storage = new Storage();
await storage.create();

// Ver usuario almacenado
const user = await storage.get('currentUser');
console.log(user);
```

### Limpiar Storage Manualmente

```javascript
// En la consola
const storage = new Storage();
await storage.create();
await storage.clear(); // Limpia todo
```

---

## 🚨 Problemas Comunes

### 1. "Storage not initialized"

**Causa**: El storage aún no se ha inicializado.

**Solución**: Esperar a que `initStorage()` termine. El servicio lo hace automáticamente al iniciar.

### 2. Token Expirado

**Causa**: El JWT ha expirado.

**Solución**: El servicio detecta automáticamente y redirige al login.

### 3. Datos no Persisten

**Causa**: Posible error en la configuración del provider.

**Solución**: Verificar que `Storage` esté en los providers de `main.ts`.

---

## 🔐 Seguridad

### Datos Almacenados

```typescript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "123",
    username: "usuario@ejemplo.com",
    name: "Usuario"
  },
  expirationDate: "2024-12-31T23:59:59.999Z"
}
```

### Recomendaciones

1. ✅ **Nunca almacenar contraseñas**
2. ✅ **Usar tokens JWT con expiración corta**
3. ✅ **Validar token en cada solicitud importante**
4. ✅ **Limpiar storage al hacer logout**
5. ✅ **Usar HTTPS en producción**

---

## 📱 Compatibilidad

| Plataforma | Storage Backend | Estado |
|------------|-----------------|---------|
| Web | IndexedDB | ✅ |
| iOS | SQLite | ✅ |
| Android | SQLite | ✅ |
| Electron | SQLite | ✅ |

---

## 🧪 Testing

### Probar Login
1. Abrir la app
2. Login con credenciales válidas
3. Cerrar la app completamente
4. Abrir nuevamente
5. ✅ Debería mantener la sesión

### Probar Logout
1. Estar autenticado
2. Hacer logout
3. Verificar redirección a /login
4. ✅ No debería poder acceder a rutas protegidas

### Probar Token Expirado
1. Modificar manualmente el token en storage
2. Intentar acceder a una ruta protegida
3. ✅ Debería redirigir a /login

---

## 📚 Referencias

- [Ionic Storage Documentation](https://github.com/ionic-team/ionic-storage)
- [Angular Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [JWT Decode](https://www.npmjs.com/package/jwt-decode)

---

## ✨ Próximos Pasos

- [ ] Implementar refresh token
- [ ] Agregar biometría para autenticación
- [ ] Implementar logout en todos los dispositivos
- [ ] Agregar logging avanzado con Sentry
- [ ] Implementar 2FA (Two-Factor Authentication)

---

**Última actualización**: 31 de Octubre, 2024
**Autor**: Sistema de Mantenimiento de Vehículos

