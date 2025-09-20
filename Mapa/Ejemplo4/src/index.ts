import { Loader } from '@googlemaps/js-api-loader';

interface MapOptions {
    apiKey: string;  // API Key es requerido
    center?: google.maps.LatLngLiteral;
    zoom?: number;
}

interface ZonaPolygon {
    nombre: string;
    coords: google.maps.LatLngLiteral[];
    color?: string;
}

class GoogleMapsService {
    private initPromise: Promise<void>;
    private map: google.maps.Map | null = null;
    private marker: google.maps.Marker | null = null;
    private geocoder: google.maps.Geocoder | null = null;
    private loader: Loader | null = null;
    private activePolygons: google.maps.Polygon[] = [];

    static DEFAULT_CENTER = { lat: -34.6037, lng: -58.3816 };
    static DEFAULT_ZOOM = 13;

    private positionChangeCallback?: (lat: number, lng: number) => void;
    private markerDropCallback?: (lat: number, lng: number) => void;

    constructor(element: string | HTMLElement, options: MapOptions) {
        if (!options.apiKey) {
            throw new Error('API Key is required');
        }
        this.initPromise = this.init(element, options);
    }

    private async init(element: string | HTMLElement, options: MapOptions): Promise<void> {
        try {
            this.loader = new Loader({
                apiKey: options.apiKey,
                version: 'weekly',
                libraries: ['marker']
            });

            const google = await this.loader.load();
            const mapElement = typeof element === 'string' ? 
                document.getElementById(element) : element;

            if (!mapElement) {
                throw new Error('Map container not found');
            }

            this.map = new google.maps.Map(mapElement, {
                center: options.center || GoogleMapsService.DEFAULT_CENTER,
                zoom: options.zoom || GoogleMapsService.DEFAULT_ZOOM
            });

            const position = options.center || GoogleMapsService.DEFAULT_CENTER;
            this.marker = new google.maps.Marker({
                map: this.map,
                position: position,
                draggable: true,
                title: 'Drag me!'
            });

            this.marker.addListener('dragend', () => {
                const position = this.marker?.getPosition();
                if (position && this.markerDropCallback) {
                    this.markerDropCallback(position.lat(), position.lng());
                }
            });

        } catch (error) {
            console.error('Error initializing map:', error);
            throw error;
        }
    }

    public async geocodeAddress(address: string): Promise<void> {
        if (!this.map || !this.marker) {
            throw new Error('Map or marker not initialized');
        }

        try {
            const geocoder = new google.maps.Geocoder();
            const results = await geocoder.geocode({ address });

            if (results.results.length > 0) {
                const location = results.results[0].geometry.location;
                
                this.marker.setPosition({ 
                    lat: location.lat(), 
                    lng: location.lng() 
                });
                
                this.map.setCenter(location);

                if (this.positionChangeCallback) {
                    this.positionChangeCallback(location.lat(), location.lng());
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }

    public getCurrentPosition(): {lat: number, lng: number} | null {
        if (!this.marker) return null;
        
        const position = this.marker.getPosition();
        if (!position) return null;

        return {
            lat: position.lat(),
            lng: position.lng()
        };
    }

    public setCenter(center: google.maps.LatLngLiteral): void {
        if (!this.map || !this.marker) return;
        this.map.setCenter(center);
        this.marker.setPosition(center);
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

    public async isReady(): Promise<void> {
        return this.initPromise;
    }

    public clearZones(): void {
        this.activePolygons.forEach(polygon => {
            polygon.setMap(null);
        });
        this.activePolygons = [];
    }

    public drawZone(zona: ZonaPolygon): void {
        if (!this.map) return;

        const polygon = new google.maps.Polygon({
            paths: zona.coords,
            strokeColor: zona.color || "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: zona.color || "#FF0000",
            fillOpacity: 0.35
        });

        polygon.setMap(this.map);
        this.activePolygons.push(polygon);

        // Ajustar el mapa para mostrar todo el polígono
        const bounds = new google.maps.LatLngBounds();
        zona.coords.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds);
    }

    public drawZones(zonas: ZonaPolygon[]): void {
        this.clearZones();
        zonas.forEach(zona => this.drawZone(zona));
    }
}

(window as any).GoogleMapsService = GoogleMapsService;
export default GoogleMapsService;
