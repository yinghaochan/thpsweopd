var house = require('./src/generate')();
var queryListings = require('./src/search');

/*
   returns a promise of search results
   @param    {obj}   house  Home object with the desired attributes
   @param    {n}     int    number of results to return
   @param    {dist}  int    distance in miles for search
   @param    {?Range}int    Range in %
   @return   {promise}       array of results
   @property {Number}        blahblah   desc3
*/

queryListings(house, 100, 100, 20, 20).then(function(res){
  // log a search result!
  console.log(res);
})
