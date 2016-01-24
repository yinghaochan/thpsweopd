var chai = require('chai');
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);
var should = chai.should();
var assert = chai.assert;

var generateDB = require('./src/generateDB');
var knex = require('knex')({
  dialect: 'sqlite3',
  connection: { filename: './db/data.db'}
});


var DB;
var listCount = 1000;

describe('Build database', function() {
  before(function(){
    this.timeout(listCount * 100)
    return knex('listings').count('id').then(function(res){
          if(res[0]['count("id")'] < listCount){
            return generateDB(listCount);
          } else {
            console.log('database already generated!')
          }
    });
  });
  
  beforeEach(function(){
    DB = knex('listings');
  })
  
  describe('Listings', function () {
    it('should have the necessary number of listings', function () {
      return DB.count('id').should.eventually.include({'count("id")': listCount});
    });
    
    it('should have the right keys', function(){
    var keys = [
    'num_bedrooms',
    'num_bathrooms',
    'living_area',
    'list_date',
    'list_price',
    'lat',
    'lon',
    'exterior_stories',
    'pool',
    'dwelling_type',
    'is_closed',
    'close_date',
    'close_price'
    ];
    
      return DB.first().should.eventually.include.keys(keys);
    })
  });
  
  
  
  
});