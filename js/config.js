const CONFIG = {
  world: {
    width: 0, // wird von World gesetzt
  },

  tiles: {
    backgroundWidth: 719,
  },

  physics: {
    gravity: 1.2,
    jumpSpeed: 20,
    characterRunSpeed: 4,
    characterWalkSpeed: 2,
  },

  spawn: {
    enemies: {
      paddingX: 400,
      minY: 360,
      maxY: 380,
    },
    clouds: {
      minY: 50,
      maxY: 150,
    },
    endboss: {
      offsetFromEnd: 300,
      y: 350,
    },
  },

  animation: {
    defaultFps: 60,
    defaultAnimationSpeed: 8,
  },
};
