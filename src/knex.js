module.exports = require('knex')({
  dialect: 'sqlite3',
  connection: { filename: './db/data.db'}
});