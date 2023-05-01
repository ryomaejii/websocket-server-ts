import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

wss.on("connection", (ws: ExtWebSocket) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    const messageJson = JSON.parse(message);

    // always send to all clients
    wss.clients.forEach((client) => {
      if (client != ws) {
        client.send(JSON.stringify(messageJson));
      }
    });
    ws.send(JSON.stringify(messageJson));
  });
});

//start our server
server.listen(process.env.PORT || 8080, () => {
  console.log(`Server started on port ${process.env.PORT || 8080} :)`);
});
