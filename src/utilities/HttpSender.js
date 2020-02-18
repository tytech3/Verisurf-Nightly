export default function HttpPOST(token, email){
    const request = require('request')

    request.post('https://nightlyrestapi.herokuapp.com/register', {
        json:{
            email: email,
            code: token
        }
    }, (error, res, body) => {
        if(error){
            return false
        }
        console.log("status code: " + res.statusCode)
        return true
    })
}