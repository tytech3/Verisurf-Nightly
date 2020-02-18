export default function PostRequest(uri, body) {
    return new Promise(function(resolve, reject) {
        console.log("Body in post: " + body)
      var request = require("request");
      var options = {
        method: "POST",
        url: "http://localhost:9901/"+uri,
        body: body
      };
      request(options, function(error, response) {
        if(error){
          reject(response.statusCode)
        }
        else{
          if(response.statusCode == 200){
            resolve(response.statusCode)
          }
          else{
            reject(response.statusCode)
          }
        }
      });
    });
  }
  