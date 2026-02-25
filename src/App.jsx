import { MapContainer } from "react-leaflet";
import LayerToggle from "./components/LayerToggle";

export default function App() {
  return (
    <MapContainer
      center={[45.9432, 24.9668]}
      zoom={7}
      style={{ width: "100%", height: "100%" }}
    >
      <LayerToggle />
    </MapContainer>
  );
}