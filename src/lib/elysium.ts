import ChatCommands from "./chatCommands";

export class Elysium {
  constructor() {
    this._chatCommands = new ChatCommands();

    Hooks.on("chatMessage", (log: any, text: any, data: any) => {
      return this._chatCommands.handleChatMessage(log, text, data);
    });
    Hooks.callAll("chatCommandsReady", this._chatCommands);
  }

  private _chatCommands: ChatCommands;
  private _socket: SocketlibSocket | undefined;

  get socket() : SocketlibSocket | undefined {
    return this._socket;
  }
  
  setSocket(socket: SocketlibSocket) {
    this._socket = socket
  }

  get commands() {
    return this._chatCommands;
  }
}

export let elysium: Elysium;

export function initializeElysium(): Elysium {
  elysium = new Elysium();
  return elysium;
}
