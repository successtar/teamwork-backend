const db = require('./db');

const getDateTime = require('./dateTime');

/* Fetch all Articles and Gif */

const all = (req, res) => {

    db.query('SELECT * FROM post ORDER BY id DESC', (error, results) => {

        if (error) {

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }

        /* Reformat Result */

        const data = results.rows.map( row => {

            let rowData = {
                            id : row.id,

                            createdOn : getDateTime(row.created_at),

                            title : row.title,

                            authorId : row.author_id 
                        };

            rowData[row.category] = row.content;

            return rowData;

        });
    
        res.status(200).json({
                                status: "success",

                                "data" : data                               
                            });
    });

}

/* View Article by Id */

const singleArticle = (req, res) => {

    req.category = "article";

    viewPost(req, res);
}

/* View gif by Id */

const singleGif = (req, res) => {

    req.category = "url";

    viewPost(req, res);
}


/* Load Post by id */

const viewPost = (req, res) => {

    const id = parseInt(req.params.id);

    const category = req.category;
    
    /* Select from Database */

    db.query('SELECT * FROM post WHERE id = $1 AND category = $2', 
        
    [id, category], (error, results) => {

        if (error){

            return res.status(500).json({ 
                                            status: "error",
                                            
                                            error : error

                                        });
        }
        else if (results.rowCount == 0){

            return res.status(404).json({ 
                                            status: "error",
                                            
                                            error : "Invalid " + category + " id or record does not exist"

                                        });

        }

        const {title, content, created_at} = results.rows[0];

        /* Read comments from Database */

        db.query('SELECT * FROM comment WHERE post_id = $1 ORDER BY id DESC', [id], (error, results) => {

            if (error){

                return res.status(500).json({ 
                                                status: "error",
                                                
                                                error : error

                                            });
            }

            /* Reformat comments output */

            const comments = results.rows.map( row => {

                return {
                           commentId : row.id,
                           
                           comment : row.comment,

                           authorId : row.author_id

                        }
            });

            /* Prepare result data */

            const data = {
                            id : id,

                            createdOn : getDateTime(created_at),

                            title : title
                        };

            data[category] = content;

            data["comments"] = comments;

            res.status(200).json({
                                    status: "success",
        
                                    data : data
                                    
                                });


        })

   });

}

module.exports = {
                    all,

                    singleArticle,
                    
                    singleGif
                }