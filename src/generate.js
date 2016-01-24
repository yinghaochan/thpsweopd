var random = require("random-js")();
var normal = require("distributions").Normal

module.exports = function() {
  var DWELLING_TYPES = ['single-family', 'townhouse', 'apartment', 'patio', 'loft'];
  var POOL_TYPES = ['private', 'community', 'none'];
  
  var addDays = function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
  
  var listing =  {
    num_bedrooms: random.integer(1,4),
    num_bathrooms: random.integer(1,4),
    living_area: random.integer(1e3,5e3),
    list_date: random.date(new Date(1999,1,1), new Date(2015,6,1)),
    list_price: random.integer(100e3, 500e3),
    lat: random.integer(33086, 33939) / 1e3,
    lon: random.integer(-112649, -111437) / 1e3,
    exterior_stories: random.integer(1, 3),
    pool: random.sample(POOL_TYPES, 1)[0],
    dwelling_type: random.sample(DWELLING_TYPES, 1)[0],
    is_closed: random.integer(1,10) <= 8
  };
  
  if(listing.is_closed){
    listing.dom = random.integer(7,180);
    listing.list_to_close = normal(0.03, 0.06).variance();
    listing.close_date = addDays(listing.list_date, listing.dom);
    listing.close_price = Math.round(listing.list_price * (1 - listing.list_to_close));
  } else {
    listing.close_date = null;
    listing.close_price = null;
  }
  
  return listing;
}
