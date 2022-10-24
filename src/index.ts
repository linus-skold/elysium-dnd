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
  const tokens = canvas?.tokens?.getDocuments(); 
  const playerTokens = tokens?.filter((t) => t?.actor?.id === actor?.id)
  const toRemove = playerTokens?.filter((token) => token.id !== id);
  toRemove?.forEach((token) => token.delete())
})