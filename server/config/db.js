'use strict';

//  this file is for instance of
const Sequelize = require('sequelize');


// Option 1: Passing parameters separately
const sequelize = new Sequelize(
  'u653377379_testChefmade',
  'u653377379_chefmade',
  'Qwertyuiop@123',
  {
    host: 'sql504.main-hosting.eu',
    dialect: 'mysql',
    pool: {
      max: 5000000000000,
      min: 0,
      acquire: 300000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  }
);
// new model are listed here so that they can be frmed in database
const vendor = require('../models/vendor.js')(sequelize, Sequelize);
const image = require('../models/image.js')(sequelize, Sequelize);
const payment = require('../models/payment.js')(sequelize, Sequelize);
const usercart = require('../models/usercart.js')(sequelize, Sequelize);
//  const notes = require('../models/notes.js')(sequelize, Sequelize);
const users = require('../models/users.js')(sequelize, Sequelize);
const DeliveryPartner = require('../models/DeliveryPartner.js')(sequelize, Sequelize);
const item = require('../models/item.js')(sequelize, Sequelize);
const orderlist = require('../models/orderlist.js')(sequelize, Sequelize);
const location = require('../models/location.js')(sequelize, Sequelize);
const subcategoryname = require('../models/subcategoryname.js')(sequelize, Sequelize);
const customization = require('../models/customization.js')(sequelize, Sequelize)
const review = require('../models/review.js')(sequelize, Sequelize);
const Dashboard = require("../models/Dashboard.js")(sequelize, Sequelize);
const Admin = require("../models/admin.js")(sequelize, Sequelize);
const Invoice = require("../models/invoice.js")(sequelize, Sequelize);
const conatctUs = require("../models/contactus")(sequelize, Sequelize);
const categoryname = require("../models/categoryname")(sequelize, Sequelize);
const subcat = require("../models/subcat")(sequelize, Sequelize)
// Models relations are listed here

item.hasMany(image);
item.hasMany(subcategoryname);
subcategoryname.belongsTo(item);
categoryname.hasMany(subcat);
item.hasMany(customization);
customization.belongsTo(item);
item.hasMany(usercart);
vendor.hasMany(orderlist);
vendor.hasMany(Dashboard);
Dashboard.belongsTo(vendor);
item.hasMany(Dashboard);
Dashboard.belongsTo(item);
orderlist.belongsTo(vendor);
users.hasMany(orderlist);
orderlist.belongsTo(users);
vendor.hasOne(DeliveryPartner);
orderlist.hasMany(payment);
orderlist.hasOne(location);
DeliveryPartner.belongsTo(orderlist);
users.hasMany(usercart);
users.hasMany(image);
users.hasMany(review);
item.hasMany(review);
item.hasMany(image);
vendor.hasMany(review);
review.belongsTo(vendor);
review.belongsTo(users);
vendor.hasMany(Invoice);
Invoice.belongsTo(vendor);
users.hasMany(item);
users.hasMany(location);
vendor.hasMany(item);
item.belongsTo(vendor);



sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// sequelize.sync({ alter: true }); 
// sequelize.sync({ force: true })
//  if change anything in model then please uncomment the below line


module.exports = {

  subcat, categoryname, conatctUs, Invoice, Admin, sequelize, Dashboard, DeliveryPartner, item, image, location, orderlist, payment, subcategoryname, usercart, users, vendor, customization, review
};
