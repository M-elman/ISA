var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var amqp = require('amqplib');
var mongoDbQueue = require('mongodb-queue');
var mubsub = require('mubsub')
var server = require('http').Server(app);
var io = require('socket.io')(server);

var clients =[];

server.listen(8002);
io.sockets.on('connection', function(socket){
  socket.on('storeClientInfo', function (data) {
      var clientInfo = new Object();
      clientInfo.customID = data.customID;
      clientInfo.clientID = socket.id;
      clients.push(clientInfo);
  });
    
  socket.on('disconnect', function (data) {
    
      for( var i=0, len=clients.length; i<len; ++i ){
          var c = clients[i];

          if(c.clientID == socket.id){
              clients.splice(i,1);
              break;
          }
      }

  });
  
})

//connect to MongoDB
mongoose.connect('mongodb://localhost/userData', { useMongoClient: true });
var db = mongoose.connection;


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

var queue = mongoDbQueue(db, 'testQ');

//use sessions for tracking logins
app.use(session({
  secret: 'mercuia',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 1337
app.listen(1337, function () {
  console.log('Express app listening on port 1337');

 

  amqp.connect("amqp://mnvtcnsf:vpo6qWWgkYaIDJd3uMkbkCfR9Ll6BaJJ@34.253.29.172:5672/mnvtcnsf").then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
  
      var ok = ch.assertQueue('Output_FAHM_CEP', {durable: true});
  
      ok = ok.then(function(_qok) {
        return ch.consume('Output_FAHM_CEP', function(msg) {
          console.log(" [x] Received '%s'", msg.content.toString());
    var obj = JSON.parse(msg.content.toString());
    console.log(" [x] Received ID '%s'", obj.event.metaData.id_utente);
    // QUI BISOGNA AGGIUNGERE IL MESSAGGIO SULLA CODA DELL?UTENTE SU MONGO DB
/*     queue.add(JSON.stringify(obj.event.payloadData), function(err, id){
      if(err) console.log(err);
    }); */
    var publisher = mubsub('mongodb://localhost/userData');
    var channel = publisher.channel('testQ');
    //client.on(error, console.log(error));
    //channel.on(error, console.log(error));
    channel.publish('document', {event: JSON.stringify(obj.event.payloadData)});
    //io.volatile.emit('notification', JSON.stringify(obj));
    
    if(clients.length > 0){
      var recipient;
      for (var i = 0; i < clients.length; i++)
      {
        if(clients[i]["customID"]===obj.event.metaData.id_doctor){
          recipient=clients[i];
          break;
        }
      }
      if (recipient!==undefined){
    var rcptSocketID=recipient["clientID"];
      io.sockets.to(rcptSocketID).emit( 'notification', JSON.stringify(obj) );}
    //io.to(clients[0]["customID"]).emit('notification', JSON.stringify(obj));
  }
        }, {noAck: true});
      });
  
      return ok.then(function(_consumeOk) {
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
      });
    });
  }).catch(console.warn);


});