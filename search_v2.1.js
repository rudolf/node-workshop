// file: search_v2.1.js
async = require('async')
request = require('superagent')

searches = ['1. Node.js', '2. Express', '3. Underscore', '4. Async', '5. CoffeeScript']

search = function(keywords, callback) {
  query = keywords.split(' ').join('+')
  url = 'http://www.google.com/search?q='+query
  request.get(url, function(res){
    console.log('Received results for: ', keywords)
    callback()
  });
}

async.eachSeries(searches, search, function(err, result) {
  err && console.log('oops! ', err)
  console.log('done searching')
})

