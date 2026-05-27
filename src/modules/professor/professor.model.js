import { DataTypes, DATE } from "sequelize";
import sequelize from "../../config/database.js";
import { type } from "happy-dom/lib/PropertySymbol.js";


const Professor = sequelize.define('Professor', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diploma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status_diploma: {
        type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
        defaultValue: 'pendente',
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    professor: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    adm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{
    timestamps: true,
    underscored: true

});

export default Professor;