import React from "react"
import { Canvas } from '../components/Canvas';
import 'tracking';
import 'tracking/build/data/face';

export default function App() {

  const cameraOutput = useRef<HTMLVideoElement>();
  const canvas = useRef<HTMLCanvasElement>();


  const handleGetFace = () => {
  const cameraOutput = cameraOutput.current;
  const canvasCurrent: any = canvas.current;
  const contextCurrent = canvasCurrent.getContext('2d');
  let tracker;
 
      const img = new Image();
      img.src = `TODO`;

      tracker = new (window as any).tracking.ObjectTracker('face');
      tracker.setInitialScale(4);
      tracker.setStepSize(2);
      tracker.setEdgesDensity(0.1);

      (window as any).tracking.track(cameraOutput, tracker, {
        camera: true,
      });

      tracker.on('track', (event) => {
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
            rect.height
          );
        
        });
      });
    }


  return (
    <>
    
    <Canvas />
    <button type="button">Do I need my sunglasses?</button>
    </>
  )
}
