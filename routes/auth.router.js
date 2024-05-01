const router = require("express").Router();
const axios = require('axios');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

router.get("/login", (req, res, next) => {
    console.log("hallo from the login")
        res.json("Login through Google mail, you cheeky monkey... ;)");
});

router.get("/google-login", async (req, res,next) => {

    try{
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email openid'
        ];

        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });

        const response = { 
            authorizationUrl, 
            procces: "successful"
        };

        res.json(response);

    } catch(err){
        res.json({ errorMsg: "Internal Server Error" });
    }
})

router.get("/google-login/callback", async (req, res, next) => {
    const { code }  = req.query;

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const accessToken = await tokenResponse.data.id_token;
        const decodedToken = await jwt.decode(accessToken);
        // extracted only the info form the token.
        const userInfo = {
            email: decodedToken.email, 
            fullName: decodedToken.name, 
            givenName: decodedToken.given_name, 
            familyName: decodedToken.family_name, 
            image: decodedToken.picture
        };

        res.cookie('decodedToken', userInfo, { path: '/' });
        res.redirect("http://localhost:5173/profile");
        
    } catch(err){
        res.json({ errorMsg: "Internal Server Error"});
    }

})



module.exports = router;