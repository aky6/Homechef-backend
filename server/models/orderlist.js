const { DataTypes } = require('sequelize');
const JsonField = require('sequelize-json');
// const model=require("./subject");
// const relation = require('../../relation');
module.exports = (sequelize) => {
  const attributes = {
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: 'Id'
    },
    rzPayOrderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'rzPayOrderId'
    },
    buyername:{
      type:DataTypes.STRING(255),
        field:"buyername"
    },
    itemList:{
      type:DataTypes.JSON,
      field:"itemList"
    },
    TotalPrice:{
      type:DataTypes.STRING(255),
      field:"TotalPrice",
    },
    address:{
      type:DataTypes.JSON,
      field:"address"
    },
    orderStatus:{
      type:DataTypes.STRING(255),
      defaultValue:'orderPlaced',
      enum:['PaymentConfirmed,PaymentDue,DeliveredtoCustomer,PlacedtoDeleiveryPartner,ConfirmedByDeliverypartner','AcceptedByChef','RejectedBychef','orderPlaced','cookingcompleted']
    },
    OrderType:{
      type:DataTypes.STRING(255),
      defaultValue:'PreOrder',
      enum:['PredOrder','sameday']
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
  const orderlist = sequelize.define('orderlist', attributes);
  return orderlist;
};
//user has many orderlist//
//