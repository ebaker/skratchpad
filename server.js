var mongoose = require('mongoose/');
var config = require('./config');
var restify = require('restify');

// Mongoose db setup
// ----------
db = mongoose.connect(config.creds.mongoose_auth_local),
Schema = mongoose.Schema;  

// Restify server setup
// ---------
var server = restify.createServer({
  name: 'skratchpad',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


// Mongoose Schema
// ---------
// Create a schema for our data
var SkratchSchema = new Schema({
  text: String,
  date_created: Date
});

// Use the schema to register a model
mongoose.model('Skratch', SkratchSchema); 
var SkratchMongooseModel = mongoose.model('Skratch'); // just to emphasize this isn't a Backbone Model

// Echo server exampl
// -----
// server.get('/echo/:name', function (req, res, next) {
//   res.send(req.params);
//   return next();
// });


// Restify routes
// --------
// GET
server.get('/skratches', function(req, res, next) {
    console.log('get');
    // Resitify currently has a bug which doesn't allow you to set default headers
    // This headers comply with CORS and allow us to mongodbServer our response to any origin
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
    // .sort('date_created', -1)
    SkratchMongooseModel.find().execFind(function (arr,data) {
        res.send(data);
    });
});

// POST
server.post('/skratches', function(req, res, next) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
    // Create a new skratch model, fill it up and save it to Mongodb
    var skratch = new SkratchMongooseModel();
    skratch.text = 'empty text...';
    //console.log(req.params);
    skratch.text = req.params.text;
    skratch.date_created = new Date();
    skratch.save(function () {
        res.send(req.body);
    });
});

// PUT
server.put('/skratches/:id', function(req, res, next) {
    // console.log('update');
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
    return SkratchMongooseModel.findById(req.params.id, function(err, skratch){
        skratch.text = req.params.text;
        return skratch.save(function(err){
            if (!err) {
                res.send(204);
                return console.log("updated");
            }
        });
    });    
});

// DELETE
server.del('/skratches/:id', function(req, res) {
    // console.log('del');
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control' );
    return SkratchMongooseModel.findById(req.params.id, function(err, skratch){
        return skratch.remove(function(err) {
            if (!err) {
                res.send(204);
                return console.log("removed");
            }
        });
    });
});

// START LISTENER
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});