import * as logger from './utils/logger'

export interface ChatCommand {
    command: string,
    callback: () => void
}

export default class ChatCommands {

    constructor() {
        this._chatCommands = [];
    }
    
    private _chatCommands: ChatCommand[];

    registerCommand(command: string, callback: () => void) {
        const exists = this._chatCommands.find((commands) => commands.command);
        if(!exists) {
            logger.info('Registering command: ' + command)
            this._chatCommands.push({command, callback})
        } else {
            logger.error("Command already registered!");
        }
    }

    handleChatMessage(log: any, text: any, data: any) {
        const exist = this._chatCommands.find((commands) => commands.command.toLowerCase() === text.toLowerCase())
        if(exist){
            logger.info(`Calling ${exist.command}`)
            exist.callback()
        }
        return false
    }


}