const express = require('express');

const bodyParser = require('body-parser');

const middleware = require('./middleware');

const user = require('./model/user');

const gif = require('./model/gif');

const article = require('./model/article');

const comment = require('./model/comment');

const feed = require('./model/feed');

const app = express();

app.use(bodyParser.json());


/* Allow cross origin */

app.use((req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  next();

});

/* Cross Origin options request */

app.options('*', (req, res, next) => res.status(200).json());

/* login Route */

app.post('/api/v1/auth/signin', user.signIn);

/* Create New User Route */

app.post('/api/v1/auth/create-user', middleware.checkToken, user.createUser);

/* New gif post */

app.post('/api/v1/gifs', middleware.checkToken, gif.createGif);

/* Delete gif */

app.delete('/api/v1/gifs/:id', middleware.checkToken, gif.deleteGif);

/* View gif by id */

app.get('/api/v1/gifs/:id', middleware.checkToken, feed.singleGif);

/* New Gif comment */

app.post('/api/v1/gifs/:id/comment', middleware.checkToken, comment.gifComment);

/* New article post */

app.post('/api/v1/articles', middleware.checkToken, article.createArticle);

/* Edit article */

app.patch('/api/v1/articles/:id', middleware.checkToken, article.editArticle);

/* Delete article */

app.delete('/api/v1/articles/:id', middleware.checkToken, article.deleteArticle);

/* View article by id */

app.get('/api/v1/articles/:id', middleware.checkToken, feed.singleArticle);

/* New article comment */

app.post('/api/v1/articles/:id/comment', middleware.checkToken, comment.articleComment);

/* View all article and gif */

app.get('/api/v1/feed', middleware.checkToken, feed.all);

/* Error 404 */

app.use((req, res, next) => {

  res.status(404).json({
                          success: "error",

                          error: "Invalid api endpoint"
                      });

});

module.exports = app;
