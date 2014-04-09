// file: search_v1.js
request = require('superagent')

searches = ['1. Node.js', '2. Express', '3. Underscore', '4. Async', '5. CoffeeScript']

search = function(keywords) {
  query = keywords.split(' ').join('+')
  url = 'http://www.google.com/search?q='+query
  request.get(url, function(res){
    console.log('Received results for: ', keywords)
  });
}

searches.forEach(search)

console.log('done searching')
