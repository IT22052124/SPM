import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

const BarcodeScannerComponent = ({ width, height, onUpdate }) => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    const constraints = {
      video: {
        facingMode: "environment",
        width: { ideal: width },
        height: { ideal: height },
      },
    };

    const startScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;

        codeReader.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result, error) => {
            if (result) {
              onUpdate(result.text, result);
            }
            if (error) {
              console.error(error);
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    };

    startScan();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [width, height, onUpdate]);

  return (
    <div style={{ width, height }}>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        autoPlay
        muted
      />
    </div>
  );
};

export default BarcodeScannerComponent;
