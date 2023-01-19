const chai = require('chai');
const chaiHttp = require('chai-http');
const urlData = require('./models/urlData');
var bodyParser = require('body-parser');
var express = require('express');

chai.should();
chai.use(chaiHttp);
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

let urlObject = new urlData('https://codesubmit.io/library/react',3000);

describe('API Tests:', () => {

    try {
        //Test POST /encode route, encodes a full-length original url
        describe('POST /encode with a valid full-length url', async () => { 
            await it('endpoint /encode returns a encoded url as valid JSON', async () => {
                res = await chai.request('http://localhost:3000')
                    .post('/encode')
                    .type('body')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    //.send({full:'https://codesubmit.io/library/react'})
                    .send({full:urlObject.fullUrl})

                res.should.have.status(201); //Check if the app is running
                res.should.be.json; //Check if the response is json

                res.body.should.have.property('Shortened URL'); //Check if the result json contains the encoded url
                //urlObject.shortUrl = res.body.shortUrl; //Sets the short url for testing to be the one assigned in memory
                await setShort(res.body.shortUrl);
            });
        });

    } catch (error) {
        console.log(error);
    }

    try {
        //Test POST /decode route, decodes a encoded shortened url
        describe('POST /decode with a valid encoded', async () => {
                await urlObject.shortUrl;
                await it('endpoint /decode returns a decoded url as valid JSON', async () => {
                    let res = await chai.request('http://localhost:3000')
                        .post('/decode')  
                        .type('body')
                        .set('Content-Type', 'application/x-www-form-urlencoded')
                        .send({short:urlObject.shortUrl}) //This has to be set in runtime since encoded urls are stored in memory, not a database
                    if(await urlObject.shortUrl != undefined)
                    {
                        //res.should.have.status(201); //Check if the app is running
                        res.should.be.json ; //Check if the response is json
                        res.body.should.have.property('Original URL'); //Check if the result json contains the decoded url 
                    }
                });
            
        });    

    } catch (error) {
        console.log(error);
    }

    try {
        //Test POST /decode route, if an invalid url is requested that is not stored in memory
        describe('POST /decode with an invalid url', () => {
            it('endpoint /decode can handle being sent an invalid url to be decoded', async () => {
                let res = await chai.request('http://localhost:3000')
                    .post('/decode')  
                    .type('form')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .send({"short":"http://localhost:3000/*INVALID_URL*"})
    
                res.should.have.status(404); //Check if the app is running
                res.should.be.json ; //Check if the response is json
            });
        });    
    } catch (error) {
        console.log(error); 
    }
});

function getShort() {
    return res.body.shortUrl;
  } 
function setShort(iShort){
    urlObject.shortUrl = iShort;
}