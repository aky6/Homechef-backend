const Razorpay = require('razorpay');

require('dotenv').config();

var rzPayInstance = new Razorpay({
    key_id: 'rzp_test_WoYRrTjZJHenTY',
    key_secret: '2MKvC6xQkDXGrcmnKFu3P5iX'
  });


module.exports = rzPayInstance;