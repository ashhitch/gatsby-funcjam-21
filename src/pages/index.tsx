/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef, useState } from 'react';
import 'tracking';
import 'tracking/build/data/face';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import { styleReset, Window, WindowHeader, WindowContent, Button, Panel, Hourglass } from 'react95';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import { UvResult, UvResults } from '../types';
import Glasses from '../images/vecteezy_sunglasses_1196758.png';
import Details from '../components/Details';
import { Canvas } from '../components/Canvas';
import Start from '../components/Start';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
  ${styleReset}
`;

const StyledWindow = styled.main`
  padding: 5rem;
  background: teal;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export default function App() {
  const cameraOutputRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const tracker = useRef<tracking.ObjectTracker>();
  const [result, setResult] = useState<UvResult>();
  const [loading, setLoading] = useState(false);

  const getUV = async ({ latitude, longitude }): Promise<UvResults> => {
    try {
      const res = await fetch(`/api/uv-index?lat=${latitude}&lng=${longitude}`);
      const uv = (await res.json()) as UvResults;
      return uv;
    } catch (e) {
      console.log(e);
    }
  };

  const getCoords = async () => {
    setLoading(true);
    const pos = await new Promise((resolve: PositionCallback, reject: PositionErrorCallback) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      longitude: pos.coords.longitude,
      latitude: pos.coords.latitude,
    };
  };

  const handleGetFace = async () => {
    setLoading(true);
    // TODO try catch
    const pos = await getCoords();

    if (!pos) {
      return;
    }

    const uv = await getUV(pos);
    setResult(uv.result);
    const { uv_max } = uv.result;

    const img = new Image();

    if (uv_max >= 4) {
      img.src = `${Glasses}`;
    } else {
      img.src = `${Glasses}`; // TODO change to something else
    }

    setLoading(false);
    const cameraOutput = cameraOutputRef.current;
    const canvasCurrent = canvasRef.current;
    const contextCurrent = canvasCurrent.getContext('2d');

    cameraOutput!.srcObject = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });

    tracker.current = new window.tracking.ObjectTracker(['face']);
    tracker.current.setInitialScale(4);
    tracker.current.setStepSize(2);
    tracker.current.setEdgesDensity(0.1);

    window.tracking.track(cameraOutput, tracker.current, {
      camera: true,
    });

    tracker.current.on('track', (event) => {
      contextCurrent.clearRect(0, 0, canvasCurrent.width, canvasCurrent.height);

      event.data.forEach((rect) => {
        contextCurrent.drawImage(img, rect.x, rect.y, rect.width, rect.height / 2);
      });
    });
  };

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <StyledWindow>
          <Start action={handleGetFace} />
          {loading && <Hourglass size={64} />}
          {!loading && result && (
            <Window resizable className="window">
              <WindowHeader className="window-header">
                <span>UvCheck.exe</span>
              </WindowHeader>

              <WindowContent>
                <Canvas cameraOutput={cameraOutputRef} canvas={canvasRef} />
              </WindowContent>
              <Panel variant="well" className="footer">
                {result?.uv_max ? <span>Your UV Index is {result.uv_max}</span> : <span />}
              </Panel>
            </Window>
          )}

          {!loading && result && <Details result={result} />}
        </StyledWindow>
      </ThemeProvider>
    </>
  );
}
