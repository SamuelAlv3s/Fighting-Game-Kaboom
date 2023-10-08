import {
  AnchorComp,
  AreaComp,
  BodyComp,
  GameObj,
  HealthComp,
  Key,
  PosComp,
  ScaleComp,
  SpriteComp,
  StateComp,
} from "kaboom";
import {
  Rect,
  add,
  anchor,
  area,
  body,
  isKeyDown,
  opacity,
  pos,
  rect,
  scale,
  sprite,
  state,
  vec2,
} from "./kaboomCtx";

export type PlayerOpt = {
  isCurrentlyJumping: boolean;
  health: number;
  sprites: {
    run: string;
    idle: string;
    jump: string;
    attack: string;
    death: string;
  };
};

export type Player = GameObj<
  ScaleComp &
    AreaComp &
    BodyComp &
    PosComp &
    AnchorComp &
    HealthComp &
    SpriteComp &
    StateComp &
    PlayerOpt
>;

export function makePlayer(
  posX: number,
  posY: number,
  width: number,
  height: number,
  scaleFactor: number,
  id: number | string,
  isCPU: boolean = false
): Player {
  return add([
    pos(posX, posY),
    scale(scaleFactor),
    area({ shape: new Rect(vec2(0), width, height) }),
    anchor("center"),
    body({ stickToPlatform: true }),
    isCPU ? state("move", ["idle", "attack", "move"]) : {},
    {
      isCurrentlyJumping: false,
      health: 300,
      sprites: {
        run: "run-" + id,
        idle: "idle-" + id,
        jump: "jump-" + id,
        attack: "attack-" + id,
        death: "death-" + id,
      },
    },
  ]) as Player;
}

export function run(player: Player, speed: number, flipPlayer: boolean) {
  if (player.health === 0) {
    return;
  }

  if (player.curAnim() !== "run" && !player.isCurrentlyJumping) {
    player.use(sprite(player.sprites.run));
    player.play("run");
  }
  player.move(speed, 0);
  player.flipX = flipPlayer;
}

export function resetPlayerToIdle(player: Player) {
  player.use(sprite(player.sprites.idle));
  player.play("idle");
}

export function makeJump(player: Player) {
  if (player.health === 0) {
    return;
  }

  if (player.isGrounded()) {
    const currentFlip = player.flipX;
    player.jump();
    player.use(sprite(player.sprites.jump));
    player.flipX = currentFlip;
    player.play("jump");
    player.isCurrentlyJumping = true;
  }
}

export function resetAfterJump(player: Player) {
  if (player.isGrounded() && player.isCurrentlyJumping) {
    player.isCurrentlyJumping = false;
    if (player.curAnim() !== "idle") {
      resetPlayerToIdle(player);
    }
  }
}

export function attack(player: Player, excludedKeys: Key[]) {
  if (player.health === 0) {
    return;
  }

  for (const key of excludedKeys) {
    if (isKeyDown(key)) {
      return;
    }
  }

  const currentFlip = player.flipX;
  if (player.curAnim() !== "attack") {
    player.use(sprite(player.sprites.attack));
    player.flipX = currentFlip;
    const slashX = player.pos.x + 30;
    const slashXFlipped = player.pos.x - 250;
    const slashY = player.pos.y - 150;

    add([
      rect(250, 250),
      area(),
      pos(currentFlip ? slashXFlipped : slashX, slashY),
      opacity(0),
      player.id + "attackHitbox",
    ]);

    player.play("attack", {
      onEnd: () => {
        resetPlayerToIdle(player);
        player.flipX = currentFlip;
      },
    });
  }
}
