const db = require('./db');

const getDateTime = require('./dateTime');

/* Create a New Article comment */

const articleComment = (req, res) => {

    const id = parseInt(req.params.id);

    const { comment } = req.body;

    const category = "article";

    const authorId = req.userData.userId;

    /* Confirm comment field is pass */

    if (typeof(comment) == "undefined"){

        return res.status(403).json({
                                        status: "error",
                                        
                                        error : "Comment field is required"

                                    });
    }
            
    /* Retrieve the article data */

    db.query('SELECT * FROM post WHERE id = $1 AND category = $2', 
    
        [id, category], (error, results) => {

        if (error){

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else if (results.rows.length == 0){

            return res.status(404).json({ 
                                            status: "error",
                                            
                                            error : "Invalid article id or record does not exist"

                                        });


        }

        const { title, content } = results.rows[0];

        /* Insert new comment to the database */

        db.query('INSERT INTO comment (comment, post_id, author_id) VALUES ($1, $2, $3)', 
        
            [comment, id, authorId], 

            (error, results) => {

            if (error) {

                return res.status(500).json({ 
                                                status: "error",
                                                
                                                error : error

                                            });
            }

            res.status(200).json({
                                    status: "success",

                                    "data" : {
                                                message : "Comment successfully created",
                                                
                                                createdOn : getDateTime(),
                                                
                                                articleTitle : title,

                                                article : content,

                                                comment : comment
                                            }                                   
                                    });

        })
    });
}

/* Create a New Gif comment */

const gifComment = (req, res) => {

    const id = parseInt(req.params.id);

    const { comment } = req.body;

    const category = "url";

    const authorId = req.userData.userId;

    /* Confirm comment field is pass */

    if (typeof(comment) == "undefined"){

        return res.status(403).json({
                                        status: "error",
                                        
                                        error : "Comment field is required"

                                    });
    }
            
    /* Retrieve the gif data */

    db.query('SELECT * FROM post WHERE id = $1 AND category = $2', 
    
        [id, category], (error, results) => {

        if (error){

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else if (results.rows.length == 0){

            return res.status(404).json({ 
                                            status: "error",
                                            
                                            error : "Invalid gif id or record does not exist"

                                        });


        }

        const title = results.rows[0].title;

        /* Insert new comment to the database */

        db.query('INSERT INTO comment (comment, post_id, author_id) VALUES ($1, $2, $3)', 
        
            [comment, id, authorId], 

            (error, results) => {

            if (error) {

                return res.status(500).json({ 
                                                status: "error",
                                                
                                                error : error

                                            });
            }

            res.status(200).json({
                                    status: "success",

                                    data : {
                                                message : "Comment successfully created",
                                                
                                                createdOn : getDateTime(),
                                                
                                                gifTitle : title,

                                                comment : comment
                                            }                                   
                                    });

        })
    });
}

module.exports = {

                    articleComment,

                    gifComment
                }