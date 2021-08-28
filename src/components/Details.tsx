import React, { FC } from 'react';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';
import { UvResult } from '../types';
import { getTime } from '../utils/getTime';

interface DetailsProps {
  result: UvResult;
}

const Details: FC<DetailsProps> = ({ result }) => (
  <>
    <Window className="window">
      <WindowHeader active={false} className="window-header">
        <span>details.exe</span>
      </WindowHeader>
      <WindowContent>
        <Table>
          <TableHead>
            <TableRow head>
              <TableHeadCell disabled>Type</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Level</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableDataCell style={{ textAlign: 'center' }}>
                <span role="img" aria-label="Sun rise">
                  😎
                </span>
              </TableDataCell>
              <TableDataCell>Max UV Level</TableDataCell>
              <TableDataCell> {result?.uv_max && <span>{result.uv_max}</span>}</TableDataCell>
            </TableRow>
            <TableRow>
              <TableDataCell style={{ textAlign: 'center' }}>
                <span role="img" aria-label="Sun rise">
                  🌇
                </span>
              </TableDataCell>
              <TableDataCell>Sunrise</TableDataCell>
              <TableDataCell>
                {result?.sun_info?.sun_times && <span> {getTime(result.sun_info.sun_times.sunrise)}</span>}
              </TableDataCell>
            </TableRow>

            <TableRow>
              <TableDataCell style={{ textAlign: 'center' }}>
                <span role="img" aria-label="Sunset">
                  🌆
                </span>
              </TableDataCell>
              <TableDataCell>Sunset</TableDataCell>
              <TableDataCell>
                {result?.sun_info?.sun_times && <span> {getTime(result.sun_info.sun_times.sunset)}</span>}
              </TableDataCell>
            </TableRow>
            <TableRow>
              <TableDataCell style={{ textAlign: 'center' }}>
                <span role="img" aria-label="Sun">
                  🌞
                </span>
              </TableDataCell>
              <TableDataCell>Golden Hour</TableDataCell>
              <TableDataCell>
                {result?.sun_info?.sun_times && <span> {getTime(result.sun_info.sun_times.goldenHour)}</span>}
              </TableDataCell>
            </TableRow>
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
  </>
);

export default Details;
