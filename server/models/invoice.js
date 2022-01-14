const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const attributes = {
    //  1 = student ,2= admin ,3= creator,4=uploader,5= accountant

   customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.STRING,
      
      autoIncrement: false,
      comment: null,
      field: "customerName"
    },
    invoiceNumber:{
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
 field:'invoiceNumber'
    },
    invoice_date: {
      type: DataTypes.DATE,
    
      field: 'invoice_date',
    },
    due_date: {
      type: DataTypes.DATE,
     
      field: 'due_date',
    },
    amount: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'amount',
    }, 
    
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'orderId',
    },
    type:{
      type: DataTypes.STRING(255),
      allowNull: true,
      
      enum:["vendor",'customer'],
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: 'type',
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
    
  };

  const InvoiceModel = sequelize.define('Invoice', attributes);

  return InvoiceModel;
};
