import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface RoutingMachineProps {
    waypoints: L.LatLng[];
}

export default function RoutingMachine({ waypoints }: RoutingMachineProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: '#1e3a8a', weight: 4 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            // @ts-ignore
            createMarker: () => null
        }).addTo(map);

        return () => {
            try {
                // Accessing private map state is risky, but checking getContainer is safer
                if (map && map.getContainer()) {
                    map.removeControl(routingControl);
                }
            } catch (e) {
                console.warn("Error removing routing control:", e);
            }
        };
    }, [map, waypoints]);

    return null;
}
