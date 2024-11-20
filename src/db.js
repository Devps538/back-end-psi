// src/db.js
const { Sequelize, DataTypes } = require('sequelize'); // Importando Sequelize e DataTypes

// Criando uma nova instância do Sequelize
const sequelize = new Sequelize('Db_App_Psi', 'postgres', '982718', {
  host: 'localhost',
  dialect: 'postgres', // Pode ser 'mysql', 'sqlite', etc.
  port: 8888,
});

// Definindo o modelo de Usuário
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11], // Validação para CPF com 11 caracteres
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validação de formato de e-mail
    },
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Mínimo de 6 caracteres para senha
    },
  },
  tipoUsuario: {
    type: DataTypes.ENUM('paciente', 'psicologo', 'admin'),
    allowNull: false,
  },
}, {
  timestamps: true, // Inclui campos createdAt e updatedAt automaticamente
  tableName: 'usuarios', // Nome da tabela no banco de dados
});

// Definindo o modelo de Diario
const Diario = sequelize.define('Diario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  dataCriacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario, // Atualizado para referenciar o modelo de Usuario
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'diarios',
  timestamps: false,
});

// Definindo o modelo de Consulta
const Consulta = sequelize.define('Consulta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pacienteId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario, // Atualizado para referenciar o modelo de Usuario
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  psicologoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario, // Atualizado para referenciar o modelo de Usuario
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'consultas',
  timestamps: false,
});

// Definindo as associações entre tabelas
Usuario.hasMany(Consulta, { foreignKey: 'psicologoId', as: 'consultas' });
Consulta.belongsTo(Usuario, { foreignKey: 'psicologoId' });
Usuario.hasMany(Diario, { foreignKey: 'usuarioId', as: 'diarios' });
Diario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Sincroniza o modelo com o banco de dados
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Todas as tabelas e associações foram sincronizadas com o banco de dados.');
  })
  .catch(error => {
    console.error('Erro ao sincronizar as tabelas:', error);
  });

// Exportando os modelos e a instância do Sequelize
module.exports = { Usuario, Diario, Consulta, sequelize };
