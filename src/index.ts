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
  game.chatCommands.registerCommand('/removeTokens', () => {

      // game.actors.get(() => {})


    // canvas?.tokens?.objects?.children?.forEach((token) => {
    //   logger.info(token.actor)
    // });

    // canvas?.tokens.forEach((token) => logger.info(token))
    canvas?.tokens?.controlled.forEach((token) => token.document.delete())
   });
}) 