const {
    DataTypes
  } = require('sequelize');

  module.exports = sequelize => {
    const attributes = {
      Id:{
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "Id"
      },
     
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "name",
      },
      email:{
        type:DataTypes.STRING(255),
        allownull:false,
        field:"email"
      },
      message:{
        type:DataTypes.STRING(255),
        allownull:false,
        field:"message"
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
      },
    };
    // const options = {
    //   tableName: "refferal",
    //   comment: "",
    //   indexes: [{
    //     name: "userId_idx",
    //     unique: false,
    //     type: "BTREE",
    //     fields: ["userId"]
    //   }]
    // };
    const conatctUsModel = sequelize.define("conatctUs", attributes);
    return conatctUsModel;
  };