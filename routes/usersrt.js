require('dotenv').config();     
const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const router = express.Router();

const app = express();

const puerto = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL);

// Getting all
router.get('/', async (req, res) => {
    try {
      const users = await Users.find()
      res.json(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  // Getting One
  router.get('/:nombre', async (req, res) => {
    const regex = new RegExp(req.params.nombre, 'i'); // 'i' para hacer la búsqueda insensible a mayúsculas/minúsculas
    try {
      const users = await Users.find({ nombre: regex });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/id/:id', async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Creating one
  router.post('/', async (req, res) => {
    const user = new Users({
      nombre: req.body.nombre,
      edad: req.body.edad,
      ciudad: req.body.ciudad,
      intereses: req.body.intereses,
      trabajo: req.body.trabajo,
      foto64: req.body.foto64
      },
    );
    try {
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  
  // Updating One
  router.patch('/:id', getUsers, async (req, res) => {
    if (req.body.nombre != null) {
      res.user.nombre = req.body.nombre
    }
    if (req.body.edad != null) {
      res.user.edad = req.body.edad
    }
    if (req.body.ciudad != null) {
      res.user.ciudad = req.body.ciudad
    }
    if (req.body.intereses != null) {
      res.user.intereses = req.body.intereses
    }
    if (req.body.trabajo != null) {
      res.user.trabajo = req.body.trabajo
    }
    if (req.body.foto64 != null) {
      res.user.foto64 = req.body.foto64
    }

    try {
      const updatedUser = await res.user.save()
      res.json(updatedUser)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  
  // Deleting One
  router.delete('/:id', async (req, res) => {
    try {
      const deletedUser = await Users.deleteOne({ _id: req.params.id });
      if (deletedUser.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Deleted User' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })
  
  async function getUsers(req, res, next) {
    let user
    try {
      user = await Users.findById(req.params.id)
      if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.user = user
    next()
  }
  
  module.exports = router

