const db = require('../model/db');

const assert = require("assert");

const chai = require("chai");

const chaiHttp = require("chai-http");

const server = require("../app");

const should = chai.should();

const fs = require("fs");

const jwt = require('jsonwebtoken');

const config = require('../config');

let token = null;

const newUser = {
                   "firstName" : "Andela",
                   "lastName" : "devct",
                   "email" : `${Math.random().toString(36).substr(2, 10)}@andela.com`,
                   "password" : "password123",
                   "gender" : "male",
                   "jobRole" : "Customer Experience",
                   "department" : "Attendance",
                   "address" : "2, Andela way, Lagos"
               };

/* Generate Access token */

before(function() {
    
    token = jwt.sign({ email : "devct@andela.com", userId : "1"}, config.jwtKey, 
        
                { algorithm: 'HS256', expiresIn: config.jwtExpire});
});

/* Delete Comment made by the test */

after(function() {

    db.query('DELETE FROM comment WHERE id IN (SELECT id FROM comment ORDER BY id DESC LIMIT 2)');
});



chai.use(chaiHttp);

describe("TEAMWORK API", function(){

    /* Increase execution timeout to 10sec */
    
    this.timeout(10000); 

    /* Test for ARTICLE/GIF OPERATIONS */

    describe ("GET ARTICLE/GIF OPERATIONS", function(){

        it("Fetch all post and gifs", done => {

            chai.request(server)
                .get("/api/v1/feed")
                .set("token", token)
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array');
                    
                    done()
                })
        });

        it("Fetch a single article ", done=>{

            chai.request(server)
                .get("/api/v1/articles/3")
                .set("token", token)
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    
                    done()
                })
        });

        it("Fetch a single gif", done=>{

            chai.request(server)
                .get("/api/v1/gifs/4")
                .set("token", token)
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    
                    done()
                })
        });

    })

    describe ("USER MANAGEMENT", function(){

        /* Test for Login and Sign Up */

        it("Admin can create New Employee", done => {

            chai.request(server)
                .post("/api/v1/auth/create-user")
                .set("token", token)
                .set("Content-Type", "application/json")
                .send(newUser)
                .end((err,res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    
                    done()
                })
        });

        it("Employee can login", done => {

            chai.request(server)
                .post("/api/v1/auth/signin")
                .send({email : newUser.email, password: newUser.password})
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.token.should.be.a('string');

                    token = res.body.data.token;
                    
                    done()
                })
        });

    })
    

    describe ("CREATE, EDIT, AND DELETE ARTICLES AND GIFS OPERATIONS", function(){

        /* Test for CREATE, EDIT, AND DELETE  ARTICLES AND GIFS */

        let id = null;

        it("Employee can create new article", done => {

            chai.request(server)
                
                .post("/api/v1/articles")
                .set("token", token)
                .set("Content-Type", "application/json")

                .send({
                
                    "title" : "My post title",
                    "article" : "Welcome to my new post. Kindly sit tight"
                })
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.articleId.should.be.a('number');

                    id = res.body.data.articleId;
                    
                    done()
                })
        });

        it("Employee can edit their article", done => {

            chai.request(server)
                
                .patch(`/api/v1/articles/${id}`)
                .set("token", token)
                .set("Content-Type", "application/json")
                .send({
                
                    "title" : "Update post title",
                    "article" : "Update Welcome to my new post. Kindly sit tight"
                })
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.message.should.be.a('string');
                    
                    done()
                })
        });

        it("Employee can delete their article", done => {

            chai.request(server)
                
                .delete(`/api/v1/articles/${id}`)
                .set("token", token)
                .set("Content-Type", "application/json")
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.message.should.be.a('string');
                    
                    done()
                })
        });


        it("Employee can create new gif", done => {

            chai.request(server)
                
                .post("/api/v1/gifs")
                .set("token", token)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .field("title", "New Gif Post")
                .attach("image", fs.readFileSync('uploads/test.png'), "test.png")
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.gifId.should.be.a('number');
                    res.body.data.imageUrl.should.be.a('string');

                    id = res.body.data.gifId;
                    
                    done()
                })
        });

        it("Employee can delete their gif", done => {

            chai.request(server)
                
                .delete(`/api/v1/gifs/${id}`)
                .set("token", token)
                .set("Content-Type", "application/json")
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.message.should.be.a('string');
                    
                    done()
                })
        });
    })
    

    describe ("COMMENTS", function(){

        /* Test for ability to make comments on articles and gifs */

        it("Employee can comment on article", done => {

            chai.request(server)
                
                .post("/api/v1/articles/3/comment")
                .set("token", token)
                .set("Content-Type", "application/json")
                .send({"comment" : "This is comment on article"})
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.comment.should.be.eql('This is comment on article');

                    done()
                })
        });    
        
        it("Employee can comment on gif", done => {

            chai.request(server)
                
                .post("/api/v1/gifs/4/comment")
                .set("token", token)
                .set("Content-Type", "application/json")
                .send({"comment" : "This is comment on gif"})
                
                .end((err,res)=>{
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.comment.should.be.eql('This is comment on gif');

                    done()
                })
        });
    })
})