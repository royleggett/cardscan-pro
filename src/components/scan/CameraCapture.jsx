import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, RotateCw } from "lucide-react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setReady(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const capture = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `card-${Date.now()}.jpg`, { type: "image/jpeg" });
      stopCamera();
      onCapture(file);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-20">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setFacingMode(prev => prev === "environment" ? "user" : "environment")} className="text-white">
          <RotateCw className="w-6 h-6" />
        </Button>
      </div>

      <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />

      <div className="absolute bottom-12 left-0 right-0 p-8 flex justify-center z-20">
        {ready && (
          <button onClick={capture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl">
            <Camera className="w-10 h-10 text-gray-900" />
          </button>
        )}
      </div>
    </div>
  );
}