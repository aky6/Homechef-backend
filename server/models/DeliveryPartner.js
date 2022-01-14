const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    DeliveryId:{
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "Id"
    },
    DeliveryPartner: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "DeliveryPartner",
    },
    DeliveryRefId:{
      type:DataTypes.STRING(255),
      allownull:true,
    },
    cost:{
      type:DataTypes.STRING(255),
      field:"DeliveryCost",
    },
    partnerStatus:{
      type:DataTypes.STRING(255),
      field:"PartnerStatus",
    },    
    location:{
      type:DataTypes.JSON,
      field:"Location"
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
  const RefferalModel = sequelize.define("DeliveryPartner", attributes);
  return RefferalModel;
};
//orderlist hasone deliveryPartner