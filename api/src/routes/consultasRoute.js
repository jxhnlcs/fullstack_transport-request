const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController')
const transportRequestController = require('../controllers/transportController');

// Rotas de Login e Cadastro
router.post('/login', loginController.fazerLogin);
router.post('/register', loginController.cadastrarUsuario);

//Rota de Usuários
router.get('/users', userController.getAllUsers);

// Rota de Solicitações de Transporte
router.get('/transport-requests', transportRequestController.getAllTransportRequests);
router.get('/transport-requests/:id', transportRequestController.getTransportRequestById);
router.post('/transport-requests', transportRequestController.createTransportRequest);
router.put('/transport-requests/:id', transportRequestController.updateTransportRequest);
router.delete('/transport-requests/:id', transportRequestController.deleteTransportRequest);

// Rota de Priorização de Transporte
router.put('/transport-requests/:id/priority', transportRequestController.updateTransportRequestPriority);

// Rota de atualização de Status 
router.put('/transport-requests/:id/request-status', transportRequestController.updateTransportRequestStatus)

module.exports = router;