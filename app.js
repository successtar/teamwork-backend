const express = require('express');

const bodyParser = require('body-parser');

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

/* login Route */

app.post('/api/v1/auth/signin', user.signIn);

/* Create New User Route */

app.post('/api/v1/auth/create-user', user.createUser);

/* New gif post */

app.post('/api/v1/gifs', gif.createGif);

/* Delete gif */

app.delete('/api/v1/gifs/:id', gif.deleteGif);

/* View gif by id */

app.get('/api/v1/gifs/:id', feed.singleGif);

/* New Gif comment */

app.post('/api/v1/gifs/:id/comment', comment.gifComment);

/* New article post */

app.post('/api/v1/articles', article.createArticle);

/* Edit article */

app.patch('/api/v1/articles/:id', article.editArticle);

/* Delete article */

app.delete('/api/v1/articles/:id', article.deleteArticle);

/* View article by id */

app.get('/api/v1/articles/:id', feed.singleArticle);

/* New article comment */

app.post('/api/v1/articles/:id/comment', comment.articleComment);

/* View all article and gif */

app.get('/api/v1/feed', feed.all);



module.exports = app;
