import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import jsQR from "jsqr";

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);
  const scanningRef = useRef(true);

  useEffect(() => {
    startCamera();
    return () => {
      scanningRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      setError("Camera access denied");
      console.error(err);
    }
  };

  const scanQRCode = () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code && code.data) {
        console.log("QR Code detected:", code.data);
        scanningRef.current = false;
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        onScan(code.data);
        return;
      }
    }

    requestAnimationFrame(scanQRCode);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white"
        >
          <X className="w-6 h-6" />
        </Button>

        {error && (
          <div className="absolute top-20 left-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 border-4 border-white/70 rounded-2xl shadow-lg" />
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
          <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p className="text-lg font-semibold mb-1">Scanning for QR Code...</p>
          <p className="text-sm opacity-80">Position the code within the frame</p>
        </div>
      </div>
    </div>
  );
}