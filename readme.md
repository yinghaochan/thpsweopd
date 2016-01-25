## Getting similar houses
1. run `npm install`
1. run `npm test`
  - this auto populates the database with `listCount = 70,000` listings. Feel free to change that.
1. `app.js` has an example of using the query

## Persisting data
It's stored in an sqlite3 database. 

## Further optimization
Storing any information on hard drives is slow. 
Several optimizations would be:
- use a memory cache for a subset of data
- pagination

### Testing with in-memory storage
Tested several situations for 10x - 20x increases in listings
```js
// in src/knex.js
module.exports = require('knex')({
  dialect: 'sqlite3',
  connection: { filename: ':memory:'}
});
```

Achieved about twice the query speed (49ms) for a listing size of 200,000 compared to SSD (83ms).
Achieved about 10x faster bulk writes.

Read performance was not dramatically increased, simply using a faster SSD could probably achieve the same performance. Sqlite is probably not optimized for memory storage.

### Optimization for 100x++
- Have multiple databases for each large city / area
- Have a search that only shows result from trailing 12 months, which limits database size. 
- Annual sales in a city like Manhattan is <100k, so this should work for even the largest cities.


### Notes
- Re-wrote generate_data in js
- Writing the solution took about 3 hrs
- Actually testing 10x optimization performance was done out of interest

