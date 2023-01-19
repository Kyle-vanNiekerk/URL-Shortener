# Instructions:
## Step 1: Install Node.js dependencies
Open the project folder and run the command 
```js
npm install
``` 
This will download and intall all the required dependencies necessary to run the app.

## Step 2: Starting the app 
The app can be started through any terminal run inside the project folder (where app.js is located) by running the command 
```js
npm start
``` 
You should then be met with a confirmation that the app has started along with which port it is listening on as well as a link which can be used to access the frontend UI, http://localhost:3000/  by default.
For example:<br>
![App listening on port 3000](/views/src/sc1-start.png "Running the 'npm start' command")<br>
To access the frontend UI, open the link in yor browser

## Step 3: Using the frontend UI
After opening the given link in your browser (http://localhost:3000/ by default) you will be sent to the app's frontend GUI page:<br>
![The GUI, where a url can be encoded or decoded](/views/src/sc2-ui.png "The GUI page")<br>

### Encoding a URL:
Any URL can simply be entered in the "Encode a full-length URL" field, this input box will only accept a valid URL, not null or string values in other formats, this is validated when clicking the respective submit buttons next to each input field, for example:<br>
![Entering a URL to be encoded](/views/src/sc3-encode1.png "Encoding an example URL")<br>
When the "Shorten URL" submit button is clicked the url will be encoded at the app's /encode endpoint at http://localhost:3000/encode and the resulting encoded url will be returned as a JSON object:<br>
![Encoded URL](/views/src/sc4-encoded.png "Encoded URL")<br>
This is also logged in the app's terminal:<br>
![Terminal confirmation](/views/src/sc5-terminal.png "Terminal shows URL data")<br>
This shows how many URLs have been encoded and displays both the original and encoded versions as they are stored in memory.
The original website can now be accessed through the encoded URL as well as the original through your browser.<br>
For convenience and better visualization, every URL as well as its encoded version is displaid in the GUI frontend in a table after at least one URL has been successfully encoded as hyperlinks, allowing the user to see end test the results for themselves, both encoded and original URLs will take the user to the website of the original full-length URL. This table will grow with every new encoded url automatically.<br>
![Entering a URL to be decoded](/views/src/sc9-table.png "Encoded URL")<br>

### Decoding a URL:
When returning to the GUI page at http://localhost:3000/ you will now be able to decode the newly encoded url, as it now exits in memory and is associated with it's original full length URL.
![Entering a URL to be decoded](/views/src/sc6-decode.png "URL to be decoded")<br>
This will return the original full url as a JSON when the "Get full URL" button is clicked from the /decode endpoint at http://localhost:3000/decode.<br>
![Decoded URL](/views/src/sc7-decoded.png "Decoded URL")<br>
This is also accompanied with a confirmation of the successful decoding of the encoded url.<br>
![Terminal Confirmation](/views/src/sc8-terminal.png "Terminal with URL data")<br>

# API Testing:
It is important to note that API testing can only take place after an instance of the app is already running.
## API Test via Postman
### Testing the /encode endpoint:
A `POST` request is made to the /encode endpoint containing a full-length URL<br>
![Postman POST request](/views/src/sc10-pm1.png "Postman POST request")<br>
This returns the newly encoded version of the given url as a JSON <br>
![Returned JSON](/views/src/sc10-pm2.png "Returned encoded JSON")<br>
### Testing the /decode endpoint:
A `POST` request is made to the /decode endpoint containing an encoded URL<br>
![Postman POST request](/views/src/sc11-pm1.png "Postman POST request")<br>
This returns the decoded original version of the given url as a JSON <br>
![Returned JSON](/views/src/sc11-pm2.png "Returned decoded JSON")<br>

A `POST` request is made to the /decode endpoint containing an invalid URL, this should return a 404 status along with a JSON object containing an error message<br>
![Postman POST request](/views/src/sc12-pm1.png "Postman POST request")<br>
This returns a 404 status along with a JSON object containing an error message <br>
![Returned JSON](/views/src/sc12-pm2.png "Returned decoded JSON")<br>

## API Test via Mocha
An automated version of the above tests can also be run through the terminal using Mocha, this can be done by running the following command in the main project file where app.js is located:
```js
npm test
```
This will return the following results in the terminal:<br>
![Mocha API test results](/views/src/sc13-mocha.png "Mocha API test results")<br>
This tests the result status (201 if everything is returned correctly, 404 if a request for an invalid URL is made), verifies that valid JSON objects are returned from both /encode and /decode endpoints and that they contain the correct URL information, such as the correct shortened or full-length URL

## Test Case:
| Test Case ID | Description                                                                                                             | Test Data                                    | Expected Result                                        | Actual Result                                          | Pass/Fail |
|--------------|-------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|--------------------------------------------------------|--------------------------------------------------------|-----------|
| TC1          | 1. Go to http://localhost:3000<br>2. Enter a URL to be encoded<br>3. Click the "Shorten URL" button                     | {full:"https://codesubmit.io/library/react"} | {"Shotened URL: http://localhost:3000/stC241"}         | {"Shotened URL: http://localhost:3000/stC241"}         | Pass      |
| TC2          | 1. Go to http://localhost:3000<br>2. Enter a shortened URL to be decoded<br>3. Click the "Get full URL" button          | {short:"http://localhost:3000/stC241"}       | {"Original URL":"https://codesubmit.io/library/react"} | {"Original URL":"https://codesubmit.io/library/react"} | Pass      |
| TC3          | 1. Go to http://localhost:3000<br>2. Enter an invalid shortened URL to be decoded<br>3. Click the "Get full URL" button | {short:"http://localhost:3000/*invalid*"}    | {"Original URL": "404 not found"}                      | {"Original URL": "404 not found"}                      | Pass      |