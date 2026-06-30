import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    data_nascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    adm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    professor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},
{
    timestamps: true,
    underscored: true

});

export default User;