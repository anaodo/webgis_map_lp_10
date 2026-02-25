import { LayersControl, TileLayer } from "react-leaflet";
import { useState } from "react";

import BisericiLayer from "./BisericiLayer";
import RoJudeteLayer from "./RoJudeteLayer";
import IstrosLayer from "./IstrosLayer";
import RiversLayer from "./RiversLayer";
import IstrosroadsLayer from "./IstrosroadsLayer";
import VillaeLayer from "./VillaeLayer";



const { BaseLayer } = LayersControl;

export default function LayerToggle() {
  const [showBiserici, setShowBiserici] = useState(false);
  const [showJudete, setShowJudete] = useState(false);
  const [showIstros, setshowIstros] = useState(false);
  const [showRivers, setShowRivers] = useState(false);
  const [showIstrosroads, setShowIstrosroads] = useState(false);
  const [showVillae, setShowVillae] = useState(false);
  


  // Helper to toggle a layer with loading overlay
  async function handleLayerToggle(setter, value, fetchPromise) {
    setter(value); // toggle the checkbox state
    if (value && fetchPromise) {
      try {
        await fetchPromise(); // wait for layer data to "load"
      } catch (err) {
        console.error("Failed to load layer:", err);
      }
    }
  }


  return (
    <>
      {/* CUSTOM CHECKBOXES */}
      <div style={{
        position: "absolute",
        top: 100,
        left: 10,
        background: "white",
        padding: "10px",
        zIndex: 1000,
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0,0,0,0.2)"
      }}>
      <p style={{margin:'0px', fontSize:'1rem'}}>Straturi</p>
        <label>
          <input
            type="checkbox"
            checked={showBiserici}
            onChange={(e) =>
              handleLayerToggle(setShowBiserici, e.target.checked, async () => {
                await fetch("/data/biserici_RO.geojson"); // simulate load
              })
            }
          />
          Biserici
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            checked={showJudete}
            onChange={(e) =>
              handleLayerToggle(setShowJudete, e.target.checked, async () => {
                await fetch("/data/ro_judete_poligon.geojson");
              })
            }
          />
          Judete
        </label>
        <br />
       
        <label>
          <input
            type="checkbox"
            checked={showIstros}
            onChange={(e) =>
              handleLayerToggle(setshowIstros, e.target.checked, async () => {
                await fetch("/data/Istros.geojson");
              })
            }
          />
          Istros
        </label>
        <br />
      
      <label>
          <input
            type="checkbox"
            checked={showRivers}
            onChange={(e) =>
              handleLayerToggle(setShowRivers, e.target.checked, async () => {
                await fetch("/data/Rivers.geojson");
              })
            }
          />
          Rivers
        </label>
        <br />
      
      <label>
          <input
            type="checkbox"
            checked={showIstrosroads}
            onChange={(e) =>
              handleLayerToggle(setShowIstrosroads, e.target.checked, async () => {
                await fetch("/data/histria roads final.geojson");
              })
            }
          />
          Istrosroads
        </label>
        <br />

      <label>
          <input
            type="checkbox"
            checked={showVillae}
            onChange={(e) =>
              handleLayerToggle(setShowVillae, e.target.checked, async () => {
                await fetch("/data/villae.geojson");
              })
            }
          />
          Villae
        </label>
        <br />

      
      </div>

      {/* DOWNLOAD LAYERS */}
      {/* <DownloadLayers
        layers={[
          showBiserici && { url: "/data/biserici_RO.geojson", filename: "biserici_RO.geojson" },
          showJudete && { url: "/data/ro_judete_poligon.geojson", filename: "judete.geojson" },
        ].filter(Boolean)}
      /> */}

      {/* BASEMAP CONTROL */}
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
        </BaseLayer>

        <BaseLayer name="Carto Light">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap © CARTO"
          />
        </BaseLayer>

        <BaseLayer name="Carto Dark Matter">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© OpenStreetMap © CARTO"
          />
        </BaseLayer>

        <BaseLayer name="Esri World Imagery">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
          />
        </BaseLayer>

        <BaseLayer name="Esri World Street Map">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri"
          />
        </BaseLayer>

        <BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="© OpenTopoMap contributors"
          />
        </BaseLayer>
      </LayersControl>

      {/* LAZY LOADED DATA LAYERS */}
      {showBiserici && <BisericiLayer />}
      {showJudete && <RoJudeteLayer />}
      {showIstros && <IstrosLayer />}
      {showRivers && <RiversLayer />}
      {showIstrosroads && <IstrosroadsLayer />}
      {showVillae && <VillaeLayer />}
      
  

    </>
  );
}