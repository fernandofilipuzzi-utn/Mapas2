import { Loader } from '@googlemaps/js-api-loader';

declare global {
    interface Window {
        GoogleMaps: any;
    }
}

export class GoogleMaps {
    private map: google.maps.Map | null = null;
    private marker: google.maps.Marker | null = null;
    private geocoder: google.maps.Geocoder | null = null;

    async init(config: { apiKey: string, center: { lat: number, lng: number }, zoom: number }) {
        try {
            const loader = new Loader({
                apiKey: config.apiKey,
                version: "weekly"
            });

            await loader.load();

            this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: config.center,
                zoom: config.zoom
            });

            this.marker = new google.maps.Marker({
                map: this.map,
                position: config.center,
                draggable: true
            });

            this.geocoder = new google.maps.Geocoder();

            // Configurar evento de arrastre del marcador
            this.marker.addListener("dragend", () => {
                const position = this.marker?.getPosition();
                if (position) {
                    console.log(`Nueva posición: ${position.lat()}, ${position.lng()}`);
                }
            });

            return {
                map: this.map,
                marker: this.marker
            };
        } catch (error) {
            console.error("Error loading Google Maps:", error);
            throw error;
        }
    }

    async geocodeAddress(address: string, centerMap: boolean = true) {
        if (!this.geocoder || !this.marker || !this.map) {
            throw new Error("Mapa no inicializado");
        }

        try {
            const result = await this.geocoder.geocode({ address });
            if (result.results[0]) {
                const location = result.results[0].geometry.location;
                
                if (centerMap) {
                    this.map.setCenter(location);
                }
                
                this.marker.setPosition(location);
                return location;
            } else {
                throw new Error("No se encontró la dirección");
            }
        } catch (error) {
            console.error("Error en geocodificación:", error);
            throw error;
        }
    }
}

// Hacer la clase disponible globalmente
window.GoogleMaps = GoogleMaps;
