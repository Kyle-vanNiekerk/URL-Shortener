//Used to generate unique ID's randomly from a set of characters, which is used to create a shortened url
function generateURL(urlLength, port = 3000){
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    var randomString = '';

    for(var i=0; i<urlLength; i++)
    {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    //result = `http://short.est/${randomString}`; //Output similar to example
    result = `http://localhost:${port}/${randomString}`; //Output better for testing
    return result;
}

module.exports = {generateURL};
