import Joi from "joi";

const CreateSchema = Joi.object({
  name: Joi.string().max(50).required(),
  artist: Joi.string().max(50).required(),
  genre: Joi.string().max(50).required(),
});

const UpdateSchema = Joi.object({
  id: Joi.number().min(0).required(),
  name: Joi.string().max(50),
  artist: Joi.string().max(50),
  genre: Joi.string().max(50),
});

export { CreateSchema, UpdateSchema };
