import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { haversineDistance } from "./utilities/haversine";
import "./App.scss";

const homeBase = [38.000641, -121.287399];

function App() {
  useEffect(() => {
    getVehicleData();
  }, []);

  const getVehicleData = async () => {
    const { data } = await axios.get("http://localhost:8000/vehicles");
    getLocationStuff(data.data);
  };

  const getLocationStuff = async (data) => {
    let locations = await axios.get(
      "http://localhost:8000/vehicles/locations",
      {
        params: {
          vehicleIds: data
            .reduce((prev, curr) => curr.id + "," + prev, "")
            .slice(0, -1),
        },
      }
    );
    console.log(locations.data);
  };

  return (
    <div className="container">
      <div className="map">
        <GoogleMapReact
          defaultCenter={homeBase}
          defaultZoom={11}
          bootstrapURLKeys={{ key: "AIzaSyAywJ46VQknaZbBSC5aZKgkQHffaoqEDII" }}
        ></GoogleMapReact>
      </div>
    </div>
  );
}

export default App;
