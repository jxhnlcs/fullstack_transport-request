const jwt = require('jsonwebtoken');
const loginModel = require('../models/loginModel');

const secretKey = 'secret_key';

const cadastrarUsuario = (req, res) => {
  const { name, username, password } = req.body;

  loginModel.insertUser(name, username, password, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  });
};

const fazerLogin = (req, res) => {
  const { username, password } = req.body;

  loginModel.getUserByUsernameAndPassword(username, password, (err, userData) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (Array.isArray(userData) && userData.length === 1) {
      const { UserID, username, name } = userData[0];

      const userInfo = {
        userid: UserID,
        user: username,
        name: name,
      };

      const token = jwt.sign(userInfo, secretKey, { expiresIn: '5h' });

      return res.status(200).json({ authenticated: true, token });
    } else {
      return res.status(401).json({ authenticated: false, message: 'Credenciais inválidas' });
    }
  });
};

module.exports = {
  fazerLogin,
  cadastrarUsuario,
};