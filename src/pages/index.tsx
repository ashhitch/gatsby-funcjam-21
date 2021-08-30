/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef, useState } from 'react';
import 'tracking';
import 'tracking/build/data/face';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';

import { styleReset, Window, WindowHeader, WindowContent, Button, Panel, Hourglass } from 'react95';
import original from 'react95/dist/themes/original';
import msSansSerif from 'react95/dist/fonts/ms_sans_serif.woff2';
import msSansSerifBold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import { UvResult, UvResults } from '../types';
import Glasses from '../images/glasses.png';
import Cloud from '../images/cloud.png';
import Details from '../components/Details';
import { Canvas } from '../components/Canvas';
import { Start } from '../components/Start';
import { Error } from '../components/Error';
import { isBrowser } from '../utils/isBrowser';

const uvLevel = 4.5;
const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${msSansSerif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${msSansSerifBold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
    box-sizing: border-box;

    * {
    box-sizing: border-box;
  }

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
  box-sizing: border-box;

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: #000;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

export default function App() {
  const cameraOutputRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const tracker = useRef<tracking.ObjectTracker>();
  const trackerTask = useRef<tracking.TrackerTask>();
  const [result, setResult] = useState<UvResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (isBrowser) {
      window.addEventListener('keypress', (e) => {
        if (e.key.toLowerCase() === 'f') {
          setError(undefined);
        }
      });
    }
  }, [isBrowser]);

  const getUV = async ({ latitude, longitude }): Promise<UvResults> => {
    try {
      const res = await fetch(`/api/uv-index?lat=${latitude}&lng=${longitude}`);
      const uv = (await res.json()) as UvResults;
      return uv;
    } catch (e) {
      console.log(e);
      setError(e?.message || 'Something went wrong');
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
    try {
      const pos = await getCoords();

      if (!pos) {
        return;
      }

      const uv = await getUV(pos);
      setResult(uv.result);
      const { uv_max } = uv.result;

      const img = new Image();

      if (uv_max >= uvLevel) {
        img.src = `${Glasses}`;
      } else {
        img.src = `${Cloud}`;
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

      trackerTask.current = window.tracking.track(cameraOutput, tracker.current, {
        camera: true,
      });

      tracker.current.on('track', (event) => {
        contextCurrent.clearRect(0, 0, canvasCurrent.width, canvasCurrent.height);

        event.data.forEach((rect) => {
          contextCurrent.drawImage(img, rect.x, uv_max >= uvLevel ? rect.y : rect.y - 30, rect.width, rect.height / 2);
        });
      });
    } catch (e) {
      console.log(e);
      setError(e?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const stopSream = (videoEl: HTMLVideoElement) => {
    const stream = videoEl.srcObject;
    // now get all tracks
    const tracks = stream?.getTracks();
    // now close each track by having forEach loop
    tracks.forEach((track) => {
      // stopping every track
      track?.stop();
    });
    // assign null to srcObject of video
    videoEl.srcObject = null;
  };

  const handleClose = () => {
    setResult(undefined);
    setLoading(false);
    setError(undefined);
    if (cameraOutputRef.current) {
      stopSream(cameraOutputRef.current);
    }
    trackerTask?.current?.stop();
  };

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        {error && <Error handleClose={handleClose} error={error} />}
        <StyledWindow>
          <Start action={handleGetFace} />
          {loading && <Hourglass size={64} />}
          {!loading && result && (
            <Window resizable className="window">
              <WindowHeader className="window-header">
                <span>UvCheck.exe</span>
                <Button onClick={handleClose}>
                  <span className="close-icon" />
                </Button>
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
