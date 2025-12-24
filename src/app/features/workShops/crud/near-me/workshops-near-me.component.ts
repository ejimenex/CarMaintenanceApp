import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AlertService } from '../../../../utils/alert.service';
import { WorkshopService, WorkshopGetRequest } from '../../../../utils/worksShop.service';

declare var google: any;

interface MapMarker {
  position: { lat: number; lng: number };
  title: string;
  workshop: WorkshopGetRequest;
}

@Component({
  selector: 'app-workshops-near-me',
  templateUrl: './workshops-near-me.component.html',
  styleUrls: ['./workshops-near-me.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ],
  providers: [
    WorkshopService,
    AlertService
  ],
  standalone: true
})
export class WorkshopsNearMeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  map: any;
  searchBox: any;
  autocomplete: any;
  currentLocation: { lat: number; lng: number } | null = null;
  searchMarker: any = null;
  workshops: WorkshopGetRequest[] = [];
  nearbyWorkshops: WorkshopGetRequest[] = [];
  loading = false;
  errorMessage = '';
  searchRadius = 10; // km
  selectedWorkshop: WorkshopGetRequest | null = null;
  showWorkshopDetails = false;
  searchQuery = '';

  // Google Maps API key (placeholder - will be replaced with real credentials)
  private readonly GOOGLE_MAPS_API_KEY = 'AIzaSyA9IDWn8hBIx0lF7japXPF2wKvuktCfXng';

  // Mock workshop locations (for demo purposes until real locations are available)
  private mockWorkshopLocations = [
    { lat: 10.4806, lng: -66.9036 }, // Caracas
    { lat: 10.4910, lng: -66.8792 },
    { lat: 10.5008, lng: -66.9145 },
    { lat: 10.4734, lng: -66.8856 },
    { lat: 10.4879, lng: -66.8965 }
  ];

  constructor(
    private workshopService: WorkshopService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  ngAfterViewInit() {
    // Map will be initialized after Google Maps script loads
    // Setup search autocomplete after view init
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  /**
   * Load Google Maps JavaScript API
   */
  private loadGoogleMapsScript() {
    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      this.initializeMap();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeMap();
    };
    script.onerror = () => {
      // If Google Maps fails to load, use mock map
      this.initializeMockMap();
    };
    document.head.appendChild(script);
  }

  /**
   * Initialize Google Maps
   */
  private async initializeMap() {
    try {
      this.loading = true;
      
      // Get current location
      await this.getCurrentLocation();
      
      if (!this.currentLocation) {
        this.alertService.showError(this.translateService.instant('workshops_near_me_location_error'));
        this.initializeMockMap();
        return;
      }

      // Create map
      if (typeof google !== 'undefined' && google.maps) {
        this.map = new google.maps.Map(this.mapContainer.nativeElement, {
          center: this.currentLocation,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true
        });

        // Add current location marker
        new google.maps.Marker({
          position: this.currentLocation,
          map: this.map,
          title: this.translateService.instant('workshops_near_me_your_location'),
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }
        });

        // Load and display workshops
        await this.loadNearbyWorkshops();
        
        // Initialize search box
        this.initializeSearchBox();
      } else {
        this.initializeMockMap();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      this.initializeMockMap();
    } finally {
      this.loading = false;
    }
  }

  /**
   * Initialize Google Places Search Box
   */
  private initializeSearchBox() {
    if (!this.searchInput || typeof google === 'undefined') {
      return;
    }

    try {
      // Create the search box and link it to the UI element
      const input = this.searchInput.nativeElement;
      
      // Initialize autocomplete
      this.autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['geometry', 'name', 'formatted_address', 'place_id'],
        types: ['geocode', 'establishment']
      });

      // Bind autocomplete to map bounds
      if (this.map) {
        this.autocomplete.bindTo('bounds', this.map);
      }

      // Listen for place selection
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          this.alertService.showError(
            this.translateService.instant('workshops_near_me_search_not_found')
          );
          return;
        }

        // Get the place location
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        // Update current location to searched place
        this.currentLocation = location;

        // Center map on the searched location
        this.map.setCenter(location);
        this.map.setZoom(15);

        // Remove previous search marker if exists
        if (this.searchMarker) {
          this.searchMarker.setMap(null);
        }

        // Add marker for searched location
        this.searchMarker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: place.name || place.formatted_address,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        });

        // Add info window for search marker
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="search-info-window">
              <h3>${place.name || this.translateService.instant('workshops_near_me_searched_location')}</h3>
              <p>${place.formatted_address || ''}</p>
            </div>
          `
        });

        this.searchMarker.addListener('click', () => {
          infoWindow.open(this.map, this.searchMarker);
        });

        // Reload nearby workshops based on new location
        this.reloadWorkshopsFromLocation(location);
      });
    } catch (error) {
      console.error('Error initializing search box:', error);
    }
  }

  /**
   * Reload workshops from a specific location
   */
  private async reloadWorkshopsFromLocation(location: { lat: number; lng: number }) {
    this.loading = true;
    
    // Update workshops with new center location
    this.nearbyWorkshops = this.workshops.filter(workshop => {
      const distance = this.calculateDistance(
        location.lat,
        location.lng,
        (workshop as any).lat,
        (workshop as any).lng
      );
      return distance <= this.searchRadius;
    });

    // Refresh markers on map
    this.clearWorkshopMarkers();
    this.addWorkshopMarkers();
    
    this.loading = false;
    
    this.alertService.showSuccess(
      this.translateService.instant('workshops_near_me_search_success') + 
      ` (${this.nearbyWorkshops.length} ${this.translateService.instant('workshops_near_me_found_suffix')})`
    );
  }

  /**
   * Clear all workshop markers from map
   */
  private workshopMarkers: any[] = [];
  
  private clearWorkshopMarkers() {
    this.workshopMarkers.forEach(marker => marker.setMap(null));
    this.workshopMarkers = [];
  }

  /**
   * Initialize mock map (fallback when Google Maps is not available)
   */
  private async initializeMockMap() {
    this.loading = true;
    
    // Use a default location (Caracas, Venezuela)
    this.currentLocation = { lat: 10.4806, lng: -66.9036 };
    
    // Create a simple mock map UI
    if (this.mapContainer) {
      const mapDiv = this.mapContainer.nativeElement;
      mapDiv.innerHTML = `
        <div class="mock-map">
          <div class="mock-map-center">
            <ion-icon name="location" class="location-icon"></ion-icon>
            <p>${this.translateService.instant('workshops_near_me_mock_map_message')}</p>
          </div>
        </div>
      `;
    }
    
    // Load workshops with mock locations
    await this.loadNearbyWorkshops();
    this.loading = false;
  }

  /**
   * Get current user location using Capacitor Geolocation
   */
  private async getCurrentLocation(): Promise<void> {
    try {
      // Request location permissions
      const permission = await Geolocation.checkPermissions();
      
      if (permission.location !== 'granted') {
        const requestPermission = await Geolocation.requestPermissions();
        if (requestPermission.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
      // Use default location if geolocation fails
      this.currentLocation = { lat: 10.4806, lng: -66.9036 }; // Caracas
    }
  }

  /**
   * Load workshops from service
   */
  private async loadNearbyWorkshops() {
    try {
      this.loading = true;
      
      // Load all workshops (in a real app, you'd filter by location on the backend)
      this.workshopService.getWorksShopPaged(1, '').subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.workshops = response.data?.items || [];
            
            // Assign mock locations to workshops for demo
            this.workshops.forEach((workshop, index) => {
              const mockLocation = this.mockWorkshopLocations[index % this.mockWorkshopLocations.length];
              (workshop as any).lat = mockLocation.lat;
              (workshop as any).lng = mockLocation.lng;
            });
            
            // Filter nearby workshops
            this.nearbyWorkshops = this.filterNearbyWorkshops();
            
            // Add markers to map
            this.addWorkshopMarkers();
          }
        },
        error: (error) => {
          console.error('Error loading workshops:', error);
          this.errorMessage = this.translateService.instant('workshops_near_me_load_error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error loading nearby workshops:', error);
      this.loading = false;
    }
  }

  /**
   * Filter workshops within search radius
   */
  private filterNearbyWorkshops(): WorkshopGetRequest[] {
    if (!this.currentLocation) return this.workshops;

    return this.workshops.filter(workshop => {
      const distance = this.calculateDistance(
        this.currentLocation!.lat,
        this.currentLocation!.lng,
        (workshop as any).lat,
        (workshop as any).lng
      );
      return distance <= this.searchRadius;
    });
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Add workshop markers to map
   */
  private addWorkshopMarkers() {
    if (!this.map || typeof google === 'undefined') {
      return;
    }

    this.nearbyWorkshops.forEach(workshop => {
      const marker = new google.maps.Marker({
        position: { lat: (workshop as any).lat, lng: (workshop as any).lng },
        map: this.map,
        title: workshop.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      // Store marker for later clearing
      this.workshopMarkers.push(marker);

      // Add click listener to marker
      marker.addListener('click', () => {
        this.onMarkerClick(workshop);
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="workshop-info-window">
            <h3>${workshop.name}</h3>
            <p><strong>${this.translateService.instant('workshops_near_me_address')}:</strong> ${workshop.address}</p>
            <p><strong>${this.translateService.instant('workshops_near_me_phone')}:</strong> ${workshop.phone}</p>
            <p><strong>${this.translateService.instant('workshops_near_me_type')}:</strong> ${workshop.worksShopTypeName}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
  }

  /**
   * Clear search and reset to user location
   */
  clearSearch() {
    this.searchQuery = '';
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
    
    // Remove search marker
    if (this.searchMarker) {
      this.searchMarker.setMap(null);
      this.searchMarker = null;
    }
    
    // Reset to current location and reload
    this.refreshMap();
  }

  /**
   * Handle marker click
   */
  onMarkerClick(workshop: WorkshopGetRequest) {
    this.selectedWorkshop = workshop;
    this.showWorkshopDetails = true;
  }

  /**
   * Close workshop details modal
   */
  closeWorkshopDetails() {
    this.showWorkshopDetails = false;
    this.selectedWorkshop = null;
  }

  /**
   * Navigate to workshop details
   */
  viewWorkshopDetails(id: string) {
    this.router.navigate(['/workshops/detail', id]);
  }

  /**
   * Get directions to workshop
   */
  getDirections(workshop: WorkshopGetRequest) {
    if (this.currentLocation && (workshop as any).lat && (workshop as any).lng) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=${(workshop as any).lat},${(workshop as any).lng}`;
      window.open(url, '_blank');
    }
  }

  /**
   * Call workshop
   */
  callWorkshop(phone: string) {
    window.open(`tel:${phone}`, '_self');
  }

  /**
   * Refresh map and reload workshops
   */
  async refreshMap() {
    this.loading = true;
    await this.getCurrentLocation();
    await this.loadNearbyWorkshops();
    
    if (this.map && this.currentLocation) {
      this.map.setCenter(this.currentLocation);
    }
    
    this.alertService.showSuccess(this.translateService.instant('workshops_near_me_refresh_success'));
    this.loading = false;
  }

  /**
   * Go back to workshops list
   */
  goBack() {
    this.router.navigate(['/workshops/list']);
  }

  /**
   * Calculate distance to workshop for display
   */
  getDistanceToWorkshop(workshop: WorkshopGetRequest): string {
    if (!this.currentLocation) return 'N/A';
    
    const distance = this.calculateDistance(
      this.currentLocation.lat,
      this.currentLocation.lng,
      (workshop as any).lat,
      (workshop as any).lng
    );
    
    return `${distance.toFixed(1)} km`;
  }
}

