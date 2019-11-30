/* Config File */
/* Credentials and secret keys available in .env file */

module.exports = {
                    dbUser: process.env.dbUser,
                    
                    dbHost: process.env.dbHost,
                    
                    db: process.env.db,
                    
                    dbPass: process.env.dbPass,
                    
                    dbPort: process.env.dbPort,

                    jwtKey: process.env.jwtKey,
                    
                    jwtExpire : process.env.jwtExpire,

                    cdnName: process.env.cdnName,

                    cdnkey: process.env.cdnkey,
                    
                    cdnSecret: process.env.cdnSecret
                };