import React from 'react';
import styled from 'styled-components';

import Footer from '../components/footer';
import Player from '../components/youtube-player';

const Wrapper = styled.div({
  height: '100%',
  display: 'grid',
  gridTemplateRows: '1fr',
  gridTemplateColumns: props => (props.hideSide ? '1fr' : '1fr 400px')
});

const Main = styled.div({
  height: '100%',
  gridRow: 1,
  gridColumn: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center'
});

const PlayerItem = styled.div({
  flexBasis: '50%'
});

const Side = styled.div({
  height: '100%',
  gridRow: 1,
  gridColumn: 2
});

const Index = () => {
  const hideSide = false;
  return (
    <>
      <Wrapper hideSide={hideSide}>
        <Main>
          <PlayerItem>
            <Player id="" />
          </PlayerItem>
        </Main>
        {!hideSide && <Side>b</Side>}
      </Wrapper>
      <Footer />
    </>
  );
};

export default Index;
