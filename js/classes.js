let coinCounter = document.getElementById('coinCount');
let coinCount = 0;
coinCounter.innerHTML = coinCount;
let canvasContainer = document.getElementById('container');
var gOverDiv = document.createElement('div');

class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    direction = 1,
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.direction = direction;
  }
  // Draws the sprite on to the canvas
  draw() {
    c.scale(this.direction, 1);
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x * this.direction - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  //Makes sprites animated based on the maximum amount of frames
  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}

class Coin extends Sprite {
  constructor({
    position,
    imageSrc = './img/coinIdle.png',
    scale = 2.5,
    framesMax = 6,
    offset = { x: 0, y: 0 },
    sprites = {
      coinIdle: {
        imageSrc: './img/coinIdle.png',
        framesMax: 6,
      },
      coinPickup: {
        imageSrc: './img/coinPickup.png',
        framesMax: 6,
        offset: { x: 0, y: 20 },
      },
      coinBlank: {
        imageSrc: './img/coinBlank.png',
        framesMax: 1,
      },
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.position = position;
    this.width = 20;
    this.height = 20;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
    this.sprites = sprites;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    //Detects if the player is touching the coin from any of it's sides and adds 1 to the counter if it is
    if (
      characterRight(player) >= this.position.x &&
      characterLeft(player) <= this.position.x + this.width &&
      characterBottom(player) >= this.position.y &&
      characterTop(player) <= this.position.y + this.height
    ) {
      if (this.image !== this.sprites.coinPickup.image) {
        this.image = this.sprites.coinPickup.image;
        this.framesMax = this.sprites.coinPickup.framesMax;
        this.offset = this.sprites.coinPickup.offset;
        this.framesCurrent = 0;
        coinCount += 1;
        coinCounter.innerHTML = coinCount;
      }
    }
    //Makes the coin disappear when at the correct frame
    if (
      this.image === this.sprites.coinPickup.image &&
      this.framesCurrent == this.sprites.coinPickup.framesMax - 1
    ) {
      return;
    }

    this.draw();
    this.animateFrames();
  }
}

class character extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
    health,
    width,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
    this.velocity = velocity;
    this.width = width;
    this.height = 40;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.health = health;
    this.sprites = sprites;
    this.dead = false;
    this.jump = true;
    this.win = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    // Creates the div that states if player won or not
    const gameEnd = (gameState) => {
      gOverDiv.setAttribute('id', 'GameOver');
      gOverDiv.innerHTML = gameState;
      canvasContainer.appendChild(gOverDiv);
    };

    // Decides the state of the game checking if the player is dead or not or if the player won or not
    if (!this.dead && !this.win) {
      this.animateFrames();
    } else if (this.win) {
      player.velocity.x = 4;
      gameEnd('YOU WIN');
    } else {
      this.width = 0;
      this.height = 0;
      this.attackBox.width = 0;
      this.attackBox.height = 0;
      this.velocity.x = 0;
      gameEnd('GAME OVER');
    }
    //Sets the attackBox at the correct position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //Player wins if the right side of the player is equal or bigger than the arrow plate position
    if (characterRight(player) >= arrowPlate.position.x) {
      this.win = true;
    }
    //Sets the character dead if it's health is equal or lower than 0
    if (this.health <= 0) {
      this.switchSprite('death');
      // Sets the player dead at the correct frame
      if (this.framesCurrent === 5) {
        this.dead = true;
      }
    }
    //Sets the character dead if the whole character is under the map
    if (characterTop(this) >= 600) {
      this.dead = true;
    }
    //Adds the velocity to the position of the character
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //Pulls the character down when off the ground like real gravity
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
  // Draws the character's sprite on to the canvas
  draw() {
    c.scale(this.direction, 1);
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x * this.direction - this.offset.x - this.width / 2,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  //Sets the player's attackBox position based on where the player is looking
  attack() {
    if (player.lastKey === 'd') {
      this.attackBox.offset.x = 24;
    } else if (player.lastKey === 'a') {
      this.attackBox.offset.x = -66;
    }
    this.isAttacking = true;
  }
  //Lowers health of character, sets the take hit animation and deletes 1 heart from the HUD when it gets hit and sets a cooldown of 500 milliseconds until it can get hit again
  takeHit() {
    if (!cooldown.has('attack')) {
      addToCooldown('attack', 500);
      this.switchSprite('takeHit');
      this.health -= 25;
      if (this === player && this.health >= 0) {
        var heartToDel = document.getElementsByClassName(`heart${totalHearts}`);
        hearts.removeChild(heartToDel[0]);
      }
    }
  }
  //Manages the change of sprites for the characters
  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }

        break;

      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}

class Goblin extends character {
  constructor({
    position,
    velocity = {
      x: -3,
      y: 0,
    },
    offset = {
      x: 0,
      y: 0,
    },
    imageSrc = '../img/goblin/goblinIdle.png',
    framesMax = 4,
    scale = 2.5,
    sprites = {
      idle: {
        imageSrc: '../img/goblin/goblinIdle.png',
        framesMax: 4,
      },
      run: {
        imageSrc: '../img/goblin/goblinRun.png',
        framesMax: 6,
      },
      attack: {
        imageSrc: '../img/goblin/goblinAttack.png',
        framesMax: 4,
      },
      takeHit: {
        imageSrc: '../img/goblin/goblinHit.png',
        framesMax: 3,
      },
      death: {
        imageSrc: '../img/goblin/goblinDeath.png',
        framesMax: 6,
      },
    },
    attackBox,
    health = 40,
    width = 35,
    height = 50,
    reachedWall = false,
    direction = -1,
    changeDir = false,
  }) {
    super({
      position,
      velocity,
      scale,
      framesMax,
      offset,
      sprites,
      health,
      width,
      attackBox,
      height,
    });
    this.image = new Image();
    this.image.src = imageSrc;
    this.framesMax = framesMax;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: {
        x: 35,
        y: 14,
      },
      width: 25,
    };
    this.reachedWall = reachedWall;
    this.direction = direction;
    this.changeDir = changeDir;
  }

  intelligence() {
    // **** Goblin Artificial Intelligence ****

    //Sets goblin dead if life is equal or lower than 0
    if (this.health <= 0) {
      this.switchSprite('death');
      if (this.framesCurrent === 5) {
        this.dead = true;
      }
    }

    if (this.dead) {
      this.width = 0;
      this.height = 0;
      this.attackBox.width = 0;
      this.attackBox.height = 0;
      this.velocity = 0;
      this.position.x = 0;
      this.position.y = 0;
    } else {
      //If player is touching the ground, goblin chases player until goblin is next to player
      // goblin follows player to the left if it's 100px close to him unless player is above him
      if (
        characterLeft(this) > characterRight(player) &&
        characterTop(this) <= characterBottom(player) &&
        characterLeft(this) - 100 <= characterRight(player) &&
        characterRight(player) >= characterLeft(this) - 100
      ) {
        this.velocity.x = -3;
        this.attackBox.offset.x = -40;
        this.direction = -1;
        // goblin follows player to the right if it's 100px close to him unless player is above him
      } else if (
        characterRight(this) < characterLeft(player) &&
        characterTop(this) <= characterBottom(player) &&
        characterRight(this) + 100 >= characterLeft(player) &&
        characterLeft(player) <= characterRight(this) + 100
      ) {
        this.velocity.x = 3;
        this.direction = 1;
        this.attackBox.offset.x = 20;

        // if goblin is on the left to player goblin attacks player
      } else if (
        this.attackBox.position.x - this.attackBox.width <=
          characterRight(player) &&
        this.attackBox.position.x + this.attackBox.width >=
          characterLeft(player) &&
        characterTop(this) <= characterBottom(player)
      ) {
        this.isAttacking = true;
        player.takeHit();
        this.velocity.x = 0;
      } else {
        //Goblin changes direction if hits a wall or reached the end of a platform
        platforms.forEach((platform) => {
          if (
            ((characterLeft(this) <= platformLeft(platform) ||
              characterRight(this) >= platformRight(platform)) &&
              platformBottom(platform) >= characterBottom(this) &&
              platformTop(platform) >= characterBottom(this)) ||
            (this.reachedWall && this.velocity.x > 0) ||
            (this.reachedWall && this.velocity.x < 0)
          ) {
            // console.log('true');
            this.changeDir = true;
          }
          if (this.changeDir) {
            if (this.direction === -1) {
              this.direction = 1;
              this.velocity.x = 3;
            } else if (this.direction === 1) {
              this.direction = -1;
              this.velocity.x = -3;
            }
          } else if (this.direction === -1) {
            this.velocity.x = -3;
          } else if (this.direction === 1) {
            this.velocity.x = 3;
          }
          this.changeDir = false;
          this.reachedWall = false;
        });
      }
    }

    // **** End Goblin Artificial Intelligence ****
  }
}

class Platform {
  constructor({
    position,
    imageSrc = './img/tileset.png',
    scale = 1,
    offset = { x: 0, y: 0 },
    tile,
    tileLength,
    tileHeight,
    tileNoEnd,
  }) {
    this.width = 100;
    this.height = 50;
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.offset = offset;
    this.tile = tile;
    this.tileLength = tileLength;
    this.tileHeight = tileHeight;
    this.oldTileX = this.tile.x;
    this.oldTileY = this.tile.y;
    this.tileNoEnd = tileNoEnd;
    this.tileSize = 16;
  }
  //Draws the platforms
  draw() {
    this.width = this.tileLength * 49;
    const tilesetWidth = 12;
    const tilesetHeight = 6;
    let posx = 0;
    let posy = 0;
    //Sets the correct tile based on the length of the platform
    for (let y = 0; y < this.tileHeight; y++) {
      if (y === 0) {
        this.tile.y = this.oldTileY - 1;
      } else if (y === this.tileHeight - 1 && this.tileNoEnd) {
        this.tile.y = this.oldTileY + 1;
      } else {
        this.tile.y = this.oldTileY;
      }
      for (let x = 0; x < this.tileLength; x++) {
        if (x === 0) {
          this.tile.x = this.oldTileX - 1;
        } else if (x === this.tileLength - 1) {
          this.tile.x = this.oldTileX + 1;
        } else {
          this.tile.x = this.oldTileX;
        }
        c.drawImage(
          this.image,
          (this.tile.x % tilesetWidth) * this.tileSize,
          (this.tile.y % tilesetHeight) * this.tileSize,
          16,
          16,
          this.position.x * this.scale + posx - y * this.width,
          this.position.y * this.scale + posy,
          (this.width / this.tileLength) * this.scale,
          (this.height / this.tileHeight) * this.scale
        );
        posx += 49;
      }
      this.height = this.tileHeight * 48;
      posy += 48;
    }
  }
}
