const { db } = require('../models/db');

class LoginModel {
  constructor() {}

  getUserByUsernameAndPassword(username, password, callback) {
    const userQuery = `
      SELECT * 
      FROM Users
      WHERE username = ? AND password = SHA2(?, 256)
    `;

    db.query(userQuery, [username, password], (err, userData) => {
      if (err) {
        console.error('Erro ao consultar usuário por nome de usuário e senha:', err);
        return callback(err, null);
      }

      return callback(null, userData);
    });
  }

  insertUser(name, username, password, callback) {
    const insertUserQuery = `
      INSERT INTO Users (name, username, password)
      VALUES (?, ?, SHA2(?, 256))
    `;

    db.query(insertUserQuery, [name, username, password], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário na tabela Users:', err);
        return callback(err);
      }

      return callback(null);
    });
  }
}

module.exports = new LoginModel();