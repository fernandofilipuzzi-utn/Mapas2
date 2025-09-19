import { Loader } from '@googlemaps/js-api-loader';

interface MapOptions {
    apiKey: string;  // API Key es requerido
    center?: google.maps.LatLngLiteral;
    zoom?: number;
}

class GoogleMapsService {
    private map: google.maps.Map | null = null;
    private marker: google.maps.Marker | null = null;
    private geocoder: google.maps.Geocoder | null = null;
    private loader: Loader | null = null;

    static DEFAULT_CENTER = { lat: -34.6037, lng: -58.3816 };
    static DEFAULT_ZOOM = 13;

    private positionChangeCallback?: (lat: number, lng: number) => void;
    private markerDropCallback?: (lat: number, lng: number) => void;

    constructor(element: string | HTMLElement, options: MapOptions) {
        if (!options.apiKey) {
            throw new Error('API Key is required');
        }
        this.init(element, options);

        if (this.marker) 
        {
            this.marker.addListener('dragend', () => 
            {
                const position = this.marker?.getPosition();
                if (position && this.markerDropCallback) 
                    {
                    this.markerDropCallback(position.lat(), position.lng());
                }
            });
        }
    }

    private async init(element: string | HTMLElement, options: MapOptions): Promise<void> {
        const mapElement = typeof element === 'string' ? document.getElementById(element) : element;
        
        if (!mapElement) {
            throw new Error('Map container element not found');
        }

        if (!options.apiKey) {
            throw new Error('API Key is required');
        }

        this.loader = new Loader({
            apiKey: options.apiKey,
            version: 'weekly'
        });

        try {
            await this.loader.load();
            
            this.map = new google.maps.Map(mapElement, {
                center: options.center || GoogleMapsService.DEFAULT_CENTER,
                zoom: options.zoom || GoogleMapsService.DEFAULT_ZOOM
            });

            this.marker = new google.maps.Marker({
                map: this.map,
                position: options.center || GoogleMapsService.DEFAULT_CENTER,
                draggable: true
            });

            this.geocoder = new google.maps.Geocoder();

            // Configurar el evento de arrastre del marcador
            this.marker.addListener('dragend', () => {
                const position = this.marker?.getPosition();
                if (position) {
                    console.log('Nueva posición:', position.lat(), position.lng());
                }
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            throw error;
        }
    }

    public async geocodeAddress(address: string): Promise<void> {
        if (!this.geocoder || !this.map || !this.marker) {
            throw new Error('Map not initialized');
        }

        try {
            const results = await this.geocoder.geocode({ address });
            
            if (results.results[0]) {
                const location = results.results[0].geometry.location;
                this.map.setCenter(location);
                this.marker.setPosition(location);
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }

    public setCenter(center: google.maps.LatLngLiteral): void {
        if (!this.map) return;
        this.map.setCenter(center);
        if (this.marker) {
            this.marker.setPosition(center);
        }
    }

    public setZoom(zoom: number): void {
        if (!this.map) return;
        this.map.setZoom(zoom);
    }

    public onPositionChanged(callback: (lat: number, lng: number) => void): void {
        this.positionChangeCallback = callback;
    }

    public onMarkerDrop(callback: (lat: number, lng: number) => void): void {
        this.markerDropCallback = callback;
    }

    public getCurrentPosition(): {lat: number, lng: number} | null {
        const position = this.marker?.getPosition();
        return position ? { lat: position.lat(), lng: position.lng() } : null;
    }
}

// Expose to window object
(window as any).GoogleMapsService = GoogleMapsService;
export default GoogleMapsService;
