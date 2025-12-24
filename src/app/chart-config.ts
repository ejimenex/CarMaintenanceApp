/**
 * Configuración global de Chart.js
 * Este archivo registra todos los componentes necesarios de Chart.js
 */

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
} from 'chart.js';

// Registrar todos los componentes necesarios
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  BarController
);

// Configuración global por defecto
Chart.defaults.font.family = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#1a1a1a';









