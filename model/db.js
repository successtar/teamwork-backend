const Pool = require('pg').Pool

const config = require('../config');

/* Db Connection */

const db = new Pool({
                        user: config.dbUser,
                        
                        host: config.dbHost,
                        
                        database: config.db,
                        
                        password: config.dbPass,

                        port: config.dbPort,
                    });

module.exports = db;