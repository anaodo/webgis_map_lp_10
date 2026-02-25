import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";

export default function RiversLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadRivers() {
      try {
        const res = await fetch("/data/Rivers.geojson");
        if (!res.ok) throw new Error("Nu s-a putut încărca fișierul Rivers.geojson");
        const json = await res.json();
        console.log("Rivers GeoJSON încărcat:", json);
        setData(json);
      } catch (err) {
        console.error("Eroare la încărcarea layer-ului Rivers:", err);
      }
    }
    loadRivers();
  }, []);

  // Stilul implicit pentru linii
  const riverStyle = {
    color: "#3388ff",
    weight: 3,
    opacity: 0.8,
  };

  const onEachRiver = (feature, layer) => {
    const props = feature.properties;

    // Construim popup-ul
    let popupContent = `
      <div style="max-height: 200px; overflow-y: auto;">
        <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="text-align: left; padding: 4px;">Atribut</th>
              <th style="text-align: left; padding: 4px;">Valoare</th>
            </tr>
          </thead>
          <tbody>
    `;

    Object.entries(props).forEach(([key, value]) => {
      popupContent += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 4px; font-weight: bold; color: #555;">${key}</td>
          <td style="padding: 4px;">${value !== null ? value : "N/A"}</td>
        </tr>
      `;
    });

    popupContent += `</tbody></table></div>`;

    layer.bindPopup(popupContent, { maxWidth: 300 });

    const numeRau = props.name || props.NAME || "Râu fără nume";
    layer.bindTooltip(numeRau, { sticky: true });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 5,
          color: "#0000ff",
          opacity: 1
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(riverStyle);
      }
    });
  };

  if (!data) return null;

  // --- AICI ERA EROAREA: Lipsea return-ul și închiderea componentei ---
  return (
    <Pane name="rivers-pane" style={{ zIndex: 400 }}>
      <GeoJSON 
        data={data} 
        style={riverStyle} 
        onEachFeature={onEachRiver} 
      />
    </Pane>
  );
}