import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const TrackVehicle = () => {
  const [locations, setLocations] = useState([]);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      // Replace with actual API call
      const mockData = [
        { latitude: 51.505, longitude: -0.09, timestamp: '2023-10-01T10:00:00' },
        { latitude: 51.51, longitude: -0.1, timestamp: '2023-10-01T10:05:00' },
      ];
      setLocations(mockData);
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fetch data based on bookingId
    console.log('Fetching data for booking ID:', bookingId);
  };

  const position = locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [51.505, -0.09];

  return (
    <div>
      <h1>Track Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Booking ID:
          <input type="text" value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
        </label>
        <button type="submit">Track</button>
      </form>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location, index) => (
            <Marker key={index} position={[location.latitude, location.longitude]}>
              <Popup>
                Latitude: {location.latitude}, Longitude: {location.longitude}, Time: {location.timestamp}
              </Popup>
            </Marker>
          ))}
          <Polyline positions={locations.map(loc => [loc.latitude, loc.longitude])} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
};

export default TrackVehicle;
