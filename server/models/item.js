const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "itemId"
    },
    itemname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,

      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "itemname"
    },
    unit: {
      type: DataTypes.STRING(255),
      allownull: false,
      defaultValue: '1',
      field: "unit"
    },
    price: {
      type: DataTypes.STRING(255),
      field: "price"
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'food',

      field: "category"
    }, isVeg: {
      type: DataTypes.STRING,
      defaultValue: "Yes",
      enum: ["Yes", "No"],
      field: "isVeg"
    }, quantity: {
      type: DataTypes.STRING,
      field: "quantity"
    },
    ingredients: {
      type: DataTypes.JSON,
      field: "ingredients"
    }, desc: {
      type: DataTypes.STRING(255),
      field: "desc"
    }, size: {
      type: DataTypes.JSON,
      field: "size"
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
    keyword: {
      type: DataTypes.STRING(255),
      field: "keyword"
    },
    imagePath: {
      type: DataTypes.STRING(255),
      field: "imagePath"
    }, availabel_from: {
      type: DataTypes.STRING,
      field: "availabel_from"
    }, availabel_to: {
      type: DataTypes.STRING,
      field: "availabel_to"
    }, dateofservice: {
      type: DataTypes.STRING,
      field: "dateofservice"
    },
    inStock: {
      type: DataTypes.STRING(255),
      field: "inStock"
    }, cooking_time: {
      type: DataTypes.STRING(255),
      field: "cooking_time"
    }

  };
  const options = {
    tableName: "item",
    comment: "",
    indexes: []
  };
  const itemModel = sequelize.define("item", attributes, options);
  return itemModel;
};