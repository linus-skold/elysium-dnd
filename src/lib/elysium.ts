import ChatCommands from "./chatCommands";
import * as pts from "./pullToScene";
import * as logger from "../utils/logger";

export class Elysium {
  constructor() {
    this._chatCommands = new ChatCommands();

    Hooks.on("chatMessage", (log: any, text: any, data: any) => {
      return this._chatCommands.handleChatMessage(log, text, data);
    });

    Hooks.on("elysium.ready", (elysium: Elysium) => {
      logger.info("elysium loaded");
    });

    Hooks.callAll("chatCommandsReady", this._chatCommands);
    Hooks.callAll("elysium.ready", this);
  }

  private _chatCommands: ChatCommands;
  private _socket: SocketlibSocket | undefined;

  get socket(): SocketlibSocket | undefined {
    return this._socket;
  }

  getSocket(): SocketlibSocket | undefined {
    return this._socket;
  }

  setSocket(socket: SocketlibSocket) {
    logger.info("Set socket");
    this._socket = socket;
    logger.info(this._socket);
    
  }

  get commands() {
    return this._chatCommands;
  }

  registerCommand(command: string, callback: () => void) {
    this._chatCommands.registerCommand(command, callback);
  }
}

export let elysium: Elysium;

export function initializeElysium(game: Game): Elysium {
  elysium = new Elysium();
  pts.initialize(game);

  // game.settings.register("elysium", "Elysium", {
  //   name: "Toggle move scene off",
  //   hint: "your mom",
  //   scope: "client",
  //   config: true,
  //   type: String,
  //   choices: {
  //     a: "Option A",
  //     b: "Option B",
  //   },
  //   default: "a",
  //   onChange: (value) => {
  //     logger.info(value);
  //   },
  // });

  // elysium.registerCommand("elyConf", () => {
  //   logger.info("configuration boiiii");
  // });

  return elysium;
}
