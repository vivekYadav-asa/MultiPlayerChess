import { WebSocket } from "ws";
import { INIT_GAME } from "./messages.js";
import { MOVE } from './messages.js';
import {Game} from "./Game.js"

export class GameManager{
  private games:Game[];
  private pendingUser:WebSocket |null;
  private users:WebSocket[];
  constructor(){
this.games=[];
this.pendingUser=null;
this.users=[]
  } 
  addUser(socket:WebSocket){
    this.users.push(socket);
    this.addHandler(socket)
  }
  
   removeUser(socket:WebSocket){
    this.users=this.users.filter(user=>user!==socket);
    //stop the game here because the user left

  }
  private addHandler(socket:WebSocket){
socket.on("message",(data)=>{
    const message=JSON.parse(data.toString());
    if(message.type==INIT_GAME){
        if(this.pendingUser){
            //start game
            const game=new Game(this.pendingUser,socket)
            this.games.push(game);
        } else{
            this.pendingUser=socket;
            // this is the user waiting for someone to start the game
        }
    }
    if(message.type === MOVE){
      const game=this.games.find(game=>game.player1===socket||game.player2===socket);
      if(game){
        game.makeMove(socket,message.move)
      }
    }
})
  }
}