import ChatCommands from "./ChatCommands";
import * as logger from './utils/logger'


let socket: SocketlibSocket;
let elysium: Elysium;

class Elysium {
  constructor() {
    this._chatCommands = new ChatCommands();
  }

  private _chatCommands: ChatCommands

  get commands() {
    return this._chatCommands; 
  }
}



Hooks.once("socketlib.ready", ()=>{
  socket = socketlib.registerModule("elysium");
  socket.register("elysium.pullToScene", pullToScene);
  socket.register("elysium.pullMeIn", pullMeIn);
})

Hooks.once('ready', async () => {
  if(!(game instanceof Game) ) return
    
    elysium = new Elysium()


    Hooks.on('chatMessage', (log:any, text:any, data:any) => {
        return elysium.commands.handleChatMessage(log, text, data)
    })
    Hooks.callAll('chatCommandsReady', elysium.commands);
})


Hooks.on('chatCommandsReady', () => {
  // elysium.commands.registerCommand()
  // game.chatCommands.registerCommand('/removeTokens', () => {
  //   canvas?.tokens?.controlled.forEach((token) => token.document.delete())
  //  });
}) 

Hooks.on('createToken', (token: Token, options: DocumentModificationContext, userId: string) => {
  if(!(game instanceof Game) ) return

  if(!game.user?.isGM) return;
  const { id, actor } = token;
  const actorTokens = actor?.getActiveTokens();
  if(actor?.type === 'character') {
    const toRemove = actorTokens?.filter((token) => token.id !== id);
    toRemove?.forEach((token) => token.document.delete())
    socket.executeForEveryone("elysium.pullToScene", actor.id, canvas?.scene?.id)
  }
})


function pullToScene(actorId: string, sceneId: string) {
  if(!(game instanceof Game) ) return

  const actor = game.actors?.get(actorId)
  if(!actor) return;
  if(actor.permission !== 3) return;

  socket.executeAsGM("elysium.pullMeIn", game.user?.id, sceneId);
}

function pullMeIn(userId: string, sceneId: string) {
  if(!(game instanceof Game) ) return
  game.socket?.emit("pullToScene", sceneId, userId)
}   