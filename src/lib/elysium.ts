import ChatCommands from "./chatCommands";
import * as pts from "./pullToScene";
import * as logger from "../utils/logger";

Hooks.on("canvasReady", () => {
  logger.info("THE CANVAS IS LOADED SEBBE");
});

export class Elysium {
  constructor(game: Game) {
    this._gameRef = game;
    this._chatCommands = new ChatCommands();
    Hooks.callAll("chatCommandsReady", this._chatCommands);

    Hooks.on("chatMessage", (log: any, text: any, data: any) => {
      return this._chatCommands.handleChatMessage(log, text, data);
    });

    Hooks.once("elysium.ready", (elysium: Elysium) => {
      logger.info("elysium loaded");
      this.registerSocketEvent("elysium.loaded", (user: string) => {
        logger.info("Attempting to move user", user)
        if (!user) return;
        logger.info("There was a valid user")

        const result = this._userSceneMap.get(user);
        logger.info(result);
        if (result) {
          try {
            setTimeout(() => {
              this._gameRef.socket?.emit("pullToScene", result, user);
            }, 1000);
          } catch (err) {
            logger.info("Failed to do pullToScene");
            logger.error(err);
          }
        }
      });

      if (!this._gameRef.user?.isGM) {
        this._socket!.executeAsGM("elysium.loaded", this._gameRef.user?.id);
      }
    });
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

  registerSocketEvent(event: string, callback: any) {
    if (!this._socket) {
      this._socket = socketlib.registerModule("elysium");
    }
    this._socket.register(event, callback);
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
  Hooks.callAll("elysium.ready", elysium);
  return elysium;
}
