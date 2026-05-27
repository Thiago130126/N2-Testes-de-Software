// src/models/index.js
import sequelize from '../config/database.js'; // A conexão principal

// 1. Importa todos os modelos
import User from '../modules/user/user.model.js'; // O seu Aluno
import Professor from '../modules/professor/professor.model.js';
import Curso from '../modules/curso/curso.model.js';

Professor.hasMany(Curso, {
    foreignKey: 'professor_id',
    as: 'cursos'
}); 

Curso.belongsTo(Professor, {
    foreignKey: 'professor_id',
    as: 'professor'
});

User.belongsToMany(Curso, {
    through: 'Matriculas',
    foreignKey: 'user_id',
    otherKer: 'curso_id',
    as: 'cursos_matriculados'
});

Curso.belongsToMany(User, {
    through: 'Matriculas',
    foreignKey: 'curso_id',
    otherKer: 'user_id',
    as: 'students'
});

export { sequelize, User, Professor, Curso };