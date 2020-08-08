//Install express server
const express = require('express');
const path = require('path');
const https = require('https');
const { baseUrl, endpoints: { CONTACTS }, organizationId: organization_id, authToken:authtoken} = require('./config');
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// Serve only the static files form the dist directory
app.use(express.static('./build/'));
/**
 * This api for fetch all contacts from zoho
 */
app.get('/contacts', async (req, res) => {
    try {
        const params = {
            ...req.query,...{
                organization_id,
                authtoken
            }
        };
        const queryString = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        https.get(`${baseUrl}${CONTACTS}?${queryString}`, (response) => {
            let rawData = '';
            response.on('data', (chunk) => { rawData += chunk; });
            response.on('end', () => {
                try {
                    const data = JSON.parse(rawData);
                    res.status(200).json({
                        ...data
                    });
                } catch (error) {
                    res.status(500).json({
                        message: "Error while calling web service",
                        error
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while calling web service",
            error
        });
    }
})

/**
 * This api for show frontend on any api call except contacts
 */
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8000);