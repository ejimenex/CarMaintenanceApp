import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { download, documentText, car, construct, person, calendar } from 'ionicons/icons';
import { AlertService } from '../../../../utils/alert.service';

@Component({
  selector: 'app-export-data',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox
  ],
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent {
  
  dataTypes = [
    { id: 'profile', name: 'Perfil de Usuario', icon: 'person', description: 'Información personal y preferencias' },
    { id: 'vehicles', name: 'Vehículos', icon: 'car', description: 'Datos de vehículos registrados' },
    { id: 'workshops', name: 'Talleres', icon: 'construct', description: 'Información de talleres y servicios' },
    { id: 'activity', name: 'Historial de Actividad', icon: 'calendar', description: 'Registro de actividades y mantenimientos' },
    { id: 'preferences', name: 'Configuraciones', icon: 'documentText', description: 'Preferencias de la aplicación' }
  ];

  selectedTypes: string[] = [];
  isLoading = false;

  constructor(private alertService: AlertService) {
    addIcons({ download, documentText, car, construct, person, calendar });
  }

  toggleDataType(typeId: string) {
    const index = this.selectedTypes.indexOf(typeId);
    if (index > -1) {
      this.selectedTypes.splice(index, 1);
    } else {
      this.selectedTypes.push(typeId);
    }
  }

  selectAll() {
    this.selectedTypes = this.dataTypes.map(type => type.id);
  }

  deselectAll() {
    this.selectedTypes = [];
  }

  async exportData() {
    if (this.selectedTypes.length === 0) {
      this.alertService.showError('Por favor selecciona al menos un tipo de dato para exportar');
      return;
    }

    this.isLoading = true;

    try {
      // Simular llamada al API para generar el archivo de exportación
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular descarga del archivo
      const data = {
        exportDate: new Date().toISOString(),
        selectedTypes: this.selectedTypes,
        userData: {
          profile: { name: 'Usuario Ejemplo', email: 'usuario@ejemplo.com' },
          vehicles: [{ id: 1, brand: 'Toyota', model: 'Corolla' }],
          workshops: [{ id: 1, name: 'Taller Ejemplo' }],
          activity: [{ id: 1, type: 'Mantenimiento', date: '2024-01-15' }],
          preferences: { language: 'es', currency: 'USD' }
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `maintenance-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      this.alertService.showSuccess('Datos exportados exitosamente');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      this.alertService.showError('Error al exportar los datos. Inténtalo de nuevo.');
    } finally {
      this.isLoading = false;
    }
  }
}
