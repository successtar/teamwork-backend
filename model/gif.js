const multer = require('multer');

const fs = require('fs');

const cloudinary = require('cloudinary').v2;

const config = require('../config');

const db = require('./db');

const getDateTime = require('./dateTime');

/* Cloudinary Access configuration */

cloudinary.config({
                    cloud_name: config.cdnName,

                    api_key: config.cdnkey,

                    api_secret: config.cdnSecret
                });


                
/** Create new Gif **/

const createGif = (req, res) => {

    /* Receive file with Multer */

    const upload = multer({ dest: 'uploads/' }).single('image')

    upload(req, res, function(error) {


        if (error) {

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error.message

                                        });
        }
        else if (typeof(req.file) == "undefined"){

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : "Kindly upload your image"

                                        });

        }
        else if (typeof(req.body.title) == "undefined"){

            /* remove file from server */

            fs.unlinkSync(req.file.path);

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : "Kindly provide gif title"

                                        });

        }

        /* Send File To Cloudinary */

        const path = req.file.path;

        const uniqueFilename = new Date().toISOString() + ".png";

        cloudinary.uploader.upload(
            
            path,
            
            { public_id: `teamwork/${uniqueFilename}`, tags: `teamwork` },
            
            function(error, image) {

                /* remove file from server */
    
                fs.unlinkSync(path);
            
                if (error) {
                    
                    return res.status(500).json({ 
                                                    status: "error",
                                                    
                                                    error : error.message
                                                });
                }

                const gifTitle =  req.body.title;

                const gifUrl = image.secure_url;

                const gifPubId = image.public_id;

                const category = "url";

                const authorId = req.userData.userId;

                /* Insert new gif information to the database */
          
                db.query('INSERT INTO post (title, content, category, author_id, public_id) VALUES ($1, $2, $3, $4, $5)', [gifTitle, gifUrl,  category, authorId, gifPubId], 
                  
                  (error, results) => {
                                        
                    if (error) {

                        return res.status(500).json({ 
                                                        status: "error",
                                                        
                                                        error : error
                    
                                                    });
                    }
                    else{
            
                        /* Retrieve the gif data  */
            
                        db.query('SELECT * FROM post WHERE author_id = $1 ORDER BY id DESC LIMIT 1', [authorId], (error, results) => {
                        
                        res.status(200).json({
                                                status: "success",
            
                                                "data" : {
                                                            "gifId" : results.rows[0].id,

                                                            "message": "GIF image successfully posted",
                                                            
                                                            "createdOn": getDateTime(results.rows[0].created_at),
                                                            
                                                            "title" : results.rows[0].title,
                                                            
                                                            "imageUrl" : results.rows[0].content
                                                        }                                   
                                                });
                        });
                    }
                });
            }
        )
    })
}



/** Delete Gif by id **/

const deleteGif = (req, res) => {

    const id = parseInt(req.params.id);

    const category = "url";

    const authorId = req.userData.userId;
            
    /* Retrieve the gif public id  */

    db.query('SELECT * FROM post WHERE id = $1 AND category = $2 AND author_id = $3', 
    
        [id, category, authorId], (error, results) => {

        if (error){

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else if (results.rows.length == 0){

            return res.status(404).json({ 
                                            status: "error",
                                            
                                            error : "Invalid gif id or record already deleted"

                                        });


        }

        /* Delete image on cloudinary */

        const pubId = results.rows[0].public_id;

        cloudinary.uploader.destroy(pubId, function(error,result) {

            if (error){

                return res.status(500).json({ 
                                                status: "error",
                                                
                                                error : error.message
    
                                            });
            }
            
            /* Delete from Database */

            db.query('DELETE FROM post WHERE id = $1 AND category = $2 AND author_id = $3', 
            
                [id, category, authorId], (error, results) => {

                if (error){

                    return res.status(500).json({ 
                                                    status: "error",
                                                    
                                                    error : error
        
                                                });
                }
    
                res.status(200).json({
                                        status: "success",
        
                                        "data" : {        
                                                    "message": "GIF post successfully deleted",
                                                }                                   
                                    });
        
            });
        
        });
    });
}


module.exports = {
                    createGif,

                    deleteGif
                };