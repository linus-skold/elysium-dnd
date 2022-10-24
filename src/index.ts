import ChatCommands from "./ChatCommands";
import * as logger from './utils/logger'

Hooks.once('ready', () => {
    const commands = new ChatCommands();

    game.chatCommands = commands;

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

Hooks.on('createToken', (token: Token) => {
  const { id, actor } = token;
  const actorTokens = actor?.getActiveTokens();
  if(actor?.type === 'character') {
    const toRemove = actorTokens?.filter((token) => token.id !== id);
    toRemove?.forEach((token) => token.document.delete())
  }
})