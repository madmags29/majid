import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

interface RoutingMachineProps {
    waypoints: L.LatLng[];
}

export default function RoutingMachine({ waypoints }: RoutingMachineProps) {
    const map = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    useEffect(() => {
        if (!map || waypoints.length < 2) return;

        // Clean up previous routing control if it exists
        if (routingControlRef.current) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (map.hasLayer(routingControlRef.current as any)) {
                    map.removeControl(routingControlRef.current);
                }
            } catch (e) {
                console.warn("Error removing previous routing control:", e);
            }
            routingControlRef.current = null;
        }

        // Create new routing control
        try {
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
                // @ts-expect-error - createMarker is missing in types but required to hide markers
                createMarker: () => null
            });

            routingControl.addTo(map);
            routingControlRef.current = routingControl;
        } catch (e) {
            console.warn("Error creating routing control:", e);
        }

        return () => {
            if (routingControlRef.current && map) {
                try {
                    // Check if map still exists and has a container
                    if (map.getContainer && map.getContainer()) {
                        // Check if the control is still on the map before removing
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (map.hasLayer(routingControlRef.current as any)) {
                            map.removeControl(routingControlRef.current);
                        }
                    }
                } catch {
                    // Silently fail - map is likely already being destroyed
                    console.debug("Routing control cleanup skipped (map already destroyed)");
                }
                routingControlRef.current = null;
            }
        };
    }, [map, waypoints]);

    return null;
}
