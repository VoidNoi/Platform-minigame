const characterBottom = (character) => {
  return character.position.y + character.height;
};
const characterTop = (character) => {
  return character.position.y;
};
const characterLeft = (character) => {
  if (character.direction === -1) {
    return character.position.x - 25;
  } else {
    return character.position.x;
  }
};
const characterRight = (character) => {
  if (character.direction === 1) {
    return character.position.x + character.width;
  } else {
    return character.position.x;
  }
};

const platformBottom = (platform) => {
  return platform.position.y + platform.height;
};
const platformTop = (platform) => {
  return platform.position.y;
};
const platformLeft = (platform) => {
  return platform.position.x;
};
const platformRight = (platform) => {
  return platform.position.x + platform.width;
};
