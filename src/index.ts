import * as logger from './utils/logger'
import { Elysium, initializeElysium } from './lib/elysium'

Hooks.once('ready', async () => {
  if(!(game instanceof Game) ) return;
  initializeElysium()
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
  }
})