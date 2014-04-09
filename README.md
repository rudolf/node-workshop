node-workshop
=============

Intro to Node.js workshop at ScaleConf 2014

## 1. Hello world

Create a file called hello.js with the following content:

```javascript
// file: hello.js
console.log('hello world')
```

Then execute it follows in your shell:


```bash
node hello.js
```

## 2. Asynchronous vs. Synchronous IO

### Synchronous server architectures

How does a synchronous server work? Let's start with a naive single threaded server written in psuedo code:

```c
// file: single_threaded_server.psuedo

while(true) {

  // Blocking listen on some port for a request
  listen(localhost:8080)

  // Accept the connection request
  request = accept()

  // Do some work:
  // Ask google for 'the answer to life the universe and everything'
  sleep(1000) // Even google needs a second to figure this one out
  
  request.send("The answer is 42!")
  request.close()
}
```
What's the theoretical performance in requests per second?

How can we improve on this design? Create a process to handle each incoming request!
```c
// file: threaded_server.psuedo

while(true) {

  // Blocking listen for incoming requests
  listen('localhost', 8080)

  // Accept the connection request
  request = accept()

  // Create a new process to service the request (optionally from a
  // thread pool)
  fork(){
    // Do some work:
    // Ask google for 'the answer to life the universe and everything'
    sleep(1000) // Even google needs a second to figure this one out

    request.send("The answer is 42!")
    request.close()

    // Our work here is done, stop the process
    exit(0)
  }
}
```

### Node.js server architecture

Create a single threaded Node.js server:
```javascript
// file: single_threaded_node.js

var http = require("http");  

// HTTP request handler, called for every request
onRequest = function(request,response){
  
  respond = function() {
    // Once we've got the result, return it
    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.write("The answer is 42!");  
    response.end();
  }
  
  // Do some work:
  // Ask google for 'the answer to life the universe and everything'
  setTimeout(respond, 1000) // Even google needs a second to figure this one out
}

http.createServer(onRequest).listen(3000);  

console.log("Server Running on port 3000");
```

Time for some performance testing! Install a Node.js-based benchmark tool and run it against our server:
```bash
# Install nperf
npm install http-perf

# Start our server
node single_threaded_node.js &

# Benchmark it with 300 concurrent requests
./node_modules/.bin/nperf -c 300 -n 300 http://localhost:3000
```

The sky's the limit, or is it?

```javascript
// file: single_threaded_blocking_node.js

var http = require("http");  

// HTTP request handler, called for every request
onRequest = function(request,response){
  
  respond = function(answer) {
    // Once we've got the result, return it
    response.writeHeader(200, {'Content-Type': 'text/plain'});
    response.write('The answer is ' + answer + '!');  
    response.end();
  }
  
  // Do some work: find 'the answer to life the universe and everything'
  // Who needs google, buckle-up we've got this...
  var answer = 0
  while(answer < 1000000000){answer++}
  answer = answer - answer + 42;
  respond(answer)
}

http.createServer(onRequest).listen(3000);  

console.log("Server Running on port 3000");
```

The proof is in the pudding:
```bash
# Benchmark it with 10 concurrent requests
./node_modules/.bin/nperf -c 10 -n 10 http://localhost:3000
```

### Async in practice
```
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
```

```
// file: search_v2.0.js
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

var i = 0;
search(searches[i++], function() {
  search(searches[i++], function(){
    search(searches[i++], function() {
      search(searches[i++], function() {
        search(searches[i++], function() {
          console.log('done searching')
        })
      })
    })
  })
})

```

Let's try again...
```
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
```
