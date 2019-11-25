const db = require('./db');

const getDateTime = require('./dateTime');

/* Create New Article */

const createArticle = (req, res) => {

    const { title, article } = req.body;

    /* Confirm required fields are passed */

    if (typeof(title) == "undefined" || typeof(article) == "undefined"){

        return res.status(403).json({
                                        status: "error",
                                        
                                        error : "Title and Article fields are required"

                                    });
    }

    const category = "article";

    const authorId = req.userData.userId;

    /* Insert new article to the database */

    db.query('INSERT INTO post (title, content, category, author_id) VALUES ($1, $2, $3, $4)', 
    
        [title, article,  category, authorId], 

        (error, results) => {

        if (error) {

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else{

            /* Retrieve the Article data  */

            db.query('SELECT * FROM post WHERE author_id = $1 ORDER BY id DESC LIMIT 1', [authorId], (error, results) => {
            
                res.status(200).json({
                                        status: "success",
    
                                        data : {
                                                    articleId : results.rows[0].id,

                                                    message : "Article successfully posted",
                                                    
                                                    createdOn : getDateTime(results.rows[0].created_at),
                                                    
                                                    title : results.rows[0].title
                                                }                                   
                                        });
            });
        }        
    })
}


/* Edit Article */

const editArticle = (req, res) => {

    const id = parseInt(req.params.id);

    const category = "article";

    const authorId = req.userData.userId;

    const { title, article } = req.body;

    /* Confirm required fields are passed */

    if (typeof(title) == "undefined" || typeof(article) == "undefined"){

        return res.status(403).json({
                                        status: "error",
                                        
                                        error : "Title and Article fields are required"

                                    });
    } 
    
    /* Update article in the database */

    db.query('UPDATE post SET title = $1, content = $2 WHERE id = $3 AND category = $4 AND author_id = $5', 
    
        [title, article,  id, category, authorId], 

        (error, results) => {

        if (error) {

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else if (results.rowCount == 0){
    
            return res.status(404).json({ 
                                            status: "error",
                                            
                                            error : "Invalid article id or record already deleted"
    
                                        });
    
        }

        res.status(200).json({
                                status: "success",
    
                                data : {        
                                            "message": "Article successfully updated",

                                            "title" : title,

                                            "article" : article
                                        }                                   
                            });

    });
}


/** Delete Article by id **/

const deleteArticle = (req, res) => {

    const id = parseInt(req.params.id);

    const category = "article";

    const authorId = req.userData.userId;
    
    /* Delete from Database */

    db.query('DELETE FROM post WHERE id = $1 AND category = $2 AND author_id = $3', 
        
    [id, category, authorId], (error, results) => {

    if (error){

        return res.status(500).json({ 
                                        status: "error",
                                        
                                        error : error

                                    });
    }
    else if (results.rowCount == 0){

        return res.status(404).json({ 
                                        status: "error",
                                        
                                        error : "Invalid article id or record already deleted"

                                    });

    }

    res.status(200).json({
                            status: "success",

                            data : {        
                                        message : "Article successfully deleted",
                                    }                                   
                        });

   });
}


module.exports = {
                    createArticle,

                    editArticle,

                    deleteArticle

                };