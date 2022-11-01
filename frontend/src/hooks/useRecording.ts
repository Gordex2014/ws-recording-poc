import { useEffect, useState } from "react";
import { useSocket } from ".";
import { LQ_VIDEO_CONSTRAINTS, LQ_SCREEN_CONSTRAINTS } from "../constants";
import { SocketEvents } from "../events";

type MediaType = "audio/video" | "screen";
type CurrentPermission = "granted" | "denied" | "prompt" | "unknown" | "screen";

interface ClientMetadata {
  name: string;
}
interface ClientBlob extends ClientMetadata {
  blob: Blob;
}

export const useRecording = (mediaType: MediaType, userName: string) => {
  const [sourceMedia, setSourceMedia] = useState<
    Blob | MediaStream | File | MediaSource | null
  >(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const { connectSocket, disconnectSocket, online, socket } = useSocket();

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket]);

  const askPermission = async () => {
    let stream: MediaStream;

    if (mediaType === "audio/video") {
      stream = await navigator.mediaDevices.getUserMedia(LQ_VIDEO_CONSTRAINTS);
    } else {
      stream = await navigator.mediaDevices.getDisplayMedia(
        LQ_SCREEN_CONSTRAINTS
      );
    }

    setSourceMedia(stream);
  };

  const startRecording = () => {
    let media: MediaRecorder;
    const options: MediaRecorderOptions = {
      mimeType: "video/webm",
    };

    socket?.emit(SocketEvents.START_RECORDING, {
      name: userName,
    });

    try {
      media = new MediaRecorder(sourceMedia as MediaStream, options);
    } catch (error) {
      console.error(error);
      return;
    }

    setIsRecording(true);
    media.onstop = (event) => {
      console.log("Recorder stopped: ", event);
    };
    media.ondataavailable = handleDataAvailable;
    media.start(1000);
    setMediaRecorder(media);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();

    setTimeout(() => {
      socket?.emit(SocketEvents.STOP_RECORDING, {
        name: userName,
      });
      (sourceMedia as MediaStream)
        ?.getTracks()
        .forEach((track) => track.stop());
    }, 2000);
  };

  /**
   * Checks the current permission status for the media type
   * @returns The current permission for camera and microphone, if the stream type is audio/video, otherwise returns "screen".
   * @returns If the user is using a mobile device, a firefox browser or a safari browser, it will return "unknown".
   */
  const checkPermission = async (): Promise<CurrentPermission> => {
    if (mediaType === "audio/video") {
      try {
        const permission = await (navigator.permissions as any).query({
          name: "camera",
        });

        return permission.state as CurrentPermission;
      } catch (error) {
        return "unknown";
      }
    }
    return "screen";
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      socket?.emit(SocketEvents.SEND_BLOB, {
        name: userName,
        blob: event.data,
      });
    }
  };

  return {
    isRecording,
    online,
    sourceMedia,
    askPermission,
    disconnectSocket,
    startRecording,
    stopRecording,
    checkPermission,
  };
};
