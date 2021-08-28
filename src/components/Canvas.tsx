import React from 'react';
import styled from 'styled-components';

const StyledWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    height: 800px;
    max-width: 768px;
    overflow: hidden;
  }
`;

const StyledVideo = styled.video`
  width: 640px;
  height: 480px;
  object-fit: cover;
  background-color: #c6c6c6;
`;
const StyledCanvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
    height: 800px;
    max-width: 768px;
    overflow: hidden;
  }
`;

interface CavasProps {
  cameraOutput: React.RefObject<HTMLVideoElement>;
  canvas: React.RefObject<HTMLCanvasElement>;
}

export const Canvas = ({ cameraOutput, canvas }: CavasProps) => (
  <StyledWrap>
    <StyledVideo ref={cameraOutput} autoPlay loop width="640" height="480" />
    <StyledCanvas ref={canvas} width="640" height="480" />
  </StyledWrap>
);
