// INIT WebsocketServer
const WebSocket = require('ws');
const Port = 80;
const wsServer = new WebSocket.Server({
   port: Port
});
console.log((new Date()) + " Server is listening on port "+ Port)
console.log('Waiting for clients to connect..')

//Hämtar JSON meddelande.
const start = require("./RequestStartTransaction.json")
const startTransaction = JSON.stringify(start);

const responsJSON = require("./BootNotification.json");
const respond = JSON.stringify(responsJSON);

// Handeling requests from Clients.
wsServer.on('connection', function (socket) {

    console.log('A client just connected');

    socket.on('message', function(msg) {
        
        let parsedMsg = JSON.parse(msg);
        console.log(parsedMsg);

        switch(parsedMsg[2]){
            case'BootNotification':
            console.log('Its a BootNotification');
            break;

            case'Heartbeat':
            console.log('Its a Hearthbeat!!');
            //socket.send(startTransaction)
            break;

            case'StatusNotification':
            console.log("Status " + parsedMsg[3].connectorStatus)
            break;

            case'TransactionEvent':
            if(parsedMsg[3].eventType=='Started'){
                console.log('Påbörja laddning');
            }
            if(parsedMsg[3].eventType=='Ended'){
                console.log('Avslutar laddning');
            }
            break;

        }

    });
    socket.send(respond)
})


 //wsServer.clients.forEach(function(client){
        //client.send(respond)
       //})



