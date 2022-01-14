const {
    DataTypes
} = require('sequelize');
// const db = require('../db');
// const relation = require('../relation');
module.exports = sequelize => {
    const attributes = {
        Id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: false,
            comment: null,
            field: "Id"
        },

        Name: {
            type: DataTypes.STRING(255),
            allowNull: false,

        },
        Price: {
            type: DataTypes.STRING(255),
        },


        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "created_at"
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.fn('current_timestamp'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "updated_at"
        }
    };

    const customizationModel = sequelize.define("customization", attributes);
    return customizationModel;
};