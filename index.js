// Carga las variables de entorno desde un archivo .env
require('dotenv').config()

// Importa las bibliotecas necesarias
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

// Configura el acceso de la aplicación para todos los dominios
app.use(cors()); // Habilita CORS para todas las rutas
app.use(bodyParser.json({limit: '50mb'})); // Analiza los cuerpos de las solicitudes JSON con un límite de tamaño de 50mb
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // Analiza los cuerpos de las solicitudes URL-encoded con un límite de tamaño de 50mb
app.use(express.json()) // Analiza los cuerpos de las solicitudes JSON

// Conecta a la base de datos MongoDB usando Mongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error)) // Registra los errores de conexión
db.once('open', () => console.log('Connected to Database')) // Registra una vez que la conexión se ha establecido

// Importa y utiliza el router de usuarios
const usersRouter = require('./routes/usersrt.js')
app.use('/users' , usersRouter);

// Inicia el servidor en el puerto 8000
app.listen(3000, () => console.log('Server Started on port 3000'))