import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import pin from "./assets/circle.png";
import home from "./assets/home.png";
import haversineDistance from "./utilities/haversine";
import "./App.scss";

const homeBase = [38.000641, -121.287399];
const homeBaseAddress = "1633 E Bianchi Rd, Stockton, CA 95210";
const App = () => {
  useEffect(() => {
    let interval = setInterval(getData, 10000);
    return () => clearInterval(interval);
  }, []);

  const [vehicleData, setVehicleData] = useState([]);
  const [active, setActive] = useState(null);

  const getData = async () => {
    const { data } = await axios.get("http://localhost:8000/");
    setVehicleData(data);
  };

  const Card = ({ name, driver, id }) => {
    return (
      <div
        className="map__marker-content"
        style={{ display: active === id ? "block" : "none" }}
      >
        <div>Name : {name}</div>
        {driver && <div>Driver : {driver.name}</div>}
        {active === 0 && <div>Address : {homeBaseAddress}</div>}
        <div
          className="cross"
          onClick={(e) => {
            setActive(null);
            e.stopPropagation();
          }}
        >
          X
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="map">
        <GoogleMapReact
          defaultCenter={homeBase}
          defaultZoom={11}
          bootstrapURLKeys={{ key: "AIzaSyAywJ46VQknaZbBSC5aZKgkQHffaoqEDII" }}
        >
          <div
            className="map__marker"
            lat={homeBase[0]}
            lng={homeBase[1]}
            style={{ zIndex: 10 }}
            onClick={() => {
              setActive(0);
            }}
          >
            <Card name={"HomeBase"} driver={null} id={0} />
            <img src={home} className="map__marker-pin" alt="pin" />
          </div>
          {vehicleData.map((vehicle) => {
            return (
              <div
                key={vehicle.id}
                className="map__marker"
                lat={vehicle.location.latitude}
                lng={vehicle.location.longitude}
                onClick={() => {
                  setActive(vehicle.id);
                }}
              >
                <img
                  alt="pin"
                  src={pin}
                  className="map__marker-pin"
                  style={{
                    border:
                      haversineDistance(homeBase, [
                        vehicle.location.latitude,
                        vehicle.location.longitude,
                      ]) <= 200
                        ? "2px solid green"
                        : null,
                  }}
                />
                <Card
                  name={vehicle.name}
                  driver={vehicle.driver}
                  id={vehicle.id}
                />
              </div>
            );
          })}
        </GoogleMapReact>
      </div>
      <div className="buttonGroup">
        <button className="btn_download">
          <a href="http://localhost:8000/invite" download>
            Download CSV
          </a>
        </button>
      </div>
    </div>
  );
};

export default App;
