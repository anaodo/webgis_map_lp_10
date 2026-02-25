import { Overlay } from "react-leaflet/LayersControl";
import { GeoJSON } from "react-leaflet";

import buildings from "../data/biserici_RO.geojson";


export default function GeoJsonLayers() {
  return (
    <>
     

      <Overlay name="Buildings">
        <GeoJSON
          data={buildings}
          style={{ color: "red", weight: 2 }}
        />
      </Overlay>

    </>
  );
}