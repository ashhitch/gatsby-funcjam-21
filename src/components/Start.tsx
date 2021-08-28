import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { AppBar, Toolbar, TextField, Button, List, ListItem, Divider } from 'react95';
import logoIMG from '../images/glogo.png';

interface StartProps {
  action: any;
}

const StyledStart = styled(AppBar)`
  z-index: 999;
`;
const Start: FC<StartProps> = ({ action }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledStart>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button onClick={() => setOpen(!open)} active={open} style={{ fontWeight: 'bold' }}>
              <img src={logoIMG} alt="react95 logo" style={{ height: '20px', marginRight: 4 }} />
              Start
            </Button>
            {open && (
              <List
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '100%',
                }}
                onClick={() => setOpen(false)}
              >
                <ListItem onClick={action}>
                  <span role="img" aria-label="👨‍💻">
                    😎
                  </span>
                  Do I need Sunglasses?
                </ListItem>
                <ListItem>
                  <a href="https://www.ashleyhitchcock.com">
                    <span role="img" aria-label="👨‍💻">
                      👨‍💻
                    </span>
                    Profile
                  </a>
                </ListItem>
              </List>
            )}
          </div>
        </Toolbar>
      </StyledStart>
    </>
  );
};

export default Start;
