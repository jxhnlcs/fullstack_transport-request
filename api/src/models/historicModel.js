const { db } = require('../models/db');

exports.registrarHistorico = (solicitacaoId, descricao, callback) => {
    const timestamp = new Date();
    const query = 'INSERT INTO TransportHistoric (solicitacaoId, descricao, timestamp) VALUES (?, ?, ?)';
    db.query(query, [solicitacaoId, descricao, timestamp], (err, result) => {
        callback(err);
    });
};