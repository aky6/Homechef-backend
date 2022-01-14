const {
  DataTypes
} = require('sequelize');


module.exports = sequelize => {
  const attributes = {
    Id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "topicId"
    },
    long: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "long"
    },
  
   lat: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:"test",
       primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "lat"
    },
    address:{
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:"test",
       primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "address"
    },
       city:{
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:"test",
         primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "city"
       },
       zip:{
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:"test",
         primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "Zip"
       },
       state:{
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue:"test",
         primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: "state"
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
  
  const location = sequelize.define("location", attributes);
  return location;
};
/* user has many location;*/