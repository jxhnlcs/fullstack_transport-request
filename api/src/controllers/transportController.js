const transportRequestModel = require('../models/transportModel');
const historicoModel = require('../models/historicModel');

const getAllTransportRequests = (req, res) => {
  transportRequestModel.getAllTransportRequests((err, requests) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json(requests);
  });
};

const getTransportRequestById = (req, res) => {
  const { id } = req.params;
  transportRequestModel.getTransportRequestById(id, (err, request) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    if (!request) {
      return res.status(404).json({ message: 'Solicitação de transporte não encontrada' });
    }
    return res.status(200).json(request);
  });
};

const createTransportRequest = (req, res) => {
  const data = req.body;
  transportRequestModel.insertTransportRequest(data, (err, insertId) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    historicoModel.registrarHistorico(insertId, 'Solicitação de transporte criada', (err) => {
      if (err) {
        console.log("Erro ao registrar no histórico: ", err);
      }
    });
    return res.status(201).json({ message: 'Solicitação de transporte criada com sucesso', id: insertId });
  });
};

const updateTransportRequest = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  transportRequestModel.updateTransportRequest(id, data, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Solicitação de transporte atualizada com sucesso' });
  });
};

const deleteTransportRequest = (req, res) => {
  const { id } = req.params;
  transportRequestModel.deleteTransportRequest(id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Solicitação de transporte deletada com sucesso' });
  });
};

const updateTransportRequestPriority = (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  transportRequestModel.updateTransportRequestPriority(id, priority, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Prioridade da solicitação de transporte atualizada com sucesso' });
  });
};

const updateTransportRequestStatus = (req, res) => {
  const { id } = req.params;
  const { request_status } = req.body;

  transportRequestModel.updateTransportRequestStatus(id, request_status, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Status de solicitação de transporte atualizada com sucesso' });
  })
}

module.exports = {
  getAllTransportRequests,
  getTransportRequestById,
  createTransportRequest,
  updateTransportRequest,
  deleteTransportRequest,
  updateTransportRequestPriority,
  updateTransportRequestStatus,
};