import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { CreateSchema, UpdateSchema } from "./schema";
import Joi from "joi";

// Constants
const port = process.env.PORT || 8080;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface ISong {
  id?: number;
  name?: string;
  artist?: string;
  genre?: string;
}

const validatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method } = req;
  const data: ISong = req.body;
  let value: ISong, error;
  if (method == "POST") {
    ({ value, error } = CreateSchema.validate(data));
    if (error) return res.status(400).send(error.details[0].message);
    else req.body = value;
  } else if (method == "PUT") {
    ({ value, error } = UpdateSchema.validate(data));
    if (error) return res.status(400).send(error.details[0].message);
    else req.body = value;
  }
  next();
};

//Creating a sample music library
let data: ISong[] = [
  {
    id: 1,
    name: "Gul",
    artist: "Anuv Jain",
    genre: "Indie",
  },
  {
    id: 2,
    name: "Immortale",
    artist: "Julia Wolf",
    genre: "Pop",
  },
  {
    id: 3,
    name: "Infinite",
    artist: "Lyn Lapid",
    genre: "Pop",
  },
  {
    id: 4,
    name: "Aoge Tum Kabhi",
    artist: "The Local Train",
    genre: "Rock",
  },
];

/* EndPoints */
//create
app.post("/", validatorMiddleware, (req, res) => {
  const song: ISong = req.body;
  let lastEle = data.slice(-1)[0];
  song.id = lastEle.id ? lastEle.id + 1 : 1;
  data.push(song);
  res.status(201).send(song);
});
//read
app.get("/", (req, res) => {
  res.json(data);
});
//read specefic id
app.get("/:id", (req, res) => {
  let ele = data.find((e) => e.id == parseInt(req.params.id));
  if (ele) res.send(ele);
  else res.status(404).json({ message: "NO SONG FOUND WITH GIVEN ID" }).end();
});
//update
app.put("/", validatorMiddleware, (req, res) => {
  const song: ISong = req.body;
  if (!song.id)
    return res
      .status(404)
      .json({ message: "Please Provide Id of song to be updated" })
      .end();
  const index = data.findIndex((e) => e.id == song.id);
  data[index] = {
    ...data[index],
    ...song,
  };
  res.json(data[index]).end();
});
//delete
app.delete("/:id", (req, res) => {
  const { id } = req.params;
  let ele = data.find((e) => e.id == parseInt(id));
  if (!ele)
    return res
      .status(404)
      .json({ message: "NO SONG FOUND WITH GIVEN ID" })
      .end();
  data = data.filter((e) => e != ele);
  res.json(ele);
});

export default app.listen(8080, () => {
  console.log(`Server is running on port ${port}`);
});

export { ISong };
