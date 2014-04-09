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
