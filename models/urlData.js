const encoder = require('./encoder.js');

//Object stores full and shortened url in memory
//Constructor

function urlData(fullUrl, port, urlList = []) {
    this.fullUrl = fullUrl;
    let shortUrl = encoder.generateURL(6, port);
    // Ensure uniqueness
    while (urlList.some(url => url.shortUrl === shortUrl)) {
        shortUrl = encoder.generateURL(6, port);
    }
    this.shortUrl = shortUrl;
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