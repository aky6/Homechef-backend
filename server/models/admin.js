const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const attributes = {
    //  1 = student ,2= admin ,3= creator,4=uploader,5= accountant
    roles: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'admin',
      enum: ['enduser', 'admin', 'Vendor'],
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'user_type',
    },vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "adminId"
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
    imagePath:{
        type:DataTypes.STRING(255),
        field:"imagePath"
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
    },
    Address:{
    type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'Address',
    }, state:{
      type:DataTypes.STRING(255),
      allowNull:true,
      field:"state"
    }, 
    city:{
      type:DataTypes.STRING(255),
      allowNull:true,
      field:"city"
    },  zip:{
      type:DataTypes.STRING(255),
      allowNull:true,
      field:"zip"
    },
    status:{
      type:DataTypes.STRING(255),
      enum:['Active','INActive']
    }, accountstatus:{
      type:DataTypes.STRING(255),
      defaultValue:'Active',
      enum:['Active','INActive']
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

  const AdminModel = sequelize.define('Admin', attributes);

  return AdminModel;
};
