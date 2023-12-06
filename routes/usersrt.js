// Importa y configura las variables de entorno definidas en el archivo .env
require('dotenv').config();

// Importa las bibliotecas necesarias
const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users'); // Asegúrate de proporcionar la ruta correcta a tu modelo de usuarios
const router = express.Router();

// Configura la aplicación Express
const app = express();

// Configura el puerto del servidor, utiliza el puerto proporcionado en el archivo .env o el puerto 3000 por defecto
const puerto = process.env.PORT || 3000;

// Conecta a la base de datos MongoDB utilizando la URL proporcionada en el archivo .env
mongoose.connect(process.env.DATABASE_URL);

// Define las rutas para la API RESTful

// Obtiene todos los usuarios
router.get('/', async (req, res) => {
    try {
        // Consulta todos los usuarios en la base de datos
        const users = await Users.find();
        // Responde con la lista de usuarios en formato JSON
        res.json(users);
    } catch (err) {
        // Manejo de errores: responde con un estado 500 y un mensaje de error si algo sale mal
        res.status(500).json({ message: err.message });
    }
});

// Obtiene un usuario por nombre (realiza una búsqueda insensible a mayúsculas/minúsculas)
router.get('/:nombre', async (req, res) => {
    const regex = new RegExp(req.params.nombre, 'i');
    try {
        // Realiza una búsqueda en la base de datos usando una expresión regular para hacerla insensible a mayúsculas/minúsculas
        const users = await Users.find({ nombre: regex });
        // Responde con la lista de usuarios que coinciden con la búsqueda en formato JSON
        res.json(users);
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: err.message });
    }
});

// Obtiene un usuario por ID
router.get('/id/:id', async (req, res) => {
    try {
        // Busca un usuario por su ID en la base de datos
        const user = await Users.findById(req.params.id);
        // Responde con el usuario encontrado en formato JSON
        res.json(user);
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: err.message });
    }
});

// Crea un nuevo usuario
router.post('/', async (req, res) => {
    // Crea un nuevo objeto usuario utilizando los datos proporcionados en la solicitud
    const user = new Users({
        nombre: req.body.nombre,
        edad: req.body.edad,
        ciudad: req.body.ciudad,
        intereses: req.body.intereses,
        trabajo: req.body.trabajo,
        foto64: req.body.foto64
    });

    try {
        // Guarda el nuevo usuario en la base de datos
        const newUser = await user.save();
        // Responde con el nuevo usuario creado en formato JSON y un estado 201 (creado)
        res.status(201).json(newUser);
    } catch (err) {
        // Manejo de errores
        res.status(400).json({ message: err.message });
    }
});

// Actualiza un usuario existente
router.patch('/:id', getUsers, async (req, res) => {
    // Actualiza las propiedades del usuario si se proporcionan en la solicitud
    if (req.body.nombre != null) {
        res.user.nombre = req.body.nombre;
    }
    if (req.body.edad != null) {
        res.user.edad = req.body.edad;
    }
    if (req.body.ciudad != null) {
        res.user.ciudad = req.body.ciudad;
    }
    if (req.body.intereses != null) {
        res.user.intereses = req.body.intereses;
    }
    if (req.body.trabajo != null) {
        res.user.trabajo = req.body.trabajo;
    }
    if (req.body.foto64 != null) {
        res.user.foto64 = req.body.foto64;
    }

    try {
        // Guarda el usuario actualizado en la base de datos
        const updatedUser = await res.user.save();
        // Responde con el usuario actualizado en formato JSON
        res.json(updatedUser);
    } catch (err) {
        // Manejo de errores
        res.status(400).json({ message: err.message });
    }
});

// Elimina un usuario por ID
router.delete('/:id', async (req, res) => {
    try {
        // Elimina un usuario por su ID de la base de datos
        const deletedUser = await Users.deleteOne({ _id: req.params.id });
        // Verifica si se eliminó algún usuario y responde en consecuencia
        if (deletedUser.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Responde con un mensaje indicando que el usuario ha sido eliminado
        res.json({ message: 'Deleted User' });
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: err.message });
    }
});

// Middleware para obtener un usuario por ID y adjuntarlo a la respuesta
async function getUsers(req, res, next) {
    let user;
    try {
        // Busca un usuario por su ID y verifica si existe
        user = await Users.findById(req.params.id);
        if (user == null) {
            // Si no se encuentra el usuario, responde con un estado 404 y un mensaje
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        // Manejo de errores
        return res.status(500).json({ message: err.message });
    }

    // Adjunta el usuario encontrado a la respuesta y pasa al siguiente middleware o ruta
    res.user = user;
    next();
}

// Exporta el router configurado con todas las rutas
module.exports = router;
