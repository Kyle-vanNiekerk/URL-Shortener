
const express = require('express');
const urlData = require('./models/urlData.js');
require('dotenv').config();
const { URL } = require('url');

// In-memory URL list
let urlList = [];

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function startServer(listenPort = port) {
    return app.listen(listenPort, () => {
        console.log(`App listening on port ${listenPort}`);
        console.log(`To access the frontend UI, open http://localhost:${listenPort}/ in your browser`);
    });
}

// Validate whether an input is a valid URL
function urlCheck(myURL) {
    try {
        new URL(myURL);
        return true;
    } catch (err) {
        return false;
    }
}

// Landing Page
app.get('/', (req, res) => {
    res.render('index.ejs', { urlList });
});

// Encode a URL
app.post('/encode', (req, res) => {
    const { full, fromUi } = req.body;
    if (!full || !urlCheck(full)) {
        return res.status(400).json({ error: 'Invalid or missing URL.' });
    }
    const long = new urlData(full, port, urlList);
    urlList.push(long);
    console.log(`Encoded URL ${urlList.length}: (${long.fullUrl}) --> (${long.shortUrl})`);

    if (fromUi === '1') {
        return res.redirect('/');
    }

    return res.status(201).json({ 'Shortened URL': long.shortUrl });
});


// Decode a URL
app.post('/decode', (req, res) => {
    const { short } = req.body;
    if (!short) {
        return res.status(400).json({ error: 'Missing shortened URL.' });
    }
    const found = urlList.find(url => url.shortUrl === short);
    if (found) {
        console.log(`Decoded URL: (${short}) --> (${found.fullUrl})`);
        return res.status(200).json({ 'Original URL': found.fullUrl });
    } else {
        return res.status(404).json({ error: 'Shortened URL not found.' });
    }
});

// Redirect short URL to original URL
app.get('/:urlData', (req, res) => {
    const snippet = req.params.urlData;
    const found = urlList.find(url => url.shortUrl.split('/').pop() === snippet);
    if (found) {
        return res.redirect(found.fullUrl);
    } else {
        return res.status(404).send('Shortened URL not found');
    }
});

module.exports = {
    app,
    startServer,
    __testing: {
        resetUrlList: () => {
            urlList = [];
        }
    }
};

if (require.main === module) {
    startServer();
}