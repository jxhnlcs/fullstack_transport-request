const { db } = require('./db');

const getAllTransportRequests = (callback) => {
  const query = 'SELECT * FROM TransportRequests';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao consultar todas as solicitações de transporte:', err);
      return callback(err, null);
    }
    return callback(null, results);
  });
};

const getTransportRequestById = (id, callback) => {
  const query = 'SELECT * FROM TransportRequests WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao consultar solicitação de transporte por ID:', err);
      return callback(err, null);
    }
    return callback(null, results[0]);
  });
};

const insertTransportRequest = (data, callback) => {
  const query = `
    INSERT INTO TransportRequests (patient_name, status, priority, data, initial_point, destination_point, maqueiro_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [data.patient_name, data.status, data.priority, data.data, data.initial_point, data.destination_point, data.maqueiro_id];
  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Erro ao inserir solicitação de transporte:', err);
      return callback(err);
    }
    return callback(null, result.insertId);
  });
};

const updateTransportRequest = (id, data, callback) => {
  const query = `
    UPDATE TransportRequests
    SET patient_name = ?, status = ?, priority = ?, data = ?, initial_point = ?, destination_point = ?, maqueiro_id = ?
    WHERE id = ?
  `;
  const params = [data.patient_name, data.status, data.priority, data.data, data.initial_point, data.destination_point, data.maqueiro_id, id];
  db.query(query, params, (err) => {
    if (err) {
      console.error('Erro ao atualizar solicitação de transporte:', err);
      return callback(err);
    }
    return callback(null);
  });
};

const deleteTransportRequest = (id, callback) => {
  const query = 'DELETE FROM TransportRequests WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      console.error('Erro ao deletar solicitação de transporte:', err);
      return callback(err);
    }
    return callback(null);
  });
};

module.exports = {
  getAllTransportRequests,
  getTransportRequestById,
  insertTransportRequest,
  updateTransportRequest,
  deleteTransportRequest,
};