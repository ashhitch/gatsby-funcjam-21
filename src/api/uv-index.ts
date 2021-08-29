import { GatsbyFunctionRequest, GatsbyFunctionResponse } from 'gatsby';
import { UvResults } from '../types/index';

const sampleData: UvResults = {
  result: {
    uv: 0.8736,
    uv_time: '2021-08-26T16:35:10.574Z',
    uv_max: 5.1726,
    uv_max_time: '2021-08-26T12:02:19.553Z',
    ozone: 334.3,
    ozone_time: '2021-08-26T15:04:21.561Z',
    safe_exposure_time: { st1: 191, st2: 229, st3: 305, st4: 382, st5: 611, st6: 1145 },
    sun_info: {
      sun_times: {
        solarNoon: '2021-08-26T12:02:19.553Z',
        nadir: '2021-08-26T00:02:19.553Z',
        sunrise: '2021-08-26T05:04:57.466Z',
        sunset: '2021-08-26T18:59:41.639Z',
        sunriseEnd: '2021-08-26T05:08:29.463Z',
        sunsetStart: '2021-08-26T18:56:09.642Z',
        dawn: '2021-08-26T04:29:53.334Z',
        dusk: '2021-08-26T19:34:45.771Z',
        nauticalDawn: '2021-08-26T03:46:25.941Z',
        nauticalDusk: '2021-08-26T20:18:13.164Z',
        nightEnd: '2021-08-26T02:57:37.415Z',
        night: '2021-08-26T21:07:01.690Z',
        goldenHourEnd: '2021-08-26T05:49:26.940Z',
        goldenHour: '2021-08-26T18:15:12.165Z',
      },
      sun_position: { azimuth: 1.3905429452708598, altitude: 0.37538353566877475 },
    },
  },
};
export default async function handler(req: GatsbyFunctionRequest, res: GatsbyFunctionResponse) {
  const { lat, lng, mock } = req.query;

  console.log(`submitted query`, req?.query);
  console.log(`submitted form`, req.body);
  if (!lat || !lng) {
    res.status(400).send(`lat and lng are required`);
    return;
  }
  // no key just return the test data
  if (!process.env.API_KEY || mock) {
    res.json(sampleData);
  }

  const url = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lng}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-access-token': process.env.API_KEY,
  };

  try {
    const result = await fetch(url, {
      headers,
    });
    res.json(result.json());
  } catch (error) {
    res.status(500).send(error);
  }
}
