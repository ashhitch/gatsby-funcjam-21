import React, { useRef } from "react"
import { Canvas } from '../components/Canvas';
import 'tracking';
import 'tracking/build/data/face';
import Glasses from '../images/vecteezy_sunglasses_1196758.png';

export default function App() {

  const cameraOutputRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const tracker = useRef<tracking.ObjectTracker>();

  const handleGetFace = () => {


  
 
    const cameraOutput = cameraOutputRef.current;
    const canvasCurrent = canvasRef.current;
    const contextCurrent = canvasCurrent.getContext('2d');

    navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}}).then(function (stream) {
      cameraOutput.srcObject = stream;
    });
   
    const img = new Image();
    img.src = `${Glasses}`;


      tracker.current = new window.tracking.ObjectTracker(['face']);
      tracker.current.setInitialScale(4);
      tracker.current.setStepSize(2);
      tracker.current.setEdgesDensity(0.1);

      window.tracking.track(cameraOutput, tracker.current, {
        camera: true,
      });

      tracker.current.on('track', (event) => {
     
        contextCurrent.clearRect(
          0,
          0,
          canvasCurrent.width,
          canvasCurrent.height
        );

        event.data.forEach((rect) => {
          contextCurrent.drawImage(
            img,
            rect.x,
            rect.y,
            rect.width,
            rect.height  / 2
          );
        
        });
      });
    }


  return (
    <>
    
    <Canvas cameraOutput={cameraOutputRef} canvas={canvasRef} />
    <br />
    <button type="button" onClick={handleGetFace}>Do I need my sunglasses?</button>
    </>
  )
}
