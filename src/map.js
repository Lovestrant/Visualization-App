import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { fromLonLat } from "ol/proj.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { Style, Circle, Fill, Stroke } from "ol/style.js";
import CsvFileUploader from "./CsvFileUploader";
import { coordinateData } from "./coordinates";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [mapData, setMapData] = useState([]);
  const [count, setCount] = useState(0);

  const vectorLayer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color: "red" }),
        stroke: new Stroke({ color: "black", width: 2 }),
      }),
    }),
  });

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: mapRef.current,
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    return () => {
      map.dispose();
    };
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const features = mapData.map((coord) => {
          return new Feature({
            geometry: new Point(fromLonLat([coord.longitude, coord.latitude])),
          });
        });
        vectorLayer.getSource().addFeatures(features);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
    fetchCoordinates();
  }, [count, mapData]);

  const handleDataLoad = (data) => {
    setMapData(data);
    setCount(count + 1);
  };

  return (
    <div>
      <h2>Select CSV File</h2>
      <CsvFileUploader onDataLoad={handleDataLoad} />
      {/* <h2>Map Data</h2>
      <pre>{JSON.stringify(mapData, null, 2)}</pre> */}
      <div
        id="map"
        ref={mapRef}
        style={{ display: "flex", height: "calc(100vh - 70px)", width: "100%" }}
      />
    </div>
  );
};

export default MapComponent;
