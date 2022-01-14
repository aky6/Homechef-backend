const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const attributes = {
    //  1 = student ,2= admin ,3= creator,4=uploader,5= accountant
    roles: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'enduser',
      enum: ['enduser', 'admin', 'Chef', 'uploader', 'accountant'],
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'user_type',
    },userId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "userId"
    },
    email_Id: {
      type: DataTypes.STRING(245),
      allowNull: false,
      
      isEmail: { msg: 'not a valid email' },
      unique: {
        args: true,
        msg: 'email ad already in use!',
      },
      autoIncrement: false,
      comment: null,
      field: 'email_Id',
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'firstname',
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'lastname',
    }, mobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'mobileNumber',
    },
    user_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'user_desc',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'password',
    },
    imagePath:{
      type:DataTypes.STRING(255),
      field:"imagePath"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'updated_at',
    },
    signup_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'signup_type',
    },created_at: {
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
    }, lat:{
      type:DataTypes.DECIMAL(16,14),
      field:'lat'
    }, long:{
      type:DataTypes.DECIMAL(16,14),
      field:'long'
    }, Address:{
      type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: 'Address',
      }
  };
  const options = {
    tableName: 'users',
    comment: '',
    indexes: [],
  };
  const UsersModel = sequelize.define('users', attributes, options);

  return UsersModel;
};
