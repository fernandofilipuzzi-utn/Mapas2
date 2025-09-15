// src/index.ts
import { Loader } from '@googlemaps/js-api-loader';

let map: google.maps.Map;
let marker: google.maps.Marker;

const initMap = async () => {
    const loader = new Loader({
        apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
    });

    try {
        const google = await loader.load();
        const mapElement = document.getElementById('map') as HTMLElement;
        map = new google.maps.Map(mapElement, {
            center: { lat: -34.6037, lng: -58.3816 },
            zoom: 12,
        });
        marker = new google.maps.Marker({
            map,
            draggable: true,
            position: { lat: -34.6037, lng: -58.3816 }
        });

        marker.addListener('dragend', () => {
            const newPosition = marker.getPosition();
            if (newPosition) {
                console.log(`Coordenadas del marcador: Latitud ${newPosition.lat()}, Longitud ${newPosition.lng()}`);
            }
        });
    } catch (e) {
        console.error('Error al cargar la API de Google Maps:', e);
    }
};

const geocodeAddress = async (address: string, isCenter: boolean = false) => {
    // La solicitud ahora se hace directamente a la API de Google Maps a través del proxy.
    // La clave de API se agrega como un parámetro de consulta.
    try {
        const url = `/api/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=tu_clave_de_api`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            const newCoords = { lat: location.lat, lng: location.lng };
            if (map) {
                map.panTo(newCoords);
                if (isCenter) {
                    map.setZoom(14);
                }
            }
            if (marker) {
                marker.setPosition(newCoords);
            }
        } else {
            alert('Dirección no encontrada.');
        }
    } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        alert('Error al conectar con la API.');
    }
};

// Manejadores de eventos para los formularios
document.getElementById('localityForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const localityInput = document.getElementById('localidadInput') as HTMLInputElement;
    if (localityInput.value) {
        geocodeAddress(localityInput.value, true);
    }
});

document.getElementById('addressForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const streetInput = document.getElementById('streetInput') as HTMLInputElement;
    const numberInput = document.getElementById('numberInput') as HTMLInputElement;
    const localityInput = document.getElementById('localidadInput') as HTMLInputElement;

    if (streetInput.value && numberInput.value && localityInput.value) {
        const fullAddress = `${streetInput.value} ${numberInput.value}, ${localityInput.value}`;
        geocodeAddress(fullAddress);
    }
});

initMap();