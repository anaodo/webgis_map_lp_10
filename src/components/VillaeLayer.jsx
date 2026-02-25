import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet"; // Am adăugat Pane aici
import L from "leaflet";

export default function VillaeLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadGeoJSON() {
      try {
        console.log("Încep încărcarea fișierului: /data/villae.geojson");
        const res = await fetch("/data/villae.geojson");
        
        if (!res.ok) {
          throw new Error(`Eroare HTTP! Status: ${res.status}`);
        }

        const json = await res.json();
        console.log("Fișierul GeoJSON a fost încărcat cu succes:", json);
        setData(json);
      } catch (err) {
        console.error("EROARE la încărcarea GeoJSON:", err);
      }
    }

    loadGeoJSON();
  }, []);

  if (!data) return null;

  const pointStyle = {
    radius: 7,
    fillColor: "#ffc300",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    // Îi spunem stilului să folosească panoul nostru custom
    pane: "villae-top-pane" 
  };

  const pointToLayer = (feature, latlng) => {
    // Creăm markerul și îi pasăm explicit panoul în opțiuni
    const marker = L.circleMarker(latlng, pointStyle);

    const nume = feature.properties.Villa || "Fără nume";
    const locatie = feature.properties.Location || "Nespecificat";
    const bibliografie = feature.properties.Bibliography || "N/A";
    const nr = feature.properties["Nr."] || "?";

    const popupContent = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h3 style="margin: 0; color: #b71c1c; border-bottom: 1px solid #ccc;">
           Villa: ${nume}
        </h3>
        <div style="margin-top: 8px;">
          <b>Nr. crt:</b> ${nr}<br/>
          <b>Locație:</b> ${locatie}<br/>
          <b>Bibliografie:</b> <span style="font-size: 0.9em; color: #555;">${bibliografie}</span><br/>
          <hr/>
          <small>Coordonate: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}</small>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ radius: 10, fillColor: "#ff0000", fillOpacity: 1 });
        console.log("Mouse peste:", nume); // Verificare în consolă
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(pointStyle);
      }
    });

    return marker;
  };

  return (
    /* 
       Creăm un Panou cu un Z-index mare (650). 
       Poligoanele obișnuite stau la 400. 
    */
    <Pane name="villae-top-pane" style={{ zIndex: 650 }}>
      <GeoJSON 
        data={data} 
        pointToLayer={pointToLayer} 
      />
    </Pane>
  );
}