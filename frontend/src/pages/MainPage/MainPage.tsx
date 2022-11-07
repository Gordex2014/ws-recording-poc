import React, { useState } from "react";
import { VideoPlayer } from "../../components";
import { useRecording } from "../../hooks";
import { userNames } from "../../constants";

import styles from "./MainPage.module.css";

export const MainPage = () => {
  // Random userName
  const [userName] = useState(
    userNames[Math.floor(Math.random() * userNames.length)]
  );
  const [showVideo, setShowVideo] = useState(false);
  const [showScreen, setShowScreen] = useState(false);

  const {
    askPermission: askCameraPermission,
    isRecording: isCameraRecording,
    startRecording: startCameraRecording,
    stopRecording: stopCameraRecording,
    sourceMedia: cameraSourceMedia,
  } = useRecording("audio/video", userName);

  const {
    askPermission: askScreenPermission,
    isRecording: isScreenRecording,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    sourceMedia: screenSourceMedia,
  } = useRecording("screen", `${userName}-screen`);

  const handleShowVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleShowScreen = () => {
    setShowScreen(!showScreen);
  };

  const handleAskPermissions = async () => {
    askCameraPermission();
    askScreenPermission();
  };

  const handleStartRecording = async () => {
    startCameraRecording();
    startScreenRecording();
  };

  const handleStopRecording = async () => {
    stopCameraRecording();
    stopScreenRecording();
  };

  return (
    <React.Fragment>
      <h1 className={styles.title}>{userName}</h1>
      <div className={styles.videoContainer}>
        <div className={styles.videoBlock}>
          <VideoPlayer
            srcObject={showVideo ? cameraSourceMedia : null}
          ></VideoPlayer>
          <p>Camera recording {`${isCameraRecording}`}</p>
          <div>
            <span>Show camera feedback </span>
            <input
              type="checkbox"
              id="topping"
              name="topping"
              value="Camera"
              checked={showVideo}
              onChange={handleShowVideo}
            />
          </div>
        </div>

        <div className={styles.videoBlock}>
          <VideoPlayer
            srcObject={showScreen ? screenSourceMedia : null}
          ></VideoPlayer>
          <p>Screen recording {`${isScreenRecording}`}</p>
          <div>
            <span>Show screen feedback </span>
            <input
              type="checkbox"
              id="topping"
              name="topping"
              value="Screen"
              checked={showScreen}
              onChange={handleShowScreen}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={handleAskPermissions}>Ask Permissions</button>
        <button onClick={handleStartRecording}>Start recording</button>
        <button onClick={handleStopRecording}>Stop recording</button>
      </div>
    </React.Fragment>
  );
};
