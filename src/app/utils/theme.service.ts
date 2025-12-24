import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  UserPreference,
  UserPreferenceService,
} from './user-preference.service.';
import { ApiResponse } from './api.service';

export interface ThemeColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Paleta de colores disponibles
  private readonly themeColors: ThemeColor[] = [
    { id: 'cream', name: 'Crema', primary: '#F5E6C8', secondary: '#E8D4A8' },
    { id: 'gold', name: 'Dorado', primary: '#F5B841', secondary: '#D9A036' },
    { id: 'gray', name: 'Gris', primary: '#808080', secondary: '#808080' },
    { id: 'navy', name: 'Marino', primary: '#1C4E6B', secondary: '#153B52' },
    { id: 'coral', name: 'Coral', primary: '#F4A5A5', secondary: '#E88A8A' },
    { id: 'black', name: 'Black', primary: '#000', secondary: '#708090' },
  ];

  private readonly THEME_KEY = 'app_theme_color';
  private currentTheme$ = new BehaviorSubject<ThemeColor>(this.themeColors[3]); // Navy por defecto

  constructor(private userService: UserPreferenceService) {
    this.loadSavedTheme();
    this.loadThemeFromApi(); // Cargar tema desde API al iniciar
  }

  /**
   * Obtiene todos los colores disponibles
   */
  getAvailableColors(): ThemeColor[] {
    return this.themeColors;
  }

  /**
   * Obtiene el tema actual como Observable (para suscribirse a cambios)
   */
  getCurrentTheme(): BehaviorSubject<ThemeColor> {
    return this.currentTheme$;
  }

  /**
   * Obtiene el valor actual del tema (sin suscripción)
   */
  getCurrentThemeValue(): ThemeColor {
    return this.currentTheme$.getValue();
  }

  /**
   * Carga el tema desde la API basado en las preferencias del usuario
   * Filtra por el campo themeColor que devuelve el id del color
   */
  loadThemeFromApi(): void {
    this.userService
      .getUserPreference()
      .subscribe((response: ApiResponse<UserPreference>) => {
        if (response.success && response.data && response.data.themeColor) {
          // Buscar el color por el id que viene de la API (themeColor)
          const themeColorId = response.data.themeColor;
          const color = this.getColorById(themeColorId);
          
          if (color) {
            this.applyTheme(color);
            this.saveTheme(themeColorId);
            this.currentTheme$.next(color);
          }
        }
      });
  }

  /**
   * Obtiene un color por su ID
   */
  getColorById(colorId: string): ThemeColor | undefined {
    return this.themeColors.find((c) => c.id === colorId);
  }

  /**
   * Aplica un nuevo tema
   */
  setTheme(colorId: string): void {
    const color = this.getColorById(colorId);
    if (color) {
      this.applyTheme(color);
      this.saveTheme(colorId);
      this.currentTheme$.next(color);
    }
  }

  /**
   * Carga el tema guardado al iniciar
   */
  private loadSavedTheme(): void {
    const savedColorId = localStorage.getItem(this.THEME_KEY);
    if (savedColorId) {
      const color = this.getColorById(savedColorId);
      if (color) {
        this.applyTheme(color);
        this.currentTheme$.next(color);
        return;
      }
    }
    // Aplicar tema por defecto (Navy)
    this.applyTheme(this.themeColors[3]);
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveTheme(colorId: string): void {
    localStorage.setItem(this.THEME_KEY, colorId);
  }

  /**
   * Aplica las variables CSS al documento
   */
  private applyTheme(color: ThemeColor): void {
    const root = document.documentElement;

    // Convertir hex a RGB
    const primaryRgb = this.hexToRgb(color.primary);
    const secondaryRgb = this.hexToRgb(color.secondary);

    // Determinar si el color es claro u oscuro para el contraste
    const isLightColor = this.isLightColor(color.primary);
    const contrastColor = isLightColor ? '#1a1a1a' : '#ffffff';
    const contrastRgb = isLightColor ? '26, 26, 26' : '255, 255, 255';

    // Aplicar variables CSS de Ionic
    root.style.setProperty('--ion-color-primary', color.primary);
    root.style.setProperty('--ion-color-primary-rgb', primaryRgb);
    root.style.setProperty('--ion-color-primary-contrast', contrastColor);
    root.style.setProperty('--ion-color-primary-contrast-rgb', contrastRgb);
    root.style.setProperty('--ion-color-primary-shade', color.secondary);
    root.style.setProperty(
      '--ion-color-primary-tint',
      this.lightenColor(color.primary, 20)
    );

    // Variable personalizada para el tema
    root.style.setProperty('--app-theme-primary', color.primary);
    root.style.setProperty('--app-theme-secondary', color.secondary);
    root.style.setProperty('--app-theme-contrast', contrastColor);
  }

  /**
   * Convierte hex a formato RGB string
   */
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(
        result[2],
        16
      )}, ${parseInt(result[3], 16)}`;
    }
    return '0, 0, 0';
  }

  /**
   * Determina si un color es claro
   */
  private isLightColor(hex: string): boolean {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      // Fórmula de luminosidad
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
    return false;
  }

  /**
   * Aclara un color hex
   */
  private lightenColor(hex: string, percent: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);

      r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
      g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
      b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

      return `#${r.toString(16).padStart(2, '0')}${g
        .toString(16)
        .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return hex;
  }
}
