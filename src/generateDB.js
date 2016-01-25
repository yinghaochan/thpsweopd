var fs = require('fs');
var generate_datum = require('./generate')
var knex = require('./knex');
    
var generateDB = function(number){    
  return knex.schema.dropTableIfExists('listings').
  createTableIfNotExists('listings', function(table) {
    table.increments('id');
    table.integer('num_bedrooms');
    table.integer('num_bathrooms');
    table.integer('living_area');
    table.dateTime('list_date');
    table.integer('list_price');
    table.float('lat');
    table.float('lon');
    table.integer('exterior_stories');
    table.string('pool');
    table.string('dwelling_type');
    table.boolean('is_closed');
    table.integer('dom');
    table.float('list_to_close');
    table.dateTime('close_date');
    table.integer('close_price');
  }).then(function(){
    for(var i = 0; i < number; i += 50){
      var listing = [];
      for(var j = 0; j < 50; j++){
        listing.push(generate_datum());
      }
      knex('listings').insert(listing).then();
    }

  }).then(function(){
    return knex('listings').count('id').then(function(res){
          console.log('added: ', res[0]['count("id")'], 'listings');
    });
  });
};

module.exports = generateDB;
