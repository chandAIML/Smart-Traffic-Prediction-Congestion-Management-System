import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const ROAD_COORDINATES = {
  "NH-24": { lat: 28.6139, lng: 77.2900 },
  "Ring Road": { lat: 28.5729, lng: 77.2094 },
  "MG Road": { lat: 28.4817, lng: 77.0873 },
  "Outer Ring Road": { lat: 28.5355, lng: 77.3910 },
};

const COLOR = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

function TrafficLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const trafficLayer = new window.google.maps.TrafficLayer();

    trafficLayer.setMap(map);

    return () => {
      trafficLayer.setMap(null);
    };
  }, [map]);

  return null;
}

function TrafficMarkers({ liveData = [] }) {
  const [selectedRoad, setSelectedRoad] = useState(null);

  const getMarkerIcon = (color) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="30" height="30">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${encodeURIComponent(color)}" stroke="white" stroke-width="1.5"/>
    </svg>`;
    return `data:image/svg+xml;utf-8,${svg}`;
  };

  return (
    <>
      {liveData.map((road) => {
        const coords = ROAD_COORDINATES[road.road_name];

        if (!coords) return null;

        const markerColor =
          COLOR[road.congestion_level] || "#888888";

        const iconConfig = window.google
          ? {
              url: getMarkerIcon(markerColor),
              scaledSize: new window.google.maps.Size(30, 30),
              anchor: new window.google.maps.Point(15, 30),
            }
          : getMarkerIcon(markerColor);

        return (
          <div key={road.road_name}>
            <Marker
              position={coords}
              onClick={() => setSelectedRoad(road)}
              icon={iconConfig}
            />

            {selectedRoad?.road_name === road.road_name && (
              <InfoWindow
                position={coords}
                onCloseClick={() => setSelectedRoad(null)}
              >
                <div style={{ minWidth: "160px", color: "#111827" }}>
                  <strong>{road.road_name}</strong>

                  <div>
                    Speed: {road.average_speed} km/h
                  </div>

                  <div>
                    Congestion: {road.congestion_level}
                  </div>
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function TrafficMap({ liveData = [] }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        style={{
          height: "400px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          background: "#111827",
          color: "#9ca3af",
        }}
      >
        Google Maps API key is missing.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div
        style={{
          height: "520px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={{ lat: 28.6139, lng: 77.2090 }}
          defaultZoom={11}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <TrafficLayer />
          <TrafficMarkers liveData={liveData} />
        </Map>
      </div>
    </APIProvider>
  );
}