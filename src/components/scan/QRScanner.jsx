import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import jsQR from "jsqr";

export default function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      setError("Camera access denied");
      console.error(err);
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        onScan(code.data);
        return;
      }
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <p className="text-lg mb-4">{error}</p>
            <Button onClick={onClose} variant="outline" className="bg-white">
              Close
            </Button>
          </div>
        )}

        {!error && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 border-white/50 rounded-lg">
                <div className="w-full h-full border-2 border-blue-500 animate-pulse" />
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center text-white">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p className="text-lg font-semibold">Scanning for QR Code...</p>
              <p className="text-sm opacity-80">Position the code within the frame</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}