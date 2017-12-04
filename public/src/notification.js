var socket = io.connect('http://localhost:8002');
socket.on('connect', function (data) {
    // convert the json string into a valid javascript object
      socket.emit('storeClientInfo', {customID: $.cookie("userID")})
      
   });
   
socket.on('notification', function (data) {
 // convert the json string into a valid javascript object
   var _data = JSON.parse(data);
   console.log(data);
});
