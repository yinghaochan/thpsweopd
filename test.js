// import tests
var chai = require('chai');
chai.use(require('chai-things')).use(require('chai-as-promised'));
var should = chai.should();
var expect = chai.expect;

// import files to test
var generateListing = require('./src/generate');
var generateDB = require('./src/generateDB');
var knex = require('./src/knex');
var queryListings = require('./src/search');


var home;
var DB;
// set the number of listings to generate
var listCount = 100000;

describe('Build database', function() {
  before(function(){
    // generate a listing to test on
    home = generateListing();
    this.timeout(listCount * 100);
    return knex('listings').count('id').then(function(res){
          if(res[0]['count("id")'] === listCount){
            console.log('\n database already generated!');
          } else {
            // throw to .catch function
            throw new Error("DB count does not match listCount");
          }
    }).catch(function(error){
      console.log(error);
      console.log('\n generating ', listCount, ' home listings')
      return generateDB(listCount);
    });
  });
  
  beforeEach(function(){
    // shortcut
    DB = knex('listings');
  });
  
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
    });
  });
  
  describe('search', function() {

    it('should have at least 1% of listings withing 0.1 deg', function() {
      var range = 0.1;
      
      return DB.whereBetween('lat', [home.lat-range, home.lat+range])
              .whereBetween('lon', [home.lon-range, home.lon+range])
              .should.eventually.have.length.above(listCount*0.01); 
    });
    
    it('should have the same dwelling type', function(){
      var homeSpecs = {
        num_bathrooms: home.num_bathrooms,
        num_bedrooms: home.num_bedrooms,
        exterior_stories: home.exterior_stories,
        pool: home.pool
      };
      
      return DB.where(homeSpecs).should.eventually.all.have.property('num_bathrooms', home.num_bathrooms);
    });
    
    
    it('should work with ./src/search.js', function(){
   
      return queryListings(home, 100, 100, 20, 20).then(function(result){
        expect(result).to.all.have.property('num_bathrooms', home.num_bathrooms);
        expect(result).to.all.have.property('num_bedrooms', home.num_bedrooms);
        expect(result).to.all.have.property('pool', home.pool);
        expect(result).to.all.have.property('exterior_stories', home.exterior_stories);
        
        for(var i = 0; i < result.length; i++){
          expect(result[i].list_price).to.be.within(home.list_price*0.8,home.list_price*1.2);
          expect(result[i].living_area).to.be.within(home.living_area*0.8,home.living_area*1.2);
          expect(result[i].lat).to.be.within(home.lat*0.95,home.lat*1.05);
          expect(result[i].lon).to.be.within(home.lon*1.05,home.lon*0.95);
        }
      });
    });
  });
});
