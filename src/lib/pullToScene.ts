import { elysium, Elysium } from "./elysium";
import * as logger from "../utils/logger";

let _game: null | Game;

Hooks.once("elysium.ready", (elysium: Elysium) => {
  const socket = socketlib.registerModule("elysium");
  elysium.setSocket(socket);
  socket.register("elysium.pullToScene", pullToScene);
  socket.register("elysium.pullMeIn", pullMeIn);
});

Hooks.once("socketlib.ready", () => {
  logger.info("Socketlib ready");
});

Hooks.on(
  "createToken",
  (token: Token, options: DocumentModificationContext, userId: string) => {
    if (!(_game instanceof Game)) return;
    if (!_game.user?.isGM) return;
    const { actor } = token;

    if (actor?.type === "character") {
      logger.info("GM is attempting to move character to new scene");
      try {
        elysium.socket.executeForEveryone(
          "elysium.pullToScene",
          actor.id,
          canvas?.scene?.id
        );
      } catch (err) {
        logger.info(`Failed to exectute elysium.pullToScene. Reason: ${err} `);
      }
    }
  }
);

function pullToScene(actorId: string, sceneId: string) {
  logger.info(`attempting to execute pull to scene`);
  if (!(_game instanceof Game)) return;

  const actor = _game.actors?.get(actorId);
  if (!actor) return;
  if (actor.permission !== 3) return;
  logger.info(actorId);

  elysium.socket?.executeAsGM(
    "elysium.pullMeIn",
    _game.user?.id,
    sceneId,
    canvas?.scene?.id,
    actorId
  );
}

function pullMeIn(
  userId: string,
  sceneId: string,
  currentSceneId: string,
  actorId: string
) {
  if (!(_game instanceof Game)) return;

  if (currentSceneId !== sceneId) {
    logger.info('scene id mismatch attempting to remove old tokens')
    const oldScene = _game.scenes?.get(currentSceneId);
    const oldToken = oldScene?.tokens.filter(
      (token) =>
        token.actor?.id === actorId && token.actor?.type === "character"
    );

    oldToken?.forEach((token) => {
      token.delete();
    });
  }

  if(_game.users?.find((user)=> user.id === userId))
    elysium.setUserScene(userId, sceneId);
  _game.socket?.emit("pullToScene", sceneId, userId);
}

export function initialize(game: Game) {
  _game = game;
}
