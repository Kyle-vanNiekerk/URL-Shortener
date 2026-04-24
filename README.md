# URL Shortener

A simple Node.js REST API and web UI for shortening URLs. Demonstrates REST API design, Express.js, and basic frontend integration.

## Features
- Shorten (encode) any valid URL to a short link
- Decode a short link back to the original URL
- Simple web interface (EJS + Bootstrap)
- In-memory storage (no database required)
- REST API for programmatic access

## Getting Started

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
To access the frontend UI, open the link in your browser.

## Step 3: Using the frontend UI

After opening the given link in your browser (http://localhost:3000/ by default) you will be sent to the app's frontend GUI page.

### Encoding a URL:

Any URL can simply be entered in the "Encode a full-length URL" field. This input box will only accept a valid URL, not null or string values in other formats. This is validated when clicking the respective submit buttons next to each input field. When the "Shorten URL" submit button is clicked, the URL will be encoded at the app's /encode endpoint at http://localhost:3000/encode and the resulting encoded URL will be returned as a JSON object. This is also logged in the app's terminal. This shows how many URLs have been encoded and displays both the original and encoded versions as they are stored in memory. The original website can now be accessed through the encoded URL as well as the original through your browser. For convenience and better visualization, every URL as well as its encoded version is displayed in the GUI frontend in a table after at least one URL has been successfully encoded as hyperlinks, allowing the user to see and test the results for themselves. Both encoded and original URLs will take the user to the website of the original full-length URL. This table will grow with every new encoded URL automatically.

### Decoding a URL:

When returning to the GUI page at http://localhost:3000/ you will now be able to decode the newly encoded URL, as it now exists in memory and is associated with its original full-length URL. This will return the original full URL as a JSON when the "Get full URL" button is clicked from the /decode endpoint at http://localhost:3000/decode. This is also accompanied with a confirmation of the successful decoding of the encoded URL.

# API Testing:
# API Testing:
It is important to note that API testing can only take place after an instance of the app is already running.

## API Usage and Examples

The API exposes two main endpoints for encoding and decoding URLs. You can interact with these endpoints using tools like [Postman](https://www.postman.com/) or `curl`.

### 1. Encode a URL

**Endpoint:** `POST /encode`

**Body (x-www-form-urlencoded):**
```
full=https://example.com
```

**Example using Postman:**
1. Set method to `POST` and URL to `http://localhost:3000/encode`
2. In the Body tab, select `x-www-form-urlencoded`
3. Add a key `full` with value `https://example.com`
4. Click Send

**Response:**
```
{
	"Shortened URL": "http://localhost:3000/abc123"
}
```

### 2. Decode a Shortened URL

**Endpoint:** `POST /decode`

**Body (x-www-form-urlencoded):**
```
short=http://localhost:3000/abc123
```

**Example using Postman:**
1. Set method to `POST` and URL to `http://localhost:3000/decode`
2. In the Body tab, select `x-www-form-urlencoded`
3. Add a key `short` with the shortened URL you received earlier
4. Click Send

**Response:**
```
{
	"Original URL": "https://example.com"
}
```

### 3. Error Handling Example

If you try to decode a URL that does not exist, you will get a 404 response:
```
{
	"error": "Shortened URL not found."
}
```

---

You can also use `curl` for quick testing:

**Encode:**
```
curl -X POST -d "full=https://example.com" http://localhost:3000/encode
```

**Decode:**
```
curl -X POST -d "short=http://localhost:3000/abc123" http://localhost:3000/decode
```

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