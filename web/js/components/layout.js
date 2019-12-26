import styled from 'styled-components';

export const Wrapper = styled.div(({ hideSide }) => ({
  height: '100%',
  display: 'grid',
  gridTemplateRows: '1fr',
  gridTemplateColumns: hideSide ? '1fr' : '1fr 400px'
}));

export const Main = styled.div(({ useTop }) => ({
  height: '100%',
  gridRow: 1,
  gridColumn: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: useTop ? 'flex-start' : 'center'
}));
