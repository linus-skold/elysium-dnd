import { elysium } from "./elysium";

Hooks.once("socketlib.ready", () => {
  elysium.setSocket(socketlib.registerModule("elysium"));
  elysium.socket?.register("elysium.pullToScene", pullToScene);
  elysium.socket?.register("elysium.pullMeIn", pullMeIn);
});

Hooks.on(
  "createToken",
  (token: Token, options: DocumentModificationContext, userId: string) => {
    if (!(game instanceof Game)) return;

    if (!game.user?.isGM) return;
    const { actor } = token;
    if (actor?.type === "character") {
      elysium.socket?.executeForEveryone(
        "elysium.pullToScene",
        actor.id,
        canvas?.scene?.id
      );
    }
  }
);

function pullToScene(actorId: string, sceneId: string) {
  if (!(game instanceof Game)) return;

  const actor = game.actors?.get(actorId);
  if (!actor) return;
  if (actor.permission !== 3) return;

  elysium.socket?.executeAsGM("elysium.pullMeIn", game.user?.id, sceneId);
}

function pullMeIn(userId: string, sceneId: string) {
  if (!(game instanceof Game)) return;
  game.socket?.emit("pullToScene", sceneId, userId);
}
