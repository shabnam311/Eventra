import React, { useEffect, useRef, useState } from 'react';

export default function MapboxFloorPlan({ venueCoordinates = [-74.006, 40.7128] }) {
  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = process.env.REACT_APP_MAPBOX_TOKEN || import.meta.env?.VITE_MAPBOX_TOKEN;
    if (!token) {
      setError("Mapbox token is missing. Please add REACT_APP_MAPBOX_TOKEN to your .env file to enable 3D floor plans.");
      return;
    }

    const loadMapbox = async () => {
      if (!document.getElementById('mapbox-gl-css')) {
        const link = document.createElement('link');
        link.id = 'mapbox-gl-css';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      if (!window.mapboxgl) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.async = true;
        await new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      window.mapboxgl.accessToken = token;
      
      const map = new window.mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: venueCoordinates,
        zoom: 17,
        pitch: 60,
        bearing: -17.6,
        antialias: true
      });

      map.on('style.load', () => {
        const layers = map.getStyle().layers;
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout['text-field']
        )?.id;

        map.addLayer(
          {
            id: 'add-3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
              'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
        setMapLoaded(true);
      });

      return () => map.remove();
    };

    loadMapbox();
  }, [venueCoordinates]);

  if (error) {
    return (
      <div className="relative w-full h-96 bg-slate-900 rounded-xl border border-red-500/30 flex items-center justify-center p-6 text-center shadow-lg">
        <div>
          <div className="text-red-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-bold text-white text-lg mb-1">Configuration Required</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-slate-100 rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-1">Venue Floor Plan</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            Drag to pan, Ctrl+Drag to pitch
          </p>
        </div>
      )}
    </div>
  );
}
