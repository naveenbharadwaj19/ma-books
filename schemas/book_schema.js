import Joi from "joi";

export const createBook = Joi.object({
  author: Joi.string().min(2).required(),
  country: Joi.string().required(),
  image_link: Joi.string().required(),
  language: Joi.string().required(),
  link: Joi.string().uri().required(),
  pages: Joi.number().required(),
  title: Joi.string().min(2).required(),
  year: Joi.number().required(),
});

export const deleteBook = Joi.object({
  title: Joi.string().min(2).required(),
});
