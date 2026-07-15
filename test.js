const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const { app, __testing } = require('./app');

test.beforeEach(() => {
    __testing.resetUrlList();
});

test('POST /encode returns shortened URL for a valid input', async () => {
    const res = await request(app)
        .post('/encode')
        .type('form')
        .send({ full: 'https://codesubmit.io/library/react' });

    assert.equal(res.status, 201);
    assert.equal(res.type, 'application/json');
    assert.ok(res.body['Shortened URL']);
    assert.match(res.body['Shortened URL'], /^http:\/\/localhost:\d+\/[A-Za-z0-9_]{6}$/);
});

test('POST /encode rejects missing or invalid URL', async () => {
    const missing = await request(app)
        .post('/encode')
        .type('form')
        .send({});

    assert.equal(missing.status, 400);
    assert.equal(missing.body.error, 'Invalid or missing URL.');

    const invalid = await request(app)
        .post('/encode')
        .type('form')
        .send({ full: 'not-a-url' });

    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.error, 'Invalid or missing URL.');
});

test('POST /decode returns original URL for a known short URL', async () => {
    const encoded = await request(app)
        .post('/encode')
        .type('form')
        .send({ full: 'https://codesubmit.io/library/react' });

    const shortUrl = encoded.body['Shortened URL'];

    const decoded = await request(app)
        .post('/decode')
        .type('form')
        .send({ short: shortUrl });

    assert.equal(decoded.status, 200);
    assert.equal(decoded.type, 'application/json');
    assert.equal(decoded.body['Original URL'], 'https://codesubmit.io/library/react');
});

test('POST /decode handles missing and unknown short URL', async () => {
    const missing = await request(app)
        .post('/decode')
        .type('form')
        .send({});

    assert.equal(missing.status, 400);
    assert.equal(missing.body.error, 'Missing shortened URL.');

    const unknown = await request(app)
        .post('/decode')
        .type('form')
        .send({ short: 'http://localhost:3000/UNKNOWN1' });

    assert.equal(unknown.status, 404);
    assert.equal(unknown.body.error, 'Shortened URL not found.');
});

test('GET /:snippet redirects to original URL for known snippet', async () => {
    const encoded = await request(app)
        .post('/encode')
        .type('form')
        .send({ full: 'https://example.com' });

    const shortUrl = encoded.body['Shortened URL'];
    const snippet = new URL(shortUrl).pathname.slice(1);

    const redirect = await request(app)
        .get(`/${snippet}`)
        .redirects(0);

    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.location, 'https://example.com');
});

test('GET /:snippet returns 404 for unknown snippet', async () => {
    const res = await request(app)
        .get('/missing1');

    assert.equal(res.status, 404);
    assert.match(res.text, /Shortened URL not found/i);
});