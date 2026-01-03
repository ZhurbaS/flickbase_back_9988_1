const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;
require('dotenv').config();

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: 100,
    required: [true, 'Вам потрібна назва'],
  },
  content: {
    type: String,
    required: [true, 'Вам потрібен контент'],
  },
  excerpt: {
    type: String,
    maxLength: 500,
    required: [true, 'Вам потрібен опис'],
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  actors: {
    type: [String],
    required: true,
    validate: {
      validator: function (array) {
        return array.length >= 3;
      },
      message: 'Потрібно не менше 3 акторів',
    },
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'public'],
    default: 'draft',
    index: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.plugin(aggregatePaginate);

const Article = mongoose.model('Article', articleSchema);
module.exports = { Article };
