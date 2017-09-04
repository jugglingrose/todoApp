"use strict";

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var MongoClient = require('mongodb').MongoClient;

var mongo = require('mongodb');

var mongo_uri = "mongodb://jugglingrose:gAXlgS0sRV6ph3Fk@cluster0-shard-00-00-3zgpt.mongodb.net:27017,cluster0-shard-00-01-3zgpt.mongodb.net:27017,cluster0-shard-00-02-3zgpt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"

var db = null;


/*set the view engine */
app.set('view engine', 'ejs');
/*access static pages*/
app.use(express.static('assets'));


app.get('/', function (req, res){
  /*when accessing app, include all data from the database*/
  db.collection("todo").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    /*if there are no errors, render the todo list UI pre-filled with to-do data*/
    res.render('todo_list', {todos:result});
  });
});

/*Parse form data that was submitted */
app.post('/', urlencodedParser, function(req, res){
  console.log(req.body);
  var item = req.body.item;
  if (item === undefined){
    res.send("item not defined");
    return;
  }
  /*if item is defined, take the item data and insert into database, redirect page
  so that all items in database show on the todo list*/
  db.collection("todo").insertOne({'item': item}, function(err, result){
    if (err) throw err;
    console.log("1 document inserted");
    res.redirect('/');
  });
});

/*
GET http://localhost:3000/blah/1234567890/donkey/qwertyuiop
*/
app.get("/blah/:VARIABLE/donkey/:var2", function(req,res){
  console.log("VARIABLE=",req.params.VARIABLE,"var2=",req.params.var2);
});

/*
DELETE /23456876543345678
*/
app.delete('/todo_list/:blah', function(req, res){
  console.log("delete has been called")
  var o_id = new mongo.ObjectID(req.params.blah);
  db.collection("todo").deleteOne({'_id': o_id}, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    res.end();
  });
});




/*Insert

MongoClient.connect(mongo_uri, function(err, db) {
  if (err) throw err;
  var myobj = { title: "blah!" };
  db.collection("todo").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
  });
});


/*Find

MongoClient.connect(mongo_uri, function(err, db) {
  if (err) throw err;
  db.collection("todo").findOne({title: "take out the trash"}, function(err, result) {
    if (err) throw err;
    console.log("sucessfully found");
    console.log(result);
  });
});


/*DELETE
MongoClient.connect(mongo_uri, function(err, db) {
  if (err) throw err;
  var myquery = { title: "shake yo butt!" };
  db.collection("todo").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
});

app.get('/hello', function (req, res){
  console.log("blah");
  var collection = db.collection('documents');
  res.send('hello');
});
*/

MongoClient.connect(mongo_uri, function(err, database) {
  if (err) throw err;
  console.log('sucessfuly connected to database');
  db = database;
  app.listen(3000, function (){
    console.log("successfully started the server");
  });
});









/*
username: jugglingrose
PW: gAXlgS0sRV6ph3Fk
mongodb://jugglingrose:gAXlgS0sRV6ph3Fk@cluster0-shard-00-00-3zgpt.mongodb.net:27017,cluster0-shard-00-01-3zgpt.mongodb.net:27017,cluster0-shard-00-02-3zgpt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin
*/
