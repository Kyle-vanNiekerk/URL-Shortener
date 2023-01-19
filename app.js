const express = require('express');
const bodyparser = require('body-parser');
const urlData = require('./models/urlData.js');
require('dotenv').config();
const URL = require('url').URL;

//Global variable:
var urlList = []; //A list which will hold all URL data in memory

const app = express();

//Gets specified port from .env or uses a default port if
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`To access the frontend UI, open http://localhost:${port}/ in yor browser`);
});

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({extended: false}));
app.use(bodyparser.urlencoded({extended: true}));

//Validate whether an input is a valid URL
function urlCheck(myURL) {  //takes too long, causes timeout during testing
    try {
      new URL(myURL);
      return true;
    } catch (err) {
      return false;
    }
};

//Landing Page
app.get('/', (req, res) => {
    res.render('index.ejs', {urlList:urlList});
    //res.status(201).send({urlList:urlList});
});

//Encode a URL, adds it to a list containing both encoded and decoded versions of it
app.post('/encode', async (req, res) => {
    const long = await new urlData(req.body.full, port, urlList);

 /*   if(urlCheck(long))
    {
*/
        urlList.push(long);

        res.status(201).send({
            'Shortened URL': long.shortUrl
        });
    
        let counter = urlList.length;
        console.log(`Encoded URL ${counter}: (${long.fullUrl}) --> (${long.shortUrl})`); //Feedback for server terminal, url successfully encoded and stored in memory
/*    }
    else
    console.log(`${long} is not a valid URL`);
*/


});

//Find the original URL using the encoded version of it
app.post('/decode', async (req, res) => {
    let found = '';
    let counter = 0;
    let short = await req.body.short;

    urlList.forEach(url => {
        counter++;
        if(url.shortUrl == short)
        {
            found = url.fullUrl;
            console.log(`Decoded URL ${counter}: (${short}) --> (${url.fullUrl})`); //Feedback for server terminal encoded url found and successfully decoded

            res.status(201).send({
                'Original URL': url.fullUrl
            });
        }
    });

    if(found == '')
    {
        res.status(404).send({
            'Original URL': '404 not found'
        })
        console.log(`URL: (${short}) is not stored in memory`); //Feedback for server terminal, no matching encoded exists
    }
});

//Use the shortened URL to actually reach the original URL
app.get('/:urlData', async (req, res) => {
    let snippet = await req.url.split("/").pop();
    let found =false;
        urlList.forEach(url => {
            if(url.shortUrl.split("/").pop() == snippet)
            {
                res.redirect(url.fullUrl);
                found = true;
            }
        });
    
        if(found == false)
        {
            return res.sendStatus(404);
        }
});