const userModel = require('../models/userModel');

const getAllUsers = (req, res) => {
  userModel.getAllUsers((err, result) => {
    if (err) {
      console.error('Erro ao obter todos os usuários:', err);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    return res.status(200).json(result);
  });
};

module.exports = {
  getAllUsers,
};