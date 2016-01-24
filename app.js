var generate_datum = require('./src/generate')

var listings = []
for(var i = 0; i < 4; i++){
  listings.push(generate_datum());  
}

console.log(listings);