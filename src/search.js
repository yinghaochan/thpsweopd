var knex = require('./knex');
/*
   returns a promise of search results
   @param    {obj}   house  Home object with the desired attributes
   @param    {n}     int    number of results to return
   @param    {dist}  int    distance in miles for search
   @param    {?Range}int    Range in %
   @return   {promise}       array of results
   @property {Number}        blahblah   desc3
*/
var queryListings = function(house, n, dist, sizeRange, priceRange){
  // each degree is approximately 60 miles
  var houseSpecs = {};
  for(var i in house){
    switch(i){
      case 'num_bedrooms':
      case 'num_bathrooms':
      case 'exterior_stories':
      case 'pool':
      case 'dwelling_type':
      case 'is_closed':
        houseSpecs[i] = house[i];
    };
  }
  
  priceRange = Math.round(house.list_price*(priceRange/100));
  sizeRange = Math.round(house.living_area*(sizeRange/100));
  var searchRadius = dist / 60 / 2;
  
  return knex('listings')
        .whereBetween('lat', [house.lat-searchRadius, house.lat+searchRadius])
        .whereBetween('lon', [house.lon-searchRadius, house.lon+searchRadius])
        .whereBetween('list_price', [house.list_price-priceRange, house.list_price+priceRange])
        .whereBetween('living_area', [house.living_area-sizeRange, house.living_area+sizeRange])
        .where(houseSpecs)
        .limit(n)
}

module.exports = queryListings;