import {
  add,
  anchor,
  area,
  center,
  color,
  outline,
  pos,
  rect,
  rotate,
  sprite,
  text,
} from "./kaboomCtx";
import { Player } from "./player";

export function declareWinner(
  winningText: { text: string },
  player1: Player,
  player2: Player
) {
  if (
    (player1.health > 0 && player2.health > 0) ||
    (player1.health === 0 && player2.health === 0)
  ) {
    winningText.text = "Tie!";
  } else if (player1.health > 0 && player2.health === 0) {
    winningText.text = "Player 1 won!";
    player2.use(sprite(player2.sprites.death));
    player2.play("death");
  } else {
    winningText.text = "Player 2 won!";
    player1.use(sprite(player1.sprites.death));
    player1.play("death");
  }
}

export function createScoreBoard() {
  const counter = add([
    rect(50, 50),
    pos(center().x, center().y - 250),
    color(10, 10, 10),
    area(),
    anchor("center"),
  ]);

  const count = counter.add([
    text("60"),
    area(),
    anchor("center"),
    {
      timeLeft: 60,
    },
  ]);

  const winningText = add([text(""), area(), anchor("center"), pos(center())]);

  const player1HealthContainer = add([
    rect(300, 50),
    area(),
    outline(5),
    pos(90, 20),
    color(200, 0, 0),
  ]);

  const player1HealthBar = player1HealthContainer.add([
    rect(296, 46),
    color(0, 180, 0),
    pos(298, 50 - 2.5),
    rotate(180),
  ]);

  const player2HealthContainer = add([
    rect(300, 50),
    area(),
    outline(5),
    pos(570, 20),
    color(200, 0, 0),
  ]);

  const player2HealthBar = player2HealthContainer.add([
    rect(296, 46),
    color(0, 180, 0),
    pos(2.5, 2.5),
  ]);

  return {
    count,
    winningText,
    player1HealthBar,
    player2HealthBar,
  };
}
