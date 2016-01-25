module.exports = require('knex')({
  dialect: 'sqlite3',
  connection: { filename: './data.db'}
});
