export const HQ_VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { min: 480, ideal: 720, max: 1280 },
    height: { min: 360, ideal: 480, max: 720 },
    frameRate: { min: 15, ideal: 30, max: 30 },
  },
  audio: false,
};

export const LQ_VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { min: 320, ideal: 480, max: 640 },
    height: { min: 240, ideal: 360, max: 480 },
    frameRate: { min: 15, ideal: 30, max: 30 },
  },
  audio: false,
};

export const LQ_SCREEN_CONSTRAINTS: DisplayMediaStreamConstraints = {
  video: {
    width: 480,
    height: 360,
    frameRate: 30,
  },
  audio: false,
};

export const HQ_SCREEN_CONSTRAINTS: DisplayMediaStreamConstraints = {
  video: {
    width: 1280,
    height: 720,
    frameRate: 30,
  },
  audio: false,
};
