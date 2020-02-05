export default function HttpRequest(path){


    return  new Promise(function(resolve, reject){
    const http = require('http');
    var x = ''

    console.log('beginning get.')

    http.get({
        hostname: 'nightlyrestapi.herokuapp.com',
        path: path,
        agent: false
    }, (res) => {
        res.on('data', function(chunk){            
            x += chunk
        })
        res.on('end', () => {
            resolve(x)
        })
    })
    }
    )
}
