const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/vehicles", async (req, res) => {
  const { data } = await axios("https://api.samsara.com/fleet/vehicles", {
    method: "GET",
    headers: {
      Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
    },
  });
  return res.json(data);
});

app.get("/vehicles/locations", async (req, res) => {
  const {
    query: { vehicleIds },
  } = req;
  const { data } = await axios(
    `https://api.samsara.com/fleet/vehicles/locations?vehicleIds=${vehicleIds}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
      },
    }
  );
  return res.json(data.data);
});

app.listen(8000, () => {
  console.log("express listening");
});
