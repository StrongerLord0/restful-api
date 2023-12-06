const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  edad: String,
  ciudad: String,
  intereses: [String],
  trabajo: {
    puesto: String,
    empresa: String,
    experiencia: String
  },
  foto64: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;