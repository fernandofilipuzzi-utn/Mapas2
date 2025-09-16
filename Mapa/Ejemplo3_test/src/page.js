(function() {
    // Configuración del mapa
    const CONFIG = {
        apiKey: process.env.GOOGLE_MAPS_API_KEY, // Usar la variable de entorno
        center: { 
            lat: -34.6037, 
            lng: -58.3816  // Buenos Aires por defecto
        },
        zoom: 13
    };

    let mapInstance;

    // Función para inicializar el mapa
    async function initMap() {
        try {
            // Esperar a que la clase GoogleMaps esté disponible desde bundle.js
            while (!window.GoogleMaps) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Crear instancia de GoogleMaps
            mapInstance = new window.GoogleMaps();
            
            // Inicializar el mapa con la configuración
            const { map, marker } = await mapInstance.init({
                apiKey: CONFIG.apiKey,
                center: CONFIG.center,
                zoom: CONFIG.zoom
            });

            // Configurar los event listeners
            setupEventListeners();

            // La clase GoogleMaps ya maneja la creación y configuración del marcador
            console.log('Mapa inicializado correctamente');
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    // Función para configurar los event listeners
    function setupEventListeners() {
        // Manejar cambios en el select de localidad
        const localidadSelect = document.getElementById('localidad');
        if (localidadSelect) {
            localidadSelect.addEventListener('change', async () => {
                if (localidadSelect.value && localidadSelect.value !== 'Seleccione una localidad') {
                    await mapInstance.geocodeAddress(localidadSelect.value, true);
                }
            });
        }

        // Manejar el envío del formulario para búsqueda por dirección
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const calleInput = document.getElementById('calle');
                const numeroInput = document.getElementById('numero');
                const localidadSelect = document.getElementById('localidad');
                const localidadValue = localidadSelect.value;

                if (calleInput.value && numeroInput.value && localidadValue && localidadValue !== 'Seleccione una localidad') {
                    const direccionCompleta = `${calleInput.value} ${numeroInput.value}, ${localidadValue}`;
                    await mapInstance.geocodeAddress(direccionCompleta, true);
                } else {
                    alert('Por favor, complete todos los campos');
                }
            });
        }
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initMap);
})();
