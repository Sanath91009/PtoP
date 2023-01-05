const mongoose = require('mongoose');

// Connection URL
const url = process.env.MONGODB_URL;


async function main() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(url);
  console.log('Connected successfully to server');
  return 'done.';
}

modules.exports = main;
