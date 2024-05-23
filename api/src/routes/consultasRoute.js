const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const userController = require('../controllers/userController')
const transportRequestController = require('../controllers/transportController');
const historicController = require('../controllers/historicController');
const incidentController = require('../controllers/IncidentController');

// Rotas de Login e Cadastro
router.post('/login', loginController.fazerLogin);
router.post('/register', loginController.cadastrarUsuario);

//Rota de Usuários
router.get('/users', userController.getAllUsers);

// Rota de Solicitações de Transporte
router.get('/transport-requests', transportRequestController.getAllTransportRequests);
router.get('/transport-requests/:id', transportRequestController.getTransportRequestById);
router.get('/transport-requests/maqueiro/:maqueiro_id', transportRequestController.getTransportRequestsByMaqueiroId);
router.post('/transport-requests', transportRequestController.createTransportRequest);
router.put('/transport-requests/:id', transportRequestController.updateTransportRequest);
router.delete('/transport-requests/:id', transportRequestController.deleteTransportRequest);

// Rota de Priorização de Transporte
router.put('/transport-requests/:id/priority', transportRequestController.updateTransportRequestPriority);

// Rota de atualização de Status 
router.put('/transport-requests/:id/request-status', transportRequestController.updateTransportRequestStatus)

// Rota para obter o histórico de uma solicitação de transporte
router.get('/historic/:solicitacaoId', historicController.getHistoricoBySolicitacaoId);

//Rotas de Incidentes
router.get('/incidents', incidentController.getAllIncidents);
router.get('/incidents/:id', incidentController.getIncidentById);
router.post('/incidents', incidentController.createIncident);
router.put('/incidents/:id', incidentController.updateIncident);
router.delete('/incidents/:id', incidentController.deleteIncident);

module.exports = router;