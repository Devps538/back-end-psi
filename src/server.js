const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Usuario, sequelize } = require('./db'); // Importa os modelos e a instância do Sequelize

const app = express();
const port = 3000;

// Habilita CORS para aceitar requisições do frontend
app.use(cors());
app.use(express.json()); // Faz o parsing do JSON no corpo das requisições

// Conecta ao banco de dados antes de iniciar o servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Erro ao conectar no banco de dados:', err);
  });

/** 
 * ROTA GET - Obter todos os usuários
 */
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

/** 
 * ROTA POST - Criar um novo usuário
 */
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, cpf, email, dataNascimento, sexo, senha, tipoUsuario } = req.body;

    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    // Validação de CPF (11 caracteres)
    if (cpf.length !== 11) {
      return res.status(400).json({ error: 'CPF deve ter 11 caracteres.' });
    }

    // Valida o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    // Verifica se o CPF ou e-mail já existem
    const usuarioExistente = await Usuario.findOne({ where: { cpf } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário com este CPF já existe.' });
    }

    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ error: 'Usuário com este e-mail já existe.' });
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      cpf,
      email,
      dataNascimento,
      sexo,
      senha: hashedPassword,
      tipoUsuario,
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

/** 
 * ROTA PUT - Atualizar um usuário existente
 */
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, email, dataNascimento, sexo, senha, tipoUsuario } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Hash da senha, mas somente se for fornecida
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : usuario.senha;

    // Atualiza os campos
    await usuario.update({
      nome: nome || usuario.nome,
      cpf: cpf || usuario.cpf,
      email: email || usuario.email,
      dataNascimento: dataNascimento || usuario.dataNascimento,
      sexo: sexo || usuario.sexo,
      senha: hashedPassword,
      tipoUsuario: tipoUsuario || usuario.tipoUsuario,
    });

    res.json({ message: 'Usuário atualizado com sucesso.', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

/** 
 * ROTA DELETE - Deletar um usuário pelo ID
 */
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await usuario.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
