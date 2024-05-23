const { db } = require('./db');

const getAllIncidents = (callback) => {
  const query = 'SELECT * FROM Incident';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar todos os incidentes:', err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

const getIncidentById = (id, callback) => {
  const query = 'SELECT * FROM Incident WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao consultar incidente por ID:', err);
      return callback(err, null);
    }
    return callback(null, result[0]);
  });
};

const createIncident = (data, callback) => {
  const query = `
    INSERT INTO Incident (solicitacaoId, descricao, dataHora)
    VALUES (?, ?, COALESCE(?, NOW()))
  `;
  const params = [data.solicitacaoId, data.descricao, data.dataHora || null];
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Erro ao criar incidente:', err);
      return callback(err);
    }
    return callback(null, result.insertId);
  });
};

const updateIncident = (id, data, callback) => {
  const query = `
    UPDATE Incident
    SET solicitacaoId = ?, descricao = ?, dataHora = ?
    WHERE id = ?
  `;
  const params = [data.solicitacaoId, data.descricao, data.dataHora, id];
  db.query(query, params, (err) => {
    if (err) {
      console.error('Erro ao atualizar incidente:', err);
      return callback(err);
    }
    return callback(null);
  });
};

const deleteIncident = (id, callback) => {
  const query = 'DELETE FROM Incident WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erro ao deletar incidente:', err);
      return callback(err);
    }
    return callback(null);
  });
};

module.exports = {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
};