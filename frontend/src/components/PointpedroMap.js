
import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./PointpedroMap.css";

const attractions = [
  {
    id: 1,
    name: "Point Pedro Jetty",
    category: "Beach",
    position: [9.8287079, 80.2342354],
  },
  {
    id: 2,
    name: "KKS Beach",
    category: "Beach",
    position: [9.8165036, 80.0434802],
  },
  {
    id: 3,
    name: "Moorkkam Beach Point Pedro",
    category: "Beach",
    position: [9.8185265, 80.2518993],
  },
  {
    id: 4,
    name: "Keerimalai Sacred Water Spring",
    category: "Natural attraction",
    position: [9.8148987, 80.0086682],
  },
  {
    id: 5,
    name: "Nilavarai Bottomless Well",
    category: "Natural attraction",
    position: [9.7543845, 80.0856865],
  },
  {
    id: 6,
    name: "Therumoodimadam",
    category: "Heritage",
    position: [9.8233735, 80.2353524],
  },
  {
    id: 7,
    name: "Point Pedro Postbox",
    category: "Heritage",
    position: [9.8239986, 80.2490191],
  },
  {
    id: 8,
    name: "Selva Sannithy Murugan Temple",
    category: "Temple",
    position: [9.8125002, 80.1288616],
  },
  {
    id: 9,
    name: "Manalkadu Dutch Church Ruins",
    category: "Heritage",
    position: [9.7697259, 80.2679912],
  },
  {
    id: 10,
    name: "Manalkadu Sand Dunes",
    category: "Beach",
    position: [9.7645048, 80.2490738],
  },
  {
    id: 11,
    name: "Point Pedro Lighthouse",
    category: "Heritage",
    position: [9.826856, 80.2471464],
  },
  {
    id: 12,
    name: "Vallipura Alwar Devasthanam",
    category: "Temple",
    position: [9.789437, 80.2398772],
  },
  {
    id: 13,
    name: "Sakkotai Cape",
    category: "Coastal viewpoint",
    position: [9.835779, 80.2104061],
  },
  {
    id: 14,
    name: "Odakkarai Appam",
    category: "Food",
    position: [9.8245011, 80.2291743],
  },
  {
    id: 15,
    name: "Point Pedro Market",
    category: "Food",
    position: [9.8247663, 80.2297703],
  },
  {
    id: 16,
    name: "Thondamanaru Lagoon",
    category: "Lagoon",
    position: [9.8145138, 80.1293117],
  },
];

const blueIcon = L.divIcon({
  className: "pp-marker-wrapper",
  html: `<div class="pp-marker">
    <span class="pp-marker-dot"></span>
  </div>`,
  iconSize: [30, 38],
  iconAnchor: [15, 34],
  popupAnchor: [0, -32],
});

const featuredIcon = L.divIcon({
  className: "pp-marker-wrapper",
  html: `<div class="pp-marker pp-marker-featured">
    <span class="pp-marker-dot"></span>
  </div>`,
  iconSize: [36, 44],
  iconAnchor: [18, 40],
  popupAnchor: [0, -38],
});


function UserLocation() {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const currentPosition = [
          coords.latitude,
          coords.longitude,
        ];

        setPosition(currentPosition);
        setError("");
      },
      (err) => {
        setError(
          err.code === 1
            ? "Allow location access in your browser."
            : "Unable to get your location. Try again."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const showMyLocation = () => {
    if (position) {
      map.flyTo(position, 16);
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const currentPosition = [
            coords.latitude,
            coords.longitude,
          ];

          setPosition(currentPosition);
          map.flyTo(currentPosition, 16);
          setError("");
        },
        () => setError("Please enable location permission."),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }
  };

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>You are here!</Popup>
        </Marker>
      )}

      <div className="pp-my-location">
        <button onClick={showMyLocation}>
          📍 My Location
        </button>

        {error && <p>{error}</p>}
      </div>
    </>
  );
}


export default function PointPedroMap() {
  return (
    <section className="pp-map-section">
      <div className="pp-map-heading">
        <div>
          <span className="pp-map-eyebrow">
            EXPLORE NORTHERN SRI LANKA
          </span>
          <h2>Discover Point Pedro</h2>
          <p>
            Find beautiful beaches, temples and hidden places.
          </p>
        </div>

        <span className="pp-map-count">
          {attractions.length} places
        </span>
      </div>

      <div className="pp-map-frame">
        <MapContainer
          center={[9.81, 80.18]}
          zoom={11}
          minZoom={8}
          maxZoom={18}
          scrollWheelZoom={true}
          zoomControl={false}
          className="pp-leaflet-map"
        >
          <ZoomControl position="bottomright" />

            {/* 1. Map tiles */}
  <TileLayer
    attribution='© OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    maxZoom={19}
  />

  {/* 2. Real-time user location */}
  <UserLocation />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {attractions.map((place) => (
            <Marker
              key={place.id}
              position={place.position}
              icon={
                place.name === "Point Pedro"
                  ? featuredIcon
                  : blueIcon
              }
            >
              <Tooltip direction="top" offset={[0, -28]}>
                {place.name}
              </Tooltip>

              <Popup>
                <div className="pp-popup">
                  <span className="pp-popup-category">
                    {place.category}
                  </span>
                  <h3>{place.name}</h3>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="pp-directions-link"
                  >
                    Get directions ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pp-map-label">
          <span className="pp-live-dot" />
          Interactive tourist map
        </div>

        <div className="pp-map-attribution-note">
          Map data © OpenStreetMap contributors
        </div>
      </div>

      <div className="pp-map-footer">
        <span>🌊 Northern Coast</span>
        <span>🌴 Jaffna Peninsula</span>
        <span>📍 {attractions.length} attractions</span>
      </div>
    </section>
  );
}
