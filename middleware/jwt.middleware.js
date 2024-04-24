const { expressjwt: jwt } = require('express-jwt');

const isAuthenticated = jwt({
    secret: process.env.TOKEN_JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders
})

function getTokenFromHeaders(req) {

    console.log('this is the header from AUthenticated',req.headers.authorization)

    if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"){
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

module.exports = { isAuthenticated }