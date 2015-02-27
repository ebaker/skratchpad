var mongoose = require('mongoose/');
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

// Mongoose db setup
// ----------
db = mongoose.connect(config.creds.mongoose_auth_local),
Schema = mongoose.Schema;

// Mongoose Schema
var SkratchSchema = new Schema({
  text: String,
  date_created: Date
});

// Use the schema to register a model, not backbone model
mongoose.model('Skratch', SkratchSchema);
var SkratchMongooseModel = mongoose.model('Skratch');

// Express server setup
// ---------
var server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(express.static(__dirname + '/public'));
server.use('/vendor', express.static(__dirname + '/vendor'));

var port = process.env.PORT || 3000;
var api = express.Router();

// Expressk routes
// GET
api.get('/skratches', function(req, res, next) {
  console.log('get /skratches');
  SkratchMongooseModel.find(function (err, data) {
    if (!err){
      res.send(data);
    }
    else {
      console.log('Error in get %s', err);
      res.send(400);
    }
  })
});

// POST
api.post('/skratches', function(req, res, next) {

  // Create a new skratch model, fill it up and save it to Mongodb
  var skratch = new SkratchMongooseModel();
  skratch.text = 'empty text...';
  skratch.text = req.body.text;
  skratch.date_created = new Date();
  skratch.save(function (err, data) {
    if (!err) {
      console.log('create');
      res.send(data);
    }
    else {
      console.log('Error saving %s', err);
      res.send(400);
    }
  });
});

// PUT
api.put('/skratches/:id', function(req, res, next) {
  console.log('putting', req.params.id);

  return SkratchMongooseModel.findById(req.params.id, function(err, skratch){
    skratch.text = req.body.text;
    return skratch.save(function(err){
      if (!err) {
        console.log("update");
        res.send(204);
      }
      else {
        console.log('Error updating %s', err);
        res.send(400);
      }
    });
  });
});

// DELETE
api.delete('/skratches/:id', function(req, res) {
  return SkratchMongooseModel.findById(req.params.id, function(err, skratch){
    return skratch.remove(function(err) {
      if (!err) {
        console.log("delete");
        res.send(204);
      }
      else {
        console.log('Error deleting %s', err);
        res.send(400);
      }
    });
  });
});

// Register API route
server.use('/api', api);

// START LISTENER
server.listen(port, function () {
  console.log('listening on %s', port);
});
