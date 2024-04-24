const router = require("express").Router();
const axios = require('axios');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

router.get("/login", (req, res, next) => {
  console.log('hello')
  res.json("login - normal path");
});

router.get("/google-login", async (req, res,next) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile', 
        'https://www.googleapis.com/auth/userinfo.email openid'
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        include_granted_scopes: true
    })

    res.json(authorizationUrl)
})

router.get("/google-login/callback", async (req, res, next) => {
    const { code }  = req.query;
    console.log("code", code )

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: '1078305261897-57v5b8q3jl1smr72ag1ca47h71m5dfep.apps.googleusercontent.com',
            client_secret: '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',
            code: code,
            redirect_uri: 'http://localhost:5005/auth/google-login/callback',
            grant_type: 'authorization_code'
        });

        const accessToken = await tokenResponse.data.id_token;
        console.log(":access token ===> it should be here ===>", accessToken)

        const decodeGoogleJwt = await jwt.decode(accessToken);
        console.log("All the info we have requested from the scope ... HERE ===>", decodeGoogleJwt)

        // extracted only the email form the token.
        const userEmail = decodeGoogleJwt.email;
        console.log(userEmail)

    } catch(err){
        console.log(err)
    }
})

module.exports = router;