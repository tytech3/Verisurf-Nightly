export default function LoginRequest(email, password) {
  return new Promise(function(resolve, reject) {
    var request = require("request");
    var options = {
      'method': 'POST',
      'url': 'http://localhost:9901/login',
      body: JSON.stringify({ Email: email, Password: password })
    };
    request(options, function(error, response) {
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
        resolve(response.statusCode)
      }
      else{
        reject(statusCode)
      }
    });
  });
}
