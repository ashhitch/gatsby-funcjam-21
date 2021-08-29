import React, { FC, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const blink = keyframes`
   66% {
      opacity: 0;
    }
`;

interface OverlayProps {
  vignette?: boolean;
  scanline?: boolean;
}
const StyledOverlay = styled.div<OverlayProps>`
  ${({ vignette, scanline }) => css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    pointer-events: none;

    ${vignette &&
    css`
      background-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 100%);
    `};

    ${scanline &&
    css`
      background-image: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 25%,
        rgba(0, 0, 0, 0.33) 25%,
        rgba(0, 0, 0, 0.33) 50%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0) 75%,
        rgba(0, 0, 0, 0.33) 75%,
        rgba(0, 0, 0, 0.33) 100%
      );
      background-size: 4px 4px;
    `};
  `}
`;

const StyledError = styled.div`
  position: fixed;
  background-color: #00a;
  color: #f1f1f1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .content {
    padding: 3rem 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    max-width: 80vw;
  }

  h1 {
    background-color: silver;
    color: #00a;
    padding: 0 1rem;
    font-size: 1rem;
    display: inline-block;
    margin-bottom: 1rem;
  }

  .blink {
    animation: ${blink} 1s steps(1) infinite;
  }
`;

interface ErrorProps {
  error?: string;
  handleClose: () => void;
}

export const Error: FC<ErrorProps> = ({ error, handleClose }) => (
  <>
    <StyledError onClick={() => handleClose()}>
      <StyledOverlay scanline />
      <StyledOverlay vignette />
      <div className="content">
        <div>
          <h1>Do I need sunglasses</h1>
        </div>
        <p>{error || <>A fatal exception has occurred at ./App.tsx:1. The current website will be terminated.</>}</p>

        <p>
          Press F to continue <span className="blink">_</span>
        </p>
      </div>
    </StyledError>
  </>
);
