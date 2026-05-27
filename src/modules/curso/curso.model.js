import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { type } from "happy-dom/lib/PropertySymbol.js";

const Curso = sequelize.define('Curso', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    qtde_aulas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    materia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    timestamps: true,
    underscored: true

});

export default Curso;