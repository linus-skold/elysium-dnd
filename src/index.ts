import ChatCommands from "./ChatCommands";
import * as logger from './utils/logger'

let socket;

Hooks.once("socketlib.ready", ()=>{
  socket = socketlib.registerModule("elysium");
  socket.register("elysium.pullToScene", pullToScene);
  socket.register("elysium.pullMeIn", pullMeIn);
})

Hooks.once('ready', async () => {
    const commands = new ChatCommands();


    game.chatCommands = commands;

    game.users.forEach((user) => {
      logger.info(JSON.stringify(user, null, 2))
    })

    game.actors.forEach((actor) => {
      // logger.info(JSON.stringify(actor, null, 2))
      logger.info(actor.user)
    })


    Hooks.on('chatMessage', (log:any, text:any, data:any) => {
        return commands.handleChatMessage(log, text, data)
    })

    Hooks.callAll('chatCommandsReady', commands);

})


Hooks.on('chatCommandsReady', () => {
  // game.chatCommands.registerCommand('/removeTokens', () => {
  //   canvas?.tokens?.controlled.forEach((token) => token.document.delete())
  //  });
}) 

Hooks.on('createToken', (token: Token, options: DocumentModificationContext, userId: string) => {
  if(!game.user.isGM) return;
  const { id, actor } = token;
  const actorTokens = actor?.getActiveTokens();
  if(actor?.type === 'character') {
    const toRemove = actorTokens?.filter((token) => token.id !== id);
    toRemove?.forEach((token) => token.document.delete())
    socket.executeForEveryone("elysium.pullToScene", actor.id, canvas?.scene?.id)
  }
})


function pullToScene(actorId: string, sceneId: string) {
  const actor = game.actors.get(actorId)
  if(!actor) return;
  if(actor.permission !== 3) return;
  socket.executeAsGM("elysium.pullMeIn", game.user.id, sceneId);
}

function pullMeIn(userId: string, sceneId: string) {
  game.socket.emit("pullToScene", sceneId, userId)
} 