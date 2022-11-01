import React from "react";
import { VideoPlayer } from "../../components";
import { useRecording } from "../../hooks";

import styles from "./MainPage.module.css";

export const MainPage = () => {
  const {
    askPermission: askCameraPermission,
    isRecording: isCameraRecording,
    startRecording: startCameraRecording,
    stopRecording: stopCameraRecording,
  } = useRecording("audio/video", "JohnDoe");

  const {
    askPermission: askScreenPermission,
    isRecording: isScreenRecording,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
  } = useRecording("screen", "JohnDoeScreen");

  const handleClick = async () => {
    askCameraPermission();
    askScreenPermission();
  };

  const handleStart = async () => {
    startCameraRecording();
    startScreenRecording();
  };

  const handleStop = async () => {
    stopCameraRecording();
    stopScreenRecording();
  };

  return (
    <React.Fragment>
      <div className={styles.videoContainer}>
        <div className={styles.videoBlock}>
          <VideoPlayer></VideoPlayer>
          <p>Camera recording {`${isCameraRecording}`}</p>
        </div>

        <div className={styles.videoBlock}>
          <VideoPlayer></VideoPlayer>
          <p>Screen recording {`${isScreenRecording}`}</p>
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={handleClick}>Ask Permissions</button>
        <button onClick={handleStart}>Start recording</button>
        <button onClick={handleStop}>Stop recording</button>
      </div>
    </React.Fragment>
  );
};
