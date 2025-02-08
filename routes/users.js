var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

// Get All Users
router.get('/get-all', async function (req, res) {
  const users = await prisma.user.findMany();
  if (users.length === 0 || users === undefined) {
    res.status(404).json('User does not exist!');
  } else {
    res.send(users);
  }
});

// Get User by ID
router.get('/get-user/:id', async function (req, res) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (user === undefined || user === null) {
    res.status(404).json(`User with id ${id} does not exist!`);
  } else {
    res.send(user);
  }
});

// Create User
router.post('/create', async function (req, res) {
  const { name, email, password } = req.body;

  name === '' ? res.json("Please fill name field") : email === '' ? res.json("Please fill email field") : password === '' ? res.json("Please fill password field") : (async () => {

      const hashPassword = await bcrypt.hash(password, 10);
      const stringPassword = await stringify(hashPassword);
      const user = await prisma.user.create({
        data: {
          username: name,
          email,
          password: stringPassword,
        },
      });
      res.send(user);
      
  });
});

// Update User
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const userExist = await prisma.user.findUnique({
    where:{
      id: parseInt(id)
    }
  })

  if(!userExist){
    res.status(404).json("User not found!")
  }
  
  const { name, email, password } = req.body;
  const hashPassword = bcrypt.hash(password, 10);
  const stringPassword = stringify(hashPassword);
  name === '' ? res.json('Please fill the name field') : email === '' ? res.json('Please fill the email field') : password === '' ? res.json('Please fill the password field') : (async () => {
    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        username: name,
        email,
        password: stringPassword,
      },
    });
    res.send(user);
  })
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const userExist = await prisma.user.findUnique({
    where: {
      id: parseInt(id)
    }
  })

  if(!userExist) {
    res.status(404).json("User not found")
  } else {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send(user);
  }
});

module.exports = router;
