import React from 'react';

interface CavasProps {
    cameraOutput: React.RefObject<HTMLVideoElement>;
    canvas: React.RefObject<HTMLCanvasElement>;
}
export const Canvas = ({cameraOutput, canvas}) => {

    return (
    <>
        <Video ref={cameraOutput} autoPlay={true} loop={true} width="640" height="480" />
        <Canvas ref={canvas} width="640" height="480" />
    </>
    )
}