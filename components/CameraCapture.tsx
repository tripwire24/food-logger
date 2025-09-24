import React, { useRef, useEffect } from 'react';

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void;
    onError: (errorMessage: string) => void;
    onBack: () => void;
}

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);


const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onError, onBack }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const enableCamera = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error('Camera API not available in this browser.');
                }
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                if (err instanceof Error) {
                    onError(`Could not access the camera: ${err.message}. Please check permissions.`);
                } else {
                    onError("Could not access the camera. Please check permissions.");
                }
            }
        };

        enableCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onError]);

    const handleTakePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                onCapture(dataUrl);
            } else {
                onError("Could not get canvas context to take photo.");
            }
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <button onClick={onBack} className="absolute top-4 left-4 p-3 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-colors z-10" aria-label="Go Back">
                <BackArrowIcon/>
            </button>

            <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none"></div>

            <div className="absolute bottom-8 flex justify-center items-center w-full px-4">
                <button
                    onClick={handleTakePhoto}
                    className="w-20 h-20 bg-white rounded-full border-4 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg group"
                    aria-label="Take Photo"
                >
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center transform transition-transform group-hover:scale-90">
                        <div className="w-16 h-16 rounded-full bg-yellow-400 group-hover:bg-yellow-500 transition-colors"></div>
                    </div>
                </button>
            </div>
             <div className="absolute top-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                Point camera at your meal
            </div>
        </div>
    );
};

export default CameraCapture;