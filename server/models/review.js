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
      review: {
        type: DataTypes.STRING,
        field: "review"
      },
      ratingscrore:{type:DataTypes.STRING(255),field: "ratingscrore"} ,

      reviewtitle:{type:DataTypes.STRING(255),field:"reviewtitle"},
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
    const options = {
      tableName: "review",
      comment: "",
      indexes: []
    };
    const reviewModel = sequelize.define("review", attributes, options);
    return reviewModel;
  };
  //item hasmay notes