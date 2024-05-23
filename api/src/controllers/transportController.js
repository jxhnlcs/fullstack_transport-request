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

const getTransportRequestsByMaqueiroId = (req, res) => {
  const { maqueiro_id } = req.params;
  transportRequestModel.getTransportRequestsByMaqueiroId(maqueiro_id, (err, requests) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'Nenhuma solicitação de transporte encontrada para o maqueiro especificado' });
    }
    return res.status(200).json(requests);
  });
};

const createTransportRequest = (req, res) => {
  const data = req.body;
  transportRequestModel.insertTransportRequest(data, (err, insertId) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    const description = 'Solicitação de transporte criada';

    historicoModel.registrarHistorico(id, description, (err) => {
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
    const description = 'Solicitação de transporte atualizada';

    historicoModel.registrarHistorico(id, description, (err) => {
      if (err) {
        console.log("Erro ao registrar no histórico: ", err);
      }
    });
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

    const description = `Solicitação de transporte priorizada como ${priority}`;

    historicoModel.registrarHistorico(id, description, (err) => {
      if (err) {
        console.log("Erro ao registrar no histórico: ", err);
      }
    });
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
    
    let description = 'Solicitação de transporte atualizada';
    if (request_status === 'Aceito') {
      description = 'Solicitação de transporte aceita';
    } else if (request_status === 'Negado') {
      description = 'Solicitação de transporte negada';
    }
    else if (request_status === 'Pendente') {
      description = 'Solicitação de transporte pendente';
    }

    historicoModel.registrarHistorico(id, description, (err) => {
      if (err) {
        console.log("Erro ao registrar no histórico: ", err);
      }
    });

    return res.status(200).json({ message: 'Status de solicitação de transporte atualizada com sucesso' });
  })
}


module.exports = {
  getAllTransportRequests,
  getTransportRequestById,
  getTransportRequestsByMaqueiroId,
  createTransportRequest,
  updateTransportRequest,
  deleteTransportRequest,
  updateTransportRequestPriority,
  updateTransportRequestStatus,
};