const authRoutes = require('./routers/auth');
// const orderRoutes = require('./routes/order');
// const paymentRoutes = require('./routes/payment');
 const usercartRoutes = require('./routers/usercart');
const itemRoutes = require('./routers/item');
const deliveryRoutes = require('./routers/delivery');
// const notesRoutes = require('./routes/notes');
// const subcategoryRoutes = require('./routes/subcategory');


// Add access to the app and db objects to each route

function authrouter(app, db) {
  return authRoutes(app, db);
}
function orderrouter(app, db) {
  return orderRoutes(app, db);
}

function paymentrouter(app, db) {
  return paymentRoutes(app, db);
}

function usercartrouter(app, db) {
  return usercartRoutes(app, db);
}

function itemrouter(app, db) {
  return itemRoutes(app, db);
}
function notesrouter(app, db) {
  return notesRoutes(app, db);
}

function subcategoryrouter(app, db) {
  return subcategoryRoutes(app, db);
}

function testrouter(app, db) {
  return testRoutes(app, db);
}

function topicrouter(app, db) {
  return topicRoutes(app, db);
}
function chapterrouter(app, db) {
  return chapterRoutes(app, db);
}

function deliveryrouter(app, db){
  return deliveryRoutes(app,db);
}

module.exports = {
  authrouter,
  // orderrouter,
  // paymentrouter,
   usercartrouter,
   itemrouter,
   deliveryrouter
  // notesrouter,
  // notesrouter,
  // subcategoryrouter,
  
 
};