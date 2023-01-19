const encoder = require('./encoder.js');

//Object stores full and shortened url in memory
//Constructor
function urlData(fullUrl, port, urlList = [], shortUrl = encoder.generateURL(6, port)){
    this.fullUrl = fullUrl;
    this.shortUrl = shortUrl;
    let duplicate = false;

    //Make sure that the newly encoded shortened url is unique
    while (duplicate == false)
    {
        urlList.forEach(url => {
            if(url.shortUrl == this.shortUrl)
            duplicate = true;
        });

        if(duplicate == true)
            this.shortUrl =  encoder.generateURL(6, port);
        else
            break;
    }
}

/*
//This is better suited for use with MongoDB as a schema
var urlData = { 
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        default: encoder.generateURL(6)
    }
}
*/

module.exports = urlData;