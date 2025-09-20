// filepath: h:\repos\tup\javascript\Mapas2\Mapas2\OpenStreet\src\index.ts
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat, transform } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Stroke, Fill } from 'ol/style';
import Polygon from 'ol/geom/Polygon';
import Collection from 'ol/Collection';
import { Geometry } from 'ol/geom';
import { Modify, Translate } from 'ol/interaction';

interface MapOptions {
    center?: [number, number];  // [longitude, latitude]
    zoom?: number;
}

interface ZonaPolygon {
    nombre: string;
    coords: {lat: number, lng: number}[];
    color?: string;
}

export class OpenStreetService {
    private map: Map | null = null;
    private markerLayer: VectorLayer<VectorSource> | null = null;
    private marker: Feature | null = null;
    private polygonLayer: VectorLayer<VectorSource> | null = null;
    
    static DEFAULT_CENTER: [number, number] = [-58.3816, -34.6037];
    static DEFAULT_ZOOM = 13;

    private positionChangeCallback?: (lat: number, lng: number) => void;
    private markerDropCallback?: (lat: number, lng: number) => void;

    constructor(element: string | HTMLElement, options: MapOptions = {}) {
        this.initMap(element, options);
    }

    private initMap(element: string | HTMLElement, options: MapOptions): void {
        const mapElement = typeof element === 'string' ? 
            document.getElementById(element) : element;

        if (!mapElement) {
            throw new Error('Map container not found');
        }

        // Crear las capas
        const osmLayer = new TileLayer({
            source: new OSM()
        });

        // Crear la capa para el marcador con una Collection
        const features = new Collection<Feature<Geometry>>();
        this.markerLayer = new VectorLayer({
            source: new VectorSource({
                features: features
            })
        });

        // Crear la capa para los polígonos
        this.polygonLayer = new VectorLayer({
            source: new VectorSource()
        });

        // Inicializar el mapa
        this.map = new Map({
            target: mapElement,
            layers: [osmLayer, this.markerLayer, this.polygonLayer],
            view: new View({
                center: fromLonLat(options.center || OpenStreetService.DEFAULT_CENTER),
                zoom: options.zoom || OpenStreetService.DEFAULT_ZOOM
            })
        });

        this.addMarker(options.center || OpenStreetService.DEFAULT_CENTER);
        this.setupDragAndDrop();
    }

    private addMarker(coordinates: [number, number]): void {
        if (!this.markerLayer) return;

        // Eliminar marcador anterior si existe
        if (this.marker) {
            this.markerLayer.getSource()?.removeFeature(this.marker);
        }

        // Crear nuevo marcador
        this.marker = new Feature({
            geometry: new Point(fromLonLat(coordinates))
        });

        // Estilo del marcador
        this.marker.setStyle(new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: 'https://openlayers.org/en/latest/examples/data/icon.png'
            })
        }));

        this.markerLayer.getSource()?.addFeature(this.marker);
    }

    private setupDragAndDrop(): void {
        if (!this.map || !this.markerLayer || !this.marker) return;

        // Obtener el source
        const source = this.markerLayer.getSource();
        if (!source) return;

        // Crear una collection si no existe y añadir el marcador
        const features = new Collection<Feature<Geometry>>();
        features.push(this.marker);

        // Añadir interacción de traslado
        const translate = new Translate({
            features: features
        });

        this.map.addInteraction(translate);

        // Escuchar el evento de fin de traslado
        translate.on('translateend', () => {
            if (this.marker && this.markerDropCallback) {
                const coords = (this.marker.getGeometry() as Point).getCoordinates();
                const lonLat = transform(coords, 'EPSG:3857', 'EPSG:4326');
                this.markerDropCallback(lonLat[1], lonLat[0]);
            }
        });
    }

    public async geocodeAddress(address: string): Promise<void> {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const location = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
                this.setCenter(location);

                if (this.positionChangeCallback) {
                    this.positionChangeCallback(location.lat, location.lng);
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }

    public getCurrentPosition(): {lat: number, lng: number} | null {
        if (!this.marker) return null;
        
        const geometry = this.marker.getGeometry() as Point;
        const coords = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        
        return {
            lat: coords[1],
            lng: coords[0]
        };
    }
    public setCenter(center: {lat: number, lng: number}): void {
        
        if (!this.map || !this.marker) return;

        // Actualizar el centro del mapa
        this.map.getView().setCenter(fromLonLat([center.lng, center.lat]));

        // Actualizar la posición del marcador
        const point = new Point(fromLonLat([center.lng, center.lat]));
        this.marker.setGeometry(point);
        // Notificar el cambio de posición
        if (this.positionChangeCallback) {
            this.positionChangeCallback(center.lat, center.lng);
        }
    }
    public setZoom(zoom: number): void {
        if (!this.map) return;
        this.map.getView().setZoom(zoom);
    }

    public onPositionChanged(callback: (lat: number, lng: number) => void): void {
        this.positionChangeCallback = callback;
    }

    public onMarkerDrop(callback: (lat: number, lng: number) => void): void {
        this.markerDropCallback = callback;
    }

    public clearZones(): void {
        if (this.polygonLayer) {
            this.polygonLayer.getSource()?.clear();
        }
    }

    public drawZone(zona: ZonaPolygon): void 
    {
        if (!this.map || !this.polygonLayer) return;

        // Convertir las coordenadas al formato que espera OpenLayers
        const coords = zona.coords.map(coord => {
            // Asumimos que coord[0] es lng y coord[1] es lat para mantener
            // la consistencia con el resto de la API
            console.log(coord.lng, coord.lat);
            return fromLonLat([coord.lng, coord.lat]);
        });

        // Asegurarnos de cerrar el polígono si no está cerrado
        if (coords.length > 0 && 
            (coords[0][0] !== coords[coords.length-1][0] || 
             coords[0][1] !== coords[coords.length-1][1])) {
            coords.push(coords[0]); // Cerrar el polígono
        }

        // OpenLayers espera un array de anillos: [ [ [x1, y1], [x2, y2], ... ] ]
        const polygon = new Feature({
            geometry: new Polygon([coords])
        });

        // Establecer el estilo del polígono
        polygon.setStyle(new Style({
            stroke: new Stroke({
                color: zona.color || '#FF0000',
                width: 2
            }),
            fill: new Fill({
                color: zona.color ? zona.color + '40' : '#FF000040' // Usar 40 para 25% de opacidad
            })
        }));

        // Añadir el polígono a la capa
        this.polygonLayer.getSource()?.addFeature(polygon);
    }

    public drawZones(zonas: ZonaPolygon[]): void {
        this.clearZones();
        zonas.forEach(zona => this.drawZone(zona));
    }
}

// Exponer la clase en el objeto window y exportarla
(window as any).OpenStreetService = OpenStreetService;
export default OpenStreetService;