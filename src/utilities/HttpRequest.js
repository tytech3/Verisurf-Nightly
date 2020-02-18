export default function HttpRequest(path) {
    return new Promise(function(resolve, reject) {
      var request = require('request');
      var options = {
      'method': 'GET',
      'url': 'http://localhost:9901'+path
    };
    request(options, function (error, response) { 
      if(error){
        console.log(error)
        reject(error)
      }
      var statusCode
      try{
        statusCode = response.statusCode
      }
      catch(error){
        statusCode = null
      }
      if(statusCode == 200){
        resolve(response.body)
      }
      else{
        reject(statusCode)
      }
    });
  })

}
