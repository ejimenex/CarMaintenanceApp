#!/usr/bin/env node

/**
 * Script para Aplanar Archivos de Traducción
 * Convierte estructura JSON anidada a formato plano
 * 
 * Uso: node flatten-translations.js
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

/**
 * Aplana un objeto anidado a formato plano
 * @param {Object} obj - Objeto a aplanar
 * @param {string} prefix - Prefijo para las claves
 * @returns {Object} Objeto aplanado
 */
function flatten(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    // Si el valor es un objeto (pero no null ni array), seguir aplanando
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
}

/**
 * Ordena las claves de un objeto alfabéticamente
 * @param {Object} obj - Objeto a ordenar
 * @returns {Object} Objeto con claves ordenadas
 */
function sortKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

/**
 * Procesa un archivo de traducción
 * @param {string} lang - Código del idioma
 */
function processLanguageFile(lang) {
  const inputPath = path.join(__dirname, 'src', 'assets', 'i18n', `${lang}.json`);
  const backupPath = path.join(__dirname, 'src', 'assets', 'i18n', `${lang}-backup-${Date.now()}.json`);
  const outputPath = inputPath;
  
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(inputPath)) {
      console.log(`${colors.red}❌ Archivo no encontrado: ${inputPath}${colors.reset}`);
      return false;
    }
    
    // Leer archivo original
    const content = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(content);
    
    // Crear backup
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`${colors.blue}📦 Backup creado: ${path.basename(backupPath)}${colors.reset}`);
    
    // Aplanar estructura
    const flattened = flatten(data);
    
    // Ordenar claves alfabéticamente
    const sorted = sortKeys(flattened);
    
    // Guardar archivo aplanado
    fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    
    // Estadísticas
    const originalKeys = countKeys(data);
    const flattenedKeys = Object.keys(sorted).length;
    
    console.log(`${colors.green}✅ ${lang}.json procesado exitosamente${colors.reset}`);
    console.log(`   📊 Claves: ${originalKeys} → ${flattenedKeys}`);
    console.log(`   📝 Formato: Plano y ordenado alfabéticamente`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error procesando ${lang}.json:${colors.reset}`, error.message);
    return false;
  }
}

/**
 * Cuenta recursivamente las claves en un objeto
 * @param {Object} obj - Objeto a contar
 * @returns {number} Número total de claves
 */
function countKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Verifica si dos archivos de traducción tienen las mismas claves
 * @param {string} lang1 - Primer idioma
 * @param {string} lang2 - Segundo idioma
 */
function compareLanguages(lang1, lang2) {
  const path1 = path.join(__dirname, 'src', 'assets', 'i18n', `${lang1}.json`);
  const path2 = path.join(__dirname, 'src', 'assets', 'i18n', `${lang2}.json`);
  
  const data1 = JSON.parse(fs.readFileSync(path1, 'utf8'));
  const data2 = JSON.parse(fs.readFileSync(path2, 'utf8'));
  
  const keys1 = new Set(Object.keys(data1));
  const keys2 = new Set(Object.keys(data2));
  
  const missing1 = [...keys2].filter(k => !keys1.has(k));
  const missing2 = [...keys1].filter(k => !keys2.has(k));
  
  if (missing1.length > 0 || missing2.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Diferencias entre ${lang1} y ${lang2}:${colors.reset}`);
    if (missing1.length > 0) {
      console.log(`   Faltan en ${lang1}:`, missing1.slice(0, 5).join(', '), missing1.length > 5 ? `... (+${missing1.length - 5} más)` : '');
    }
    if (missing2.length > 0) {
      console.log(`   Faltan en ${lang2}:`, missing2.slice(0, 5).join(', '), missing2.length > 5 ? `... (+${missing2.length - 5} más)` : '');
    }
  }
}

// ==================== MAIN ====================

console.log(`\n${colors.bright}${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.blue}║   CarClinic Translation Flattener     ║${colors.reset}`);
console.log(`${colors.bright}${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

const languages = ['es', 'en', 'pt', 'ru'];
let successCount = 0;

// Procesar cada archivo de idioma
console.log(`${colors.bright}Procesando archivos de traducción...${colors.reset}\n`);

for (const lang of languages) {
  if (processLanguageFile(lang)) {
    successCount++;
  }
  console.log('');
}

// Resumen
console.log(`${colors.bright}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.green}✨ Proceso completado: ${successCount}/${languages.length} archivos${colors.reset}\n`);

// Comparar idiomas para encontrar claves faltantes
if (successCount === languages.length) {
  console.log(`${colors.bright}Verificando consistencia entre idiomas...${colors.reset}`);
  compareLanguages('es', 'en');
  compareLanguages('es', 'pt');
  compareLanguages('es', 'ru');
}

console.log(`\n${colors.bright}${colors.green}✅ Todas las traducciones están ahora en formato plano${colors.reset}`);
console.log(`${colors.blue}ℹ️  Los backups se guardaron con timestamp${colors.reset}`);
console.log(`${colors.yellow}⚠️  Recuerda probar la aplicación antes de hacer commit${colors.reset}\n`);

