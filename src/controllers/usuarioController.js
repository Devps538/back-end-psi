// controllers/usuarioController.js
const Usuario = require('../db');

// Criar um novo usuário
exports.createUsuario = async (req, res) => {
  try {
    const { nome, cpf, email, dataNascimento, sexo, senha, tipoUsuario } = req.body;

    const novoUsuario = await Usuario.create({
      nome,
      cpf,
      email,
      dataNascimento,
      sexo,
      senha,
      tipoUsuario,
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todos os usuários
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter um usuário por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Atualizar um usuário
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, email, dataNascimento, sexo, senha, tipoUsuario } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    usuario.nome = nome;
    usuario.cpf = cpf;
    usuario.email = email;
    usuario.dataNascimento = dataNascimento;
    usuario.sexo = sexo;
    usuario.senha = senha;
    usuario.tipoUsuario = tipoUsuario;

    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar um usuário
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await usuario.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
