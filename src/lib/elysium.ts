import ChatCommands from "./chatCommands";
import * as pts from "./pullToScene";
import * as logger from "../utils/logger";

export class Elysium {
  constructor(game: Game) {
    this._gameRef = game;
    this._chatCommands = new ChatCommands();

    Hooks.on("chatMessage", (log: any, text: any, data: any) => {
      return this._chatCommands.handleChatMessage(log, text, data);
    });

    Hooks.on("elysium.ready", (elysium: Elysium) => {
      logger.info("elysium loaded");
    });

    Hooks.callAll("chatCommandsReady", this._chatCommands);
    Hooks.callAll("elysium.ready", this);

    Hooks.on("userConnected", (user: User, connected: boolean) => {
      if(!user || !user.id) return;
      const result = this._userSceneMap.get(user.id);
      logger.info(result)
      if(result) {
        try {
          setTimeout(()=>{
            this._gameRef.socket?.emit("pullToScene", result, user.id);
          }, 1000);
        } catch(err) {
          logger.info("Failed to do pullToScene")
          logger.error(err)
        }
      }
    });

    Hooks.on("canvasReady", () => {
      logger.info("THE CANVAS IS LOADED SEBBE");
    })


  }

  private _chatCommands: ChatCommands;
  private _socket: SocketlibSocket | undefined;
  private _userSceneMap: Map<string, string> = new Map();
  private _gameRef: Game;

  get socket(): SocketlibSocket | undefined {
    return this._socket;
  }

  getSocket(): SocketlibSocket | undefined {
    return this._socket;
  }

  setSocket(socket: SocketlibSocket) {
    logger.info("Set socket");
    this._socket = socket;
  }

  get commands() {
    return this._chatCommands;
  }

  registerCommand(command: string, callback: () => void) {
    this._chatCommands.registerCommand(command, callback);
  }

  setUserScene(userId: string, sceneId: string) {
    this._userSceneMap.set(userId, sceneId);
  }
}

export let elysium: Elysium;

export function initializeElysium(game: Game): Elysium {
  elysium = new Elysium(game);
  pts.initialize(game);

  // game.settings.register("elysium", "Elysium", {
  //   name: "Toggle move scene off",
  //   hint: "",
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
