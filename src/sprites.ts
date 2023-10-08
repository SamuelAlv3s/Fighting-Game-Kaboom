import { loadSprite, loadSpriteAtlas } from "./kaboomCtx";

const loadGameSprites = () => {
  loadSprite("background", "assets/background/background_layer_1.png");
  loadSprite("trees", "assets/background/background_layer_2.png");
  loadSpriteAtlas("assets/oak_woods_tileset.png", {
    "ground-golden": {
      x: 16,
      y: 0,
      width: 16,
      height: 16,
    },
    "deep-ground": {
      x: 16,
      y: 32,
      width: 16,
      height: 16,
    },
    "ground-silver": {
      x: 150,
      y: 0,
      width: 16,
      height: 16,
    },
  });

  loadSprite("shop", "assets/shop_anim.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
      default: {
        from: 0,
        to: 5,
        speed: 12,
        loop: true,
      },
    },
  });
  loadSprite("fence", "assets/fence_1.png");
  loadSprite("sign", "assets/sign.png");

  loadSprite("idle-player1", "assets/idle-player1.png", {
    sliceX: 8,
    sliceY: 1,
    anims: { idle: { from: 0, to: 7, speed: 12, loop: true } },
  });
  loadSprite("jump-player1", "assets/jump-player1.png", {
    sliceX: 2,
    sliceY: 1,
    anims: { jump: { from: 0, to: 1, speed: 2, loop: true } },
  });
  loadSprite("attack-player1", "assets/attack-player1.png", {
    sliceX: 6,
    sliceY: 1,
    anims: { attack: { from: 1, to: 5, speed: 18 } },
  });
  loadSprite("run-player1", "assets/run-player1.png", {
    sliceX: 8,
    sliceY: 1,
    anims: { run: { from: 0, to: 7, speed: 18 } },
  });
  loadSprite("death-player1", "assets/death-player1.png", {
    sliceX: 6,
    sliceY: 1,
    anims: { death: { from: 0, to: 5, speed: 10 } },
  });

  loadSprite("idle-player2", "assets/idle-player2.png", {
    sliceX: 4,
    sliceY: 1,
    anims: { idle: { from: 0, to: 3, speed: 8, loop: true } },
  });
  loadSprite("jump-player2", "assets/jump-player2.png", {
    sliceX: 2,
    sliceY: 1,
    anims: { jump: { from: 0, to: 1, speed: 2, loop: true } },
  });
  loadSprite("attack-player2", "assets/attack-player2.png", {
    sliceX: 4,
    sliceY: 1,
    anims: { attack: { from: 0, to: 3, speed: 18 } },
  });
  loadSprite("run-player2", "assets/run-player2.png", {
    sliceX: 8,
    sliceY: 1,
    anims: { run: { from: 0, to: 7, speed: 18 } },
  });
  loadSprite("death-player2", "assets/death-player2.png", {
    sliceX: 7,
    sliceY: 1,
    anims: { death: { from: 0, to: 6, speed: 10 } },
  });
};

export default loadGameSprites;
