const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String },
  desc: { type: String },
  greeting: { type: String },
  answer: { type: Array, default: ['First quick answer...Click to (+) button below to add new one...'] },
  notes: { type: Array, default: ['First note...Click to (+) button below to add new note...'] },
  site: { type: String },
  avatar: { type: String },
})

module.exports = model('User', schema)