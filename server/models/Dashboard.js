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
      itemname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "itemname",
      },
      itemquantity:{
        type:DataTypes.STRING(255),
        allownull:false,
        field:"itemquantity"
      },
      price:{
        type:DataTypes.STRING(255),
        allownull:false,
        field:"price"
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
    const DashboardModel = sequelize.define("Dashboard", attributes);
    return DashboardModel;
  };