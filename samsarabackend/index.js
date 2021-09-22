const express = require("express");
const cors = require("cors");
const axios = require("axios");
const CronJob = require("cron").CronJob;
const admin = require("firebase-admin");
const haversineDistance = require("./utilities/haversine");
const Parser = require("json2csv").Parser;

//firebase admin initialized
admin.initializeApp({
  credential: admin.credential.cert(
    require("./samsara-15b80-firebase-adminsdk-ysxy5-dec7614018.json")
  ),
});

// express setup and middlewares
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// in-memory variables
const homeBase = [38.000641, -121.287399];
let VehicleData = [];
let job;

const getData = async () => {
  console.time("runtime");
  let response;
  let data = [];
  let pagination;
  try {
    response = await axios("https://api.samsara.com/fleet/vehicles", {
      method: "GET",
      headers: {
        Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
      },
    });
    data = response.data.data;
    pagination = response.data.pagination;
    while (pagination.hasNextPage) {
      response = await axios("https://api.samsara.com/fleet/vehicles", {
        method: "GET",
        headers: {
          Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
        },
        params: {
          after: pagination.endCursor,
        },
      });
      data.push(...response.data.data);
      pagination = response.data.pagination;
    }
  } catch (err) {
    console.log(err);
    return;
  }
  let locationData = [];
  let queryString = data
    .reduce((prev, cur) => cur.id + "," + prev, "")
    .slice(0, -1);
  try {
    response = await axios("https://api.samsara.com/fleet/vehicles/locations", {
      method: "GET",
      headers: {
        Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
      },
      params: {
        vehicleIds: queryString,
      },
    });
    locationData = response.data.data;
    pagination = response.data.pagination;
    while (pagination.hasNextPage) {
      response = await axios(
        "https://api.samsara.com/fleet/vehicles/locations",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer samsara_api_9q02yNCKFSICNLkZZCxr3hSL2lbGYY",
          },
          params: {
            vehicleIds: queryString,
            after: pagination.endCursor,
          },
        }
      );
      locationData.push(...response.data.data);
      pagination = response.data.pagination;
    }
  } catch (err) {
    console.log(err);
    return;
  }
  VehicleData = [];
  let Promise_array = [];
  for (let i = 0; i < locationData.length; ++i) {
    VehicleData.push({
      name: locationData[i].name,
      id: locationData[i].id,
      location: {
        latitude: locationData[i].location.latitude,
        longitude: locationData[i].location.longitude,
      },
      driver: data[i].staticAssignedDriver
        ? {
            id: data[i].staticAssignedDriver.id,
            name: data[i].staticAssignedDriver.name,
          }
        : null,
    });
    Promise_array.push(
      admin
        .firestore()
        .collection("vehicles")
        .doc(locationData[i].id)
        .set({
          ...VehicleData[i],
        })
    );
  }
  try {
    await Promise.all(Promise_array);
  } catch (err) {
    console.log(err);
  }
  console.timeEnd("runtime");
  console.log("\n\n");
};

app.get("/", async (req, res) => {
  return res.json(VehicleData);
});

app.get("/invite", async (req, res) => {
  let curData = VehicleData;
  curData = curData.filter(
    (e) =>
      haversineDistance(homeBase, [
        e.location.latitude,
        e.location.longitude,
      ]) <= 200
  );
  const json2csv = new Parser();
  const csv = json2csv.parse(curData);
  res.header("Content-Type", "text/csv");
  let d = new Date().toISOString();
  res.attachment(`Invites ${d}.csv`);
  return res.send(csv);
});

job = new CronJob(
  "*/10 * * * * *",
  getData,
  null,
  false,
  "America/Los_Angeles"
);
job.start();

app.listen(8000, () => {
  console.log("express listening");
});
