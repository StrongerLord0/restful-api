// Importa la biblioteca mongoose para la gestión de modelos MongoDB
const mongoose = require('mongoose');

// Define un esquema de datos para los usuarios utilizando la funcionalidad de esquemas de mongoose
const userSchema = new mongoose.Schema({
  // Nombre del usuario, se espera que sea una cadena de texto
  nombre: String,
  // Edad del usuario, se espera que sea una cadena de texto
  edad: String,
  // Ciudad del usuario, se espera que sea una cadena de texto
  ciudad: String,
  // Intereses del usuario, se espera que sea una matriz de cadenas de texto
  intereses: [String],
  // Detalles del trabajo del usuario, incluyendo el puesto, la empresa y la experiencia
  trabajo: {
    puesto: String,
    empresa: String,
    experiencia: String
  },
  // Cadena de texto que representa la imagen del usuario en formato base64
  foto64: String
});

// Crea un modelo de mongoose llamado 'User' basado en el esquema definido anteriormente
const User = mongoose.model('User', userSchema);

// Exporta el modelo User para que pueda ser utilizado en otras partes de la aplicación
module.exports = User;
