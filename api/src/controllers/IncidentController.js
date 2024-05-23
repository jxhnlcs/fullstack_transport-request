const incidentModel = require('../models/IncidentModel');

const getAllIncidents = (req, res) => {
  incidentModel.getAllIncidents((err, incidents) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json(incidents);
  });
};

const getIncidentById = (req, res) => {
  const { id } = req.params;
  incidentModel.getIncidentById(id, (err, incident) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    if (!incident) {
      return res.status(404).json({ message: 'Incidente não encontrado' });
    }
    return res.status(200).json(incident);
  });
};

const createIncident = (req, res) => {
  const data = req.body;
  incidentModel.createIncident(data, (err, insertId) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(201).json({ message: 'Incidente criado com sucesso', id: insertId });
  });
};

const updateIncident = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  incidentModel.updateIncident(id, data, (err) => {
    if (err) {
      return res.status(500).json.json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Incidente atualizado com sucesso' });
  });
};

const deleteIncident = (req, res) => {
  const { id } = req.params;
  incidentModel.deleteIncident(id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
    return res.status(200).json({ message: 'Incidente deletado com sucesso' });
  });
};

module.exports = {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
};
