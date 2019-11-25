const jwt = require('jsonwebtoken');

const config = require('./config.js');

/* Verify jwt token */

const checkToken = (req, res, next) => {

  let token = req.headers['token'];

  if (token) {

    jwt.verify(token, config.jwtKey, (error, userData) => {

        if (error) {
            
            return res.json({
                                success: "error",

                                error: 'Token is not valid'
                            });
        } 
        else {

            req.userData = userData;

            next();
        }
    });
  } 
  else {
    
    return res.json({
                        success: "error",
    
                        error: "Auth token is not supplied"
                    });
  }
};

module.exports = {
                    checkToken: checkToken
                }