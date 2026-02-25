import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";

export default function IstrosroadsLayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadRoads() {
      try {
        // Asigură-te că fișierul se numește așa în folderul public/data/
        const res = await fetch("/data/histria roads final.geojson");
        if (!res.ok) throw new Error("Nu s-a putut încărca fișierul GeoJSON");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Eroare la încărcarea layer-ului Istros Roads:", err);
      }
    }
    loadRoads();
  }, []);

  // 1. Definim stilurile pentru fiecare tip de drum
  const styles = {
    major: {
      color: "#d35400", // Portocaliu închis / Roșcat
      weight: 5,
      opacity: 0.9,
    },
    minor: {
      color: "#7f8c8d", // Gri
      weight: 4,
      opacity: 0.7,
      dashArray: "5, 5" // Linie întreruptă pentru drumuri minore (opțional)
    },
    default: {
      color: "#333",
      weight: 2
    }
  };

  // 2. Funcția de stilizare dinamică
  const roadStyle = (feature) => {
    const roadClass = feature.properties.CLASS;
    if (roadClass === "Major Road") return styles.major;
    if (roadClass === "Minor Road") return styles.minor;
    return styles.default;
  };

  const onEachRoad = (feature, layer) => {
    const props = feature.properties;

    // Construim popup-ul cu tabel (similar cu cel de la rîuri)
    let popupContent = `
      <div style="max-height: 200px; overflow-y: auto; font-family: sans-serif;">
        <strong style="display:block; margin-bottom:5px; border-bottom:1px solid #000;">Detalii Drum</strong>
        <table style="border-collapse: collapse; width: 100%; font-size: 11px;">
          <tbody>
    `;

    Object.entries(props).forEach(([key, value]) => {
      popupContent += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 2px; font-weight: bold; color: #555;">${key}</td>
          <td style="padding: 2px;">${value || "N/A"}</td>
        </tr>
      `;
    });

    popupContent += `</tbody></table></div>`;
    layer.bindPopup(popupContent);

    // Tooltip: afișează clasa drumului
    layer.bindTooltip(`Tip: ${props.CLASS}`, { sticky: true });

    // Efecte de Hover
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 6,
          color: "#f1c40f", // Galben la hover
          opacity: 1
        });
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        // Resetăm la stilul original definit în funcția roadStyle
        l.setStyle(roadStyle(feature));
      }
    });
  };

  if (!data) return null;

  return (
    <Pane name="roads-pane" style={{ zIndex: 450 }}>
      <GeoJSON 
        data={data} 
        style={roadStyle} 
        onEachFeature={onEachRoad} 
      />
    </Pane>
  );
}