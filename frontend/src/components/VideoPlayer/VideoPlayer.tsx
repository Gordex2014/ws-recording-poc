import { useEffect, useRef } from "react";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  srcObject?: MediaStream | Blob | File | MediaSource | null;
  src?: string;
  controls?: boolean;
}

export const VideoPlayer = ({
  srcObject = null,
  src = "",
  controls = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = srcObject;
    videoRef.current!.autoplay = true;
    videoRef.current!.playsInline = true;
  }, [srcObject]);

  return (
    <video
      className={styles.videoPlayer}
      ref={videoRef}
      src={src}
      controls={controls}
    ></video>
  );
};
