import {
  add,
  addLevel,
  anchor,
  area,
  body,
  color,
  destroyAll,
  easings,
  go,
  height,
  onKeyDown,
  onKeyPress,
  onKeyRelease,
  onUpdate,
  opacity,
  outline,
  pos,
  rect,
  rotate,
  scale,
  scene,
  setCursor,
  setGravity,
  sprite,
  text,
  tween,
  vec2,
  wait,
  width,
} from "./kaboomCtx";
import {
  attack,
  makeJump,
  makePlayer,
  resetAfterJump,
  resetPlayerToIdle,
  run,
} from "./player";
import { createScoreBoard, declareWinner } from "./scoreBoard";
import loadGameSprites from "./sprites";

loadGameSprites();

scene("menu", () => {
  add([sprite("background"), scale(4)]);

  onUpdate(() => setCursor("default"));

  const button01 = add([
    rect(240, 80, { radius: 8 }),
    pos(width() / 2, height() / 2 - 50),
    scale(1),
    area(),
    anchor("center"),
    rotate(0),
    outline(4),
  ]);

  button01.add([
    text("Vs. Player"),
    pos(0, 0),
    color(0, 0, 0),
    anchor("center"),
  ]);

  const button02 = add([
    rect(240, 80, { radius: 8 }),
    pos(width() / 2, height() / 2 + 50),
    scale(1),
    area(),
    anchor("center"),
    rotate(0),
    outline(4),
  ]);

  button02.add([text("Vs. CPU"), pos(0, 0), color(0, 0, 0), anchor("center")]);

  const warningText = add([
    text("Warning: CPU contains bugs! (•‿•)"),
    pos(width() / 2, height() / 2 + 150),
    color(255, 0, 0),
    anchor("center"),
    opacity(0),
  ]);

  button01.onHoverUpdate(() => {
    button01.scale = vec2(1.2);
    button01.rotateTo(button01.angle + 0.1);
    setCursor("pointer");
  });
  button01.onHoverEnd(() => {
    button01.scale = vec2(1);
    button01.rotateTo(0);
  });

  button02.onHoverUpdate(() => {
    button02.scale = vec2(1.2);
    button02.rotateTo(button02.angle + 0.1);
    setCursor("pointer");
    warningText.opacity = 1;
  });
  button02.onHoverEnd(() => {
    button02.scale = vec2(1);
    button02.rotateTo(0);
    warningText.opacity = 0;
  });

  button01.onClick(() => go("fight", false));
  button02.onClick(() => go("fight", true));
});
scene("fight", (isCPU: boolean) => {
  const background = add([sprite("background"), scale(4)]);

  background.add([sprite("trees")]);

  const groundTiles = addLevel(
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "------#######-----------",
      "dddddddddddddddddddddddd",
      "dddddddddddddddddddddddd",
    ],
    {
      tileWidth: 16,
      tileHeight: 16,
      tiles: {
        "#": () => [sprite("ground-golden"), area(), body({ isStatic: true })],
        "-": () => [sprite("ground-silver"), area(), body({ isStatic: true })],
        d: () => [sprite("deep-ground"), area(), body({ isStatic: true })],
      },
    }
  );

  groundTiles.use(scale(3));

  const shop = background.add([sprite("shop"), pos(160, 45), scale(0.5)]);

  shop.play("default");

  add([rect(16, 540), area(), body({ isStatic: true }), pos(-20, 0)]);

  add([rect(16, 540), area(), body({ isStatic: true }), pos(960, 0)]);

  background.add([sprite("fence"), pos(20, 95), scale(0.7)]);

  background.add([sprite("fence"), pos(100, 95), scale(0.7)]);

  background.add([sprite("sign"), pos(220, 90)]);

  setGravity(1200);

  // Player 1
  const player1 = makePlayer(100, 100, 16, 32, 3, "player1");
  player1.use(sprite(player1.sprites.idle));

  onKeyDown("d", () => {
    run(player1, 500, false);
  });
  onKeyRelease("d", () => {
    if (player1.health !== 0) {
      resetPlayerToIdle(player1);
      player1.flipX = false;
    }
  });
  onKeyDown("a", () => {
    run(player1, -500, true);
  });
  onKeyRelease("a", () => {
    if (player1.health !== 0) {
      resetPlayerToIdle(player1);
      player1.flipX = true;
    }
  });
  onKeyDown("w", () => {
    makeJump(player1);
  });

  player1.onUpdate(() => resetAfterJump(player1));

  onKeyPress("space", () => {
    attack(player1, ["a", "d", "w"]);
  });
  onKeyRelease("space", () => {
    destroyAll(player1.id + "attackHitbox");
  });

  onKeyDown("escape", () => {
    go("menu");
  });

  // Player 2
  const player2 = makePlayer(900, 100, 16, 42, 3, "player2", isCPU);
  player2.use(sprite(player2.sprites.idle));
  player2.play("idle");
  player2.flipX = true;

  onKeyDown("right", () => {
    run(player2, 500, false);
  });
  onKeyRelease("right", () => {
    if (player2.health !== 0) {
      resetPlayerToIdle(player2);
      player2.flipX = false;
    }
  });
  onKeyDown("left", () => {
    run(player2, -500, true);
  });
  onKeyRelease("left", () => {
    if (player2.health !== 0) {
      resetPlayerToIdle(player2);
      player2.flipX = true;
    }
  });
  onKeyDown("up", () => {
    makeJump(player2);
  });

  player2.onUpdate(() => resetAfterJump(player2));

  onKeyPress("down", () => {
    attack(player2, ["left", "right", "up"]);
  });
  onKeyRelease("down", () => {
    destroyAll(player2.id + "attackHitbox");
  });

  // Scoreboard

  const { count, player1HealthBar, player2HealthBar, winningText } =
    createScoreBoard();

  let gameOver = false;
  onKeyDown("enter", () => (gameOver ? go("fight", isCPU) : null));

  const countInterval = setInterval(() => {
    if (count.timeLeft === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;

      return;
    }
    count.timeLeft--;
    count.text = String(count.timeLeft);
  }, 1000);

  player1.onCollide(player2.id + "attackHitbox", () => {
    if (gameOver) {
      return;
    }

    if (player1.health !== 0) {
      player1.health -= 50;
      tween(
        player1HealthBar.width,
        player1.health,
        1,
        (val) => {
          player1HealthBar.width = val;
        },
        easings.easeOutSine
      );
    }

    if (player1.health === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;
    }
  });

  player2.onCollide(player1.id + "attackHitbox", () => {
    if (gameOver) {
      return;
    }

    if (player2.health !== 0) {
      player2.health -= 50;
      tween(
        player2HealthBar.width,
        player2.health,
        1,
        (val) => {
          player2HealthBar.width = val;
        },
        easings.easeOutSine
      );
    }

    if (player2.health === 0) {
      clearInterval(countInterval);
      declareWinner(winningText, player1, player2);
      gameOver = true;
    }
  });

  if (isCPU) {
    player2.onStateEnter("idle", async () => {
      await wait(0.5);
      const isFlipped = player1.flipX === player2.flipX;

      if (!isFlipped) {
        player2.enterState("attack");
      } else {
        player2.enterState("move");
      }
    });

    player2.onStateEnter("attack", async () => {
      if (player1.health <= 0) return;
      attack(player2, []);
      await wait(0.5);
      destroyAll(player2.id + "attackHitbox");

      const subPosition = player1.pos.sub(player2.pos).unit();

      if (subPosition.x > 0) {
        player2.enterState("move");
      } else {
        player2.enterState("idle");
      }
    });

    player2.onStateEnter("move", async () => {
      if (!player1.exists()) return;
      player2.add([
        rect(30, 20),
        area(),
        pos(0, 0),
        opacity(0),
        scale(3),
        anchor("center"),
        player2.id + "areaHitbox",
      ]);
      await wait(2);
      player2.enterState("idle");
    });

    player2.onStateUpdate("move", () => {
      if (!player1.exists()) return;
      const dir = player1.pos.sub(player2.pos).unit();
      const speed = dir.x < 0 ? -400 : 400;
      run(player2, speed, dir.x < 0);
    });

    player1.onCollide(player2.id + "areaHitbox", () => {
      player2.enterState("idle");
      destroyAll(player2.id + "attackHitbox");
    });
  }
});

go("menu");
