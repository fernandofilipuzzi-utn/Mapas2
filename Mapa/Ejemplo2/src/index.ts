import { Loader } from '@googlemaps/js-api-loader';

interface MapOptions {
    apiKey: string;
    center?: google.maps.LatLngLiteral;
    zoom?: number;
}

class GoogleMaps {
    private map: google.maps.Map | null = null;
    private marker: google.maps.Marker | null = null;
    private mapLoader: Loader | null = null;

    // Valores por defecto
    private static readonly DEFAULT_CENTER = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires
    private static readonly DEFAULT_ZOOM = 13;

    constructor() {
        // Constructor vacío, la inicialización se hará en el método init
    }

    /**
     * Inicializa el mapa con las opciones proporcionadas
     * @param options Opciones de configuración del mapa
     * @returns Promise<google.maps.Map>
     */
    public async init(options: MapOptions): Promise<google.maps.Map> {
    try {
        if (!options.apiKey) {
            throw new Error('API Key is required');
        }

        this.mapLoader = new Loader({
            apiKey: options.apiKey,
            version: 'weekly',
        });

        const google = await this.mapLoader.load();
        const mapElement = document.getElementById('map');
        
        if (!mapElement) {
            throw new Error('Map container not found');
        }

        this.map = new google.maps.Map(mapElement, {
            center: options.center || GoogleMaps.DEFAULT_CENTER,
            zoom: options.zoom || GoogleMaps.DEFAULT_ZOOM,
        });

        // Crear un marcador tradicional
        this.marker = new google.maps.Marker({
            map: this.map,
            position: options.center || GoogleMaps.DEFAULT_CENTER,
            draggable: true,
            title: 'Drag me!'
        });

        if (this.marker) {
            this.marker.addListener('dragend', () => {
                if (this.marker) {
                    const position = this.marker.getPosition();
                    if (position) {
                        console.log(`Marker coordinates: ${position.lat()}, ${position.lng()}`);
                    }
                }
            });
        }

        return this.map;
    } catch (error) {
        console.error('Error initializing map:', error);
        throw error;
    }
};

    /**
     * Busca una dirección y actualiza el marcador en el mapa
     * @param address Dirección a buscar
     * @param shouldCenter Si debe centrar el mapa en la ubicación encontrada
     */
    public async geocodeAddress(address: string, shouldCenter: boolean = false): Promise<void> {
        if (!this.map || !this.marker || !this.mapLoader) {
            console.error('Map not initialized');
            return;
        }

        try {
            const google = await this.mapLoader.load();
            const geocoder = new google.maps.Geocoder();

            const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
                geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === 'OK' && results && results.length > 0) {
                        resolve(results);
                    } else {
                        reject(status);
                    }
                });
            });

            if (results.length > 0) {
                const location = results[0].geometry.location;
                
                if (this.marker) {
                    // Actualizar la posición del marcador usando setPosition
                    this.marker.setPosition(location);
                    
                    // Asegurarse de que el marcador sea visible
                    if (!this.marker.getMap() && this.map) {
                        this.marker.setMap(this.map);
                    }
                }

                if (shouldCenter && this.map) {
                    this.map.setCenter(location);
                    this.map.setZoom(16);
                }
                
                // Log para debugging
                console.log('Marker position updated:', location.toString());
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

}

// Exportamos la clase como una exportación nombrada
export { GoogleMaps };
