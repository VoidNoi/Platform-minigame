const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const cooldown = new Set();

const hearts = document.getElementById('healthContainer');

const gravity = 0.7;

const addToCooldown = (value, time) => {
  cooldown.add(value);
  setTimeout(() => {
    cooldown.delete(value);
  }, time);
};
//Declares the background and its position
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background2.png',
});
//Declares all of the coins and their positions
const coins = [
  new Coin({
    position: {
      x: 430,
      y: 260,
    },
  }),
  new Coin({
    position: {
      x: 500,
      y: 260,
    },
  }),
  new Coin({
    position: {
      x: 920,
      y: 360,
    },
  }),
  new Coin({
    position: {
      x: 365,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 465,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 565,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 1165,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 1265,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 1365,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 1465,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 1590,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 1660,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 1890,
      y: 80,
    },
  }),
  new Coin({
    position: {
      x: 1950,
      y: 80,
    },
  }),
  new Coin({
    position: {
      x: 2100,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2200,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2300,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2400,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2500,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2600,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2700,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 2930,
      y: 310,
    },
  }),
  new Coin({
    position: {
      x: 3000,
      y: 310,
    },
  }),
  new Coin({
    position: {
      x: 3230,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 3300,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 3530,
      y: 350,
    },
  }),
  new Coin({
    position: {
      x: 3590,
      y: 350,
    },
  }),
  new Coin({
    position: {
      x: 3650,
      y: 350,
    },
  }),
  new Coin({
    position: {
      x: 3880,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 3940,
      y: 280,
    },
  }),
  new Coin({
    position: {
      x: 4200,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4300,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4400,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4500,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4600,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4700,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4800,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 4900,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 5000,
      y: 460,
    },
  }),
  new Coin({
    position: {
      x: 5100,
      y: 460,
    },
  }),
];
//Declares the arrowplate and it's position
const arrowPlate = new Sprite({
  position: {
    x: 5300,
    y: 468,
  },
  imageSrc: './img/arrowPlateRight.png',
  scale: 2,
  // framesMax: 1,
});
//Declares the hero character and all of its arguments
const player = new character({
  position: {
    x: 150,
    y: 350,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/hero/Idle.png',
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: './img/hero/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/hero/Run.png',
      framesMax: 6,
    },
    jump: {
      imageSrc: './img/hero/Jump.png',
      framesMax: 3,
    },
    fall: {
      imageSrc: './img/hero/Fall.png',
      framesMax: 3,
    },
    attack: {
      imageSrc: './img/hero/Attack2.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/hero/takeHit.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/hero/Death.png',
      framesMax: 8,
    },
  },
  attackBox: {
    offset: {
      x: 24,
      y: 14,
    },
    width: 43,
    height: 25,
  },
  health: 100,
  width: 23,
});
//Declares the goblin character and all of its arguments
const goblins = [
  new Goblin({
    position: {
      x: 400,
      y: 400,
    },
  }),
  new Goblin({
    position: {
      x: 1100,
      y: 400,
    },
  }),
  new Goblin({
    position: {
      x: 1700,
      y: 400,
    },
  }),
  new Goblin({
    position: {
      x: 2200,
      y: 400,
    },
  }),
  new Goblin({
    position: {
      x: 2500,
      y: 400,
    },
  }),
  new Goblin({
    position: {
      x: 3510,
      y: 340,
    },
  }),
  new Goblin({
    position: {
      x: 5100,
      y: 400,
    },
  }),
];
//Declares keys that will be used when playing
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};
//Declares all of the platforms, which tiles they will use and their positions
const platforms = [
  new Platform({
    position: { x: 400, y: 300 },
    scale: 1,
    tile: { x: 7, y: 4 },
    tileLength: 3,
    tileHeight: 1,
  }),
  new Platform({
    position: { x: -100, y: -26 },
    tile: { x: 1, y: 1 },
    tileLength: 3,
    tileHeight: 11,
  }),

  new Platform({
    position: { x: -100, y: 500 },
    tile: { x: 1, y: 1 },
    tileLength: 60,
    tileHeight: 1,
    tileNoEnd: true,
  }),
  new Platform({
    position: { x: -100, y: 548 },
    tile: { x: 1, y: 2 },
    tileLength: 60,
    tileHeight: 1,
    tileNoEnd: true,
  }),
  new Platform({
    position: { x: 880, y: 405 },
    tile: { x: 1, y: 1 },
    tileLength: 2,
    tileHeight: 2,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 881, y: 500 },
    tile: { x: 6, y: 3 },
    tileLength: 1,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 929, y: 500 },
    tile: { x: 4, y: 3 },
    tileLength: 1,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 1860, y: 118 },
    tile: { x: 1, y: 1 },
    tileLength: 3,
    tileHeight: 8,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 1860, y: 500 },
    tile: { x: 6, y: 3 },
    tileLength: 1,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 1958, y: 500 },
    tile: { x: 4, y: 3 },
    tileLength: 1,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 1909, y: 490 },
    tile: { x: 2, y: 2 },
    tileLength: 1,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 1560, y: 318 },
    tile: { x: 7, y: 4 },
    tileLength: 3,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 2900, y: 350 },
    tile: { x: 7, y: 4 },
    tileLength: 3,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 3200, y: 320 },
    tile: { x: 7, y: 4 },
    tileLength: 3,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 3500, y: 390 },
    tile: { x: 7, y: 4 },
    tileLength: 4,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 3850, y: 320 },
    tile: { x: 7, y: 4 },
    tileLength: 3,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 4100, y: 500 },
    tile: { x: 1, y: 1 },
    tileLength: 30,
    tileHeight: 1,
    tileNoEnd: false,
  }),
  new Platform({
    position: { x: 4100, y: 548 },
    tile: { x: 1, y: 2 },
    tileLength: 30,
    tileHeight: 1,
    tileNoEnd: false,
  }),
];

let scrollCollision = false;
let totalHearts = player.health / 25;
let oldTotal = totalHearts;

//Constantly updates and checks for changes to be made on the canvas
const animate = () => {
  window.requestAnimationFrame(animate);
  totalHearts = player.health / 25;

  background.update();
  coins.forEach((coin) => {
    coin.update();
  });
  arrowPlate.update();

  goblins.forEach((goblin) => {
    //Hits the goblin if the attackbox is on the goblin's hitbox and player attacks
    if (
      player.isAttacking &&
      player.attackBox.position.x - player.attackBox.width <=
        characterRight(goblin) &&
      player.attackBox.position.x + player.attackBox.width >=
        characterLeft(goblin) &&
      characterTop(goblin) <= characterBottom(player)
    ) {
      goblin.takeHit();
      goblin.switchSprite('takeHit');
    }
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  goblins.forEach((goblin) => {
    if (!goblin.dead && player.position.x + 1000 >= goblin.position.x) {
      goblin.update();
      goblin.intelligence();
    }
  });

  //Moves the sprites depending on where the player is moving
  const scrollingSprites = (sprites, direction) => {
    if (direction === 'left') {
      sprites.forEach((sprite) => {
        sprite.position.x -= 4;
      });
    } else if (direction === 'right') {
      sprites.forEach((sprite) => {
        sprite.position.x += 4;
      });
    }
  };

  //Handles player movement and horizontal scrolling of other sprites
  if (
    (keys.a.pressed && player.position.x > 100) ||
    (keys.a.pressed && arrowPlate.position.x <= 900)
  ) {
    player.velocity.x = -4;
  } else if (
    (keys.d.pressed && player.position.x < 400) ||
    (keys.d.pressed && arrowPlate.position.x <= 900)
  ) {
    player.velocity.x = 4;
  } else {
    player.velocity.x = 0;
    if (!scrollCollision) {
      if (keys.d.pressed) {
        scrollingSprites(platforms, 'left');
        scrollingSprites(coins, 'left');
        scrollingSprites(goblins, 'left');
        arrowPlate.position.x -= 4;
        background.position.x -= 1;
      } else if (keys.a.pressed) {
        scrollingSprites(platforms, 'right');
        scrollingSprites(coins, 'right');
        scrollingSprites(goblins, 'right');
        arrowPlate.position.x += 4;
        background.position.x += 1;
      }
    }

    scrollCollision = false;
  }

  //Changes animation for when player jumps, falls or runs
  const characterAnimations = (character) => {
    if (
      character.velocity.y < 0 &&
      character === player &&
      !player.isAttacking
    ) {
      character.switchSprite('jump');
      character.jump = false;
    } else if (
      character.velocity.y > 0.8 &&
      character === player &&
      !player.isAttacking
    ) {
      character.switchSprite('fall');
      character.jump = false;
    } else if (
      (character.velocity.x > 0 && !player.isAttacking) ||
      (character.velocity.x < 0 && !player.isAttacking)
    ) {
      character.switchSprite('run');
      character.jump = true;
    } else if (character.isAttacking) {
      character.switchSprite('attack');
      character.jump = true;
    } else if (
      (keys.d.pressed &&
        player.velocity.y < 0.8 &&
        player.velocity.y > 0 &&
        !player.isAttacking) ||
      (keys.a.pressed &&
        player.velocity.y < 0.8 &&
        player.velocity.y > 0 &&
        !player.isAttacking) ||
      player.win
    ) {
      player.switchSprite('run');
      character.jump = true;
    } else {
      character.switchSprite('idle');
      character.jump = true;
    }
  };
  characterAnimations(player);

  const attackPrecision = (character) => {
    //make character hit when animation is at the correct frame
    if (character.isAttacking && character.framesCurrent === 2) {
      character.isAttacking = false;
    }
  };
  attackPrecision(player);

  const platformCollisions = (character) => {
    //platform collision detection
    platforms.forEach((platform) => {
      //Detect bottom collision
      if (
        characterBottom(character) <= platformTop(platform) &&
        characterBottom(character) + character.velocity.y >=
          platformTop(platform) &&
        characterRight(character) >= platformLeft(platform) &&
        characterLeft(character) <= platformRight(platform)
      ) {
        character.velocity.y = 0;
      }
      //Detect top collision
      if (
        character.velocity.y < 0 &&
        characterTop(character) <= platformBottom(platform) &&
        characterRight(character) >= platformLeft(platform) &&
        characterLeft(character) <= platformRight(platform) &&
        characterBottom(character) >= platformBottom(platform)
      ) {
        character.position.y = platformBottom(platform);
        character.velocity.y = 0;
      }
      //Detect sides collision
      if (
        characterRight(character) - 1 >= platformLeft(platform) &&
        characterTop(character) <= platformBottom(platform) &&
        characterBottom(character) >= platformTop(platform) &&
        characterLeft(character) + 8 <= platformRight(platform)
      ) {
        if (character === player) {
          scrollCollision = true;
          character.velocity.x = 0;
        }
        if (character != player && character.reachedWall) {
          character.velocity.x = 0;
        }
        character.reachedWall = true;
      }
    });
  };
  platformCollisions(player);

  const charactersCollisions = (enemy) => {
    //Detect bottom collision
    if (
      characterBottom(player) <= characterTop(enemy) &&
      characterBottom(player) + player.velocity.y >= characterTop(enemy) &&
      characterRight(player) >= characterLeft(enemy) &&
      characterLeft(player) <= characterRight(enemy)
    ) {
      player.takeHit();
    }
    //Detect top collision
    if (
      player.velocity.y < 0 &&
      characterTop(player) <= characterBottom(enemy) &&
      characterRight(player) >= characterLeft(enemy) &&
      characterLeft(player) <= characterRight(enemy) &&
      characterBottom(player) >= characterBottom(enemy)
    ) {
      player.takeHit();
    }
    //Detect sides collision
    if (
      characterRight(player) + player.velocity.x - 11 >= characterLeft(enemy) &&
      characterTop(player) <= characterBottom(enemy) &&
      characterBottom(player) >= characterTop(enemy) &&
      characterLeft(player) + player.velocity.x + 8 <= characterRight(enemy)
    ) {
      player.takeHit();
    }
  };
  goblins.forEach((goblin) => {
    characterAnimations(goblin);
    attackPrecision(goblin);
    charactersCollisions(goblin);
    platformCollisions(goblin);
  });
};

animate();
let heartOffset = 12;
//Handles the amount of hearts that should be displayed on the HUD
for (let i = 0; i < totalHearts; i++) {
  let heartImg = document.createElement('img');
  heartImg.setAttribute('class', `heartsImg heart${i + 1}`);
  heartImg.setAttribute('src', 'img/heart.png');
  heartImg.style.left = `${heartOffset}px`;
  heartOffset += 24;
  hearts.appendChild(heartImg);
}

// Player actions when key is pressed
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        player.direction = 1;

        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        player.direction = -1;
        break;
      case 'w':
        if (player.jump === true) {
          player.velocity.y = -20;
        }

        break;
      case ' ':
        player.attack();
        break;
    }
  }
});
// Stop player action when key is not pressed
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
});
