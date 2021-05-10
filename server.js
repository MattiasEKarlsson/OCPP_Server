
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

let stationarray = [];
                                                                                    // Handeling requests from Clients.
wsServer.on('connection', function (socket, req) {

    console.log('A client just connected');
    console.log(req.url)

    socket.on('message', function(msg) {
       getCS(); 
        
        let parsedMsg = JSON.parse(msg);
        console.log(parsedMsg);

        switch(parsedMsg[2]){
            case'BootNotification':

            let station = new chargingStation(
                parsedMsg[3].chargingStation.serialNumber,
                 parsedMsg[3].chargingStation.model,
                  parsedMsg[3].chargingStation.vendorName,
                   parsedMsg[3].chargingStation.firmwareVersion);
            
                                                                                    //Sparar alla "BootNotification" i en array
            stationarray.push(station);

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
            

        };
                                                         //Startar laddning från annan klient.
         if(parsedMsg==1){
             wsServer.clients.forEach(function(client){
                 console.log("Skickar ut Start charging")
              client.send(startTransaction)
            })
         };
    });
    socket.send(respond)
});


 class chargingStation {
    constructor(serialNumber, model, vendorName, firmwareVersion) {
        this.serialNumber = serialNumber;
        this.model = model;
        this.vendorName = vendorName;
        this.firmwareVersion = firmwareVersion;
    }
} 

async function getCS(){
    fetch('https://csmsapi2021.azurewebsites.net/api/ChargingPoints')
  .then(response => response.json())
  .then(data => console.log(data));
}




 //wsServer.clients.forEach(function(client){
        //client.send(respond)
       //})



