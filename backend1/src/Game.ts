import { WebSocket } from "ws";
import {Chess} from 'chess.js'
import { INIT_GAME, MOVE } from './messages.js';
import { GAME_OVER } from "./messages.js";



export class Game{
 public player1:WebSocket;
 public player2:WebSocket;
 private board:Chess
 private startTime:Date;

    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }));
           this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }));
    }
    makeMove(socket:WebSocket,move:string){
        //validate the type of move using zod
        if(this.board.moves.length%2===0 && socket !==this.player1){
            return;
        }
                 if(this.board.moves.length%2===1 && socket !==this.player2){
            return;
        }
        try{
            this.board.move(move);
        }catch(e){
            return;
        }

        if(this.board.isGameOver()){
            //send the game over message to both the players
            this.player1.emit(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"White"
                }
            }))
              this.player2.emit(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"White"
                }
            }))
            return;    
         }
         if(this.board.moves.length%2===0){
            this.player2.emit(JSON.stringify({
                type:MOVE,
                payload:move
            }))
         }
         else{
             this.player1.emit(JSON.stringify({
                type:MOVE,
                payload:move
            }))
         }
        //Is it this users move
        //Is the move valid
        //update the board
        //push the move 
        //check if the game is over
        // send the updated board to both the players
    }
}