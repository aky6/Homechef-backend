const {
    DataTypes
  } = require('sequelize');
  
  
  module.exports = sequelize => {
    const attributes = {
      notesId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false,
        comment: null,
        field: "vnotesId"
      },
      notesPath: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        unique:true,
        autoIncrement: false,
        comment: null,
        field: "notesPath"
      },
      // orderlist:{
      //    type:DataTypes.INTEGER(11),
      //    autoIncrement:true
      // },
    
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
    // const options = {
    //   tableName: "notes",
    //   comment: "",
    //   indexes: []
    // };
    const notesModel = sequelize.define("notes", attributes);
    return notesModel;
  };
  //item hasmay notes