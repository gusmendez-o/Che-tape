import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function CheTapeApp() {
  const [destino, setDestino] = useState('');
  const [idioma, setIdioma] = useState('es');
  const [ubicacion, setUbicacion] = useState({ lat: -25.2637, lng: -57.5759 }); // Posición inicial: Asunción
  const [ruta, setRuta] = useState([]);
  const [alarmaActivada, setAlarmaActivada] = useState(false);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((pos) => {
      const nuevaUbicacion = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      setUbicacion(nuevaUbicacion);
      setRuta((prev) => [...prev, nuevaUbicacion]);
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    if (destino && !alarmaActivada) {
      const timer = setTimeout(() => {
        alert(`Avíso: Estás a 3 cuadras de tu destino "${destino}"`);
        setAlarmaActivada(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [destino, alarmaActivada]);

  const manejarEntradaVoz = () => {
    const reconocimiento = new window.webkitSpeechRecognition();
    reconocimiento.lang = idioma === 'gn' ? 'gn-PY' : 'es-PY';
    reconocimiento.start();
    reconocimiento.onresult = (evento) => {
      const texto = evento.results[0][0].transcript;
      setDestino(texto);
    };
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Che Tape 🚌</h1>

      <div>
        <label>Idioma:</label>
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
          <option value="es">Español</option>
          <option value="gn">Guaraní</option>
          <option value="jopara">Jopara</option>
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Ingrese destino o calle"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <button onClick={() => alert(`Buscando: ${destino}`)}>Buscar</button>
        <button onClick={manejarEntradaVoz}>🎤</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Tu ubicación actual:</strong><br />
        {ubicacion.lat && ubicacion.lng
          ? `Lat: ${ubicacion.lat.toFixed(5)} / Lng: ${ubicacion.lng.toFixed(5)}`
          : 'Obteniendo ubicación...'}
      </div>

      <div style={{ marginTop: '1rem', height: '300px' }}>
        <MapContainer
          center={ubicacion}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={ubicacion} icon={markerIcon} />
          <Polyline positions={ruta} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
}
