const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController')

// Rotas de Login e Cadastro
router.post('/login', loginController.fazerLogin);
router.post('/cadastrar', loginController.cadastrarUsuario);

//Rota de Usuários
router.get('/users', userController.getAllUsers);

module.exports = router;