import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
  import { DashboardVehicleService, DashboardVehicleModel, DashboardVehicleFilter } from '../../../utils/dashboardVehicle.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-vehicle',
  templateUrl: './vehicleDashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    BaseChartDirective
  ]
})
export class VehicleDashboardComponent implements OnInit {

  // Dashboard data
  dashboardData: DashboardVehicleModel | null = null;
  isLoading: boolean = false;
  hasError: boolean = false;
  filter: DashboardVehicleFilter = {
    vehicleId: '',
    yearTo: 0,
    yearFrom: 0,
    monthTo: 0,
    monthFrom: 0
  };

  // Opciones para los filtros de fecha
  availableYears: number[] = [];
  availableMonths: { value: number; label: string }[] = [
    { value: 1, label: this.translateService.instant('Jan')},
    { value: 2, label: this.translateService.instant('Feb')},
    { value: 3, label: this.translateService.instant('Mar')},
    { value: 4, label: this.translateService.instant('Apr')},
    { value: 5, label: this.translateService.instant('May')},
    { value: 6, label: this.translateService.instant('Jun')},
    { value: 7, label: this.translateService.instant('Jul')},
    { value: 8, label: this.translateService.instant('Aug')},
    { value: 9, label: this.translateService.instant('Sep')},
    { value: 10, label: this.translateService.instant('Oct')},
    { value: 11, label: this.translateService.instant('Nov')},
    { value: 12, label: this.translateService.instant('Dec')},
  ];
  
  // Resumen general
  totalMaintenances: number = 0;
  totalCost: number = 0;
  totalCostPart: number = 0;
  totalCostFuel: number = 0;
  totalCostTaxes: number = 0;
  totalCostInsurance: number = 0;
  totalCostMaintenance: number = 0;
  lastUpdate: Date = new Date();

  // ====================================
  // GRÁFICA 1: Tipos de Mantenimiento (PIE/DOUGHNUT)
  // ====================================

  // Configuración del gráfico de tipos
  public maintenanceChartType: 'doughnut' = 'doughnut';
  
  public maintenanceChartData: ChartData<'doughnut'> = {
    labels: ['Eléctrico', 'Mecánico', 'Hidráulico', 'Preventivo'],
    datasets: [
      {
        data: [30, 35, 25, 10],
        backgroundColor: [
          '#4A90E2', // Azul
          '#F5A623', // Naranja
          '#7ED321', // Verde
          '#D0021B'  // Rojo
        ],
        borderColor: '#ffffff',
        borderWidth: 3
      }
    ]
  };

  public maintenanceChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 13,
            family: 'system-ui, -apple-system, sans-serif'
          },
          color: '#1a1a1a'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  // ====================================
  // GRÁFICA 2: Costos por Categoría (BAR HORIZONTAL)
  // ====================================

  public costChartType: 'bar' = 'bar';
  
  public costChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Costo ($)',
        data: [],
        backgroundColor: [
          '#1a1a1a',
          '#4a4a4a',
          '#7a7a7a',
          '#9a9a9a'
        ],
        borderColor: [
          '#000000',
          '#2a2a2a',
          '#5a5a5a',
          '#7a7a7a'
        ],
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  public costChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y', // Horizontal bar
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function(context) {
            const value = context.parsed.x || 0;
            return `Costo: $${value.toLocaleString('es-ES')}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#666666',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + (value as number).toLocaleString('es-ES');
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        ticks: {
          color: '#1a1a1a',
          font: {
            size: 13,
            weight: 600
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  constructor(
    private dashboardService: DashboardVehicleService,   private translateService: TranslateService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    // Inicializar años disponibles (últimos 10 años)
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.availableYears.push(i);
    }

    this.filter.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.filter.yearTo = currentYear;
    this.filter.yearFrom = currentYear;
    this.filter.monthTo = new Date().getMonth() + 1;
    this.filter.monthFrom = 1;
    // Cargar datos al inicializar el componente
    this.loadDashboardData();
  }
  ionViewDidEnter() {
    this.loadDashboardData();
  }
  /**
   * Carga los datos del dashboard desde el servicio
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;

    this.dashboardService.getDashBoard(this.filter).subscribe({
      next: (response) => {
        if (response.success && response.data) {
         
          this.dashboardData = response.data;
          this.updateDashboardStats();
          this.updateChartData();
          console.log('✅ Dashboard data loaded successfully', this.dashboardData);
        } else {
          
          this.hasError = true;
          console.warn('⚠️ No dashboard data available');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading dashboard data:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  /**
   * Actualiza las estadísticas generales del dashboard
   */
  updateDashboardStats(): void {
    if (!this.dashboardData) return;

    this.totalMaintenances = this.dashboardData.totalMaintenances || 0;
    this.totalCostPart = this.dashboardData.totalCostPart || 0;
    this.totalCostFuel = this.dashboardData.totalCostFuel || 0;
    this.totalCostInsurance = this.dashboardData.totalCostInsurance || 0;
    this.totalCostMaintenance = this.dashboardData.totalCostMaintenance || 0;
    this.totalCostTaxes = this.dashboardData.totalCostTaxes || 0;
    
    // Calcular el costo total
    this.totalCost = this.totalCostPart + this.totalCostFuel + 
                     this.totalCostInsurance + this.totalCostMaintenance + this.totalCostTaxes;
    
    this.lastUpdate = this.dashboardData.lastUpdate || new Date();
  }

  /**
   * Actualiza los datos de las gráficas
   */
  updateChartData(): void {
    if (!this.dashboardData) return;

    // Actualizar gráfica de costos por categoría
    this.costChartData = {
      labels: ['Combustible', 'Repuestos', 'Taller', 'Seguros', 'Impuestos'],
      datasets: [
        {
          label: 'Costo ($)',
          data: [
            this.totalCostFuel,
            this.totalCostPart,
            this.totalCostMaintenance,
            this.totalCostInsurance,
            this.totalCostTaxes
          ],
          backgroundColor: [
            '#1a1a1a',
            '#4a4a4a',
            '#7a7a7a',
            '#9a9a9a',
            '#D0021B'
          ],
          borderColor: [
            '#000000',
            '#2a2a2a',
            '#5a5a5a',
            '#7a7a7a',
            '#D0021B'
          ],
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    };
  }

  /**
   * Formatea números con separador de miles
   */
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

  /**
   * Refresca los datos del dashboard
   */
  refreshDashboard(): void {
    console.log('🔄 Recargando dashboard...');
    this.loadDashboardData();
  }

  /**
   * Aplica los filtros de fecha seleccionados
   */
  applyFilter(): void {
    console.log('🔍 Aplicando filtros:', this.filter);
    this.loadDashboardData();
  }
}

