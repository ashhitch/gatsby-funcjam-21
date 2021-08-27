/* eslint-disable @typescript-eslint/naming-convention */
import React, { useRef, useState } from 'react';
import { Canvas } from '../components/Canvas';
import 'tracking';
import 'tracking/build/data/face';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import { styleReset, Window, WindowHeader, WindowContent, Button, Panel, Cutout } from 'react95';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import { UvResult, UvResults } from '../types';
import Glasses from '../images/vecteezy_sunglasses_1196758.png';

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
    const pos = await new Promise((resolve: PositionCallback, reject: PositionErrorCallback) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      longitude: pos.coords.longitude,
      latitude: pos.coords.latitude,
    };
  };

  const handleGetFace = async () => {
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

    const cameraOutput = cameraOutputRef.current;
    const canvasCurrent = canvasRef.current;
    const contextCurrent = canvasCurrent.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then((stream) => {
      cameraOutput.srcObject = stream;
    });

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
          <Window resizable className="window">
            <WindowHeader className="window-header">
              <span>UV Check</span>
            </WindowHeader>

            <WindowContent>
              <Canvas cameraOutput={cameraOutputRef} canvas={canvasRef} />
              <br />
              <Button primary type="button" onClick={handleGetFace}>
                Do I need my sunglasses?
              </Button>
            </WindowContent>
            <Panel variant="well" className="footer">
              {result?.uv_max ? <span>Your UV Index is {result.uv_max}</span> : <span>Waiting.</span>}
            </Panel>
          </Window>

          <Window className="window">
            <WindowHeader active={false} className="window-header">
              <span>not-active.exe</span>
              <Button>
                <span className="close-icon" />
              </Button>
            </WindowHeader>
            <WindowContent>
              <Cutout style={{ width: '300px', height: '200px' }}>
                {result?.uv_max && <p>Your UV Index is {result.uv_max}</p>}
                {result?.sun_info?.sun_times && <p>Sunrise {result.sun_info.sun_times.sunrise}</p>}
                {result?.sun_info?.sun_times && <p>Sunset {result.sun_info.sun_times.sunset}</p>}
                {result?.sun_info?.sun_times && <p>Sunset {result.sun_info.sun_times.sunset}</p>}
                {result?.sun_info?.sun_times && <p>Golden Hour {result.sun_info.sun_times.goldenHour}</p>}
              </Cutout>
            </WindowContent>
          </Window>
        </StyledWindow>
      </ThemeProvider>
    </>
  );
}
