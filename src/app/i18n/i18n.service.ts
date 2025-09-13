import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag?: string;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private availableLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  constructor(private translateService: TranslateService) {
    this.initializeLanguage();
  }

  /**
   * Initialize the language service
   */
  private initializeLanguage(): void {
    // Set default language
    this.translateService.setDefaultLang('en');

    // Get stored language or use browser language
    const storedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = this.translateService.getBrowserLang();
    
    let languageToUse = 'en';
    
    if (storedLanguage && this.isLanguageAvailable(storedLanguage)) {
      languageToUse = storedLanguage;
    } else if (browserLanguage && this.isLanguageAvailable(browserLanguage)) {
      languageToUse = browserLanguage;
    }

    this.setLanguage(languageToUse);
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    if (this.isLanguageAvailable(languageCode)) {
      this.translateService.use(languageCode);
      this.currentLanguageSubject.next(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Language[] {
    return [...this.availableLanguages];
  }

  /**
   * Check if language is available
   */
  isLanguageAvailable(languageCode: string): boolean {
    return this.availableLanguages.some(lang => lang.code === languageCode);
  }

  /**
   * Get language name by code
   */
  getLanguageName(languageCode: string): string {
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    return language ? language.name : languageCode;
  }

  /**
   * Get language flag by code
   */
  getLanguageFlag(languageCode: string): string {
    const language = this.availableLanguages.find(lang => lang.code === languageCode);
    return language ? language.flag || '' : '';
  }

  /**
   * Add a new language
   */
  addLanguage(language: Language): void {
    if (!this.isLanguageAvailable(language.code)) {
      this.availableLanguages.push(language);
    }
  }

  /**
   * Remove a language
   */
  removeLanguage(languageCode: string): void {
    this.availableLanguages = this.availableLanguages.filter(lang => lang.code !== languageCode);
  }

  /**
   * Get translation as Observable
   */
  get(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  /**
   * Get translation as Promise
   */
  async getAsync(key: string, params?: any): Promise<string> {
    return this.translateService.get(key, params).toPromise();
  }

  /**
   * Get translation synchronously
   */
  instant(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  /**
   * Check if a key exists
   */
  hasKey(key: string): boolean {
    return this.translateService.getParsedResult(this.translateService.store.translations, key) !== key;
  }

  /**
   * Get all keys for current language
   */
  getAllKeys(): string[] {
    const translations = this.translateService.store.translations[this.getCurrentLanguage()];
    return translations ? Object.keys(translations) : [];
  }

  /**
   * Reload translations
   */
  reloadLanguage(languageCode: string): void {
    this.translateService.reloadLang(languageCode);
  }

  /**
   * Reset to default language
   */
  resetToDefault(): void {
    this.setLanguage('en');
  }
} 