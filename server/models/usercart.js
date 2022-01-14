const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  const attributes = {
    cartId:{
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "cartId"
    },
    details:{
      type: DataTypes.JSON,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      comment: null,
      field: "details"
    },status:{
      type:DataTypes.STRING(255),
      defaultValue:"Active",
      enum:["Active","completed"],
      field:"status"
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
  const options = {
    tableName: "user_cart",
    comment: "",
    indexes: []
  };
  const UserCourseModel = sequelize.define("user_cart", attributes, options);
  return UserCourseModel;
};
//user hasmany  cart
