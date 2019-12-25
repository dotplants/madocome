import styled from 'styled-components';

export const Wrapper = styled.div({
  height: '100%',
  display: 'grid',
  gridTemplateRows: '1fr',
  gridTemplateColumns: props => (props.hideSide ? '1fr' : '1fr 400px')
});

export const Main = styled.div({
  height: '100%',
  gridRow: 1,
  gridColumn: 1,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: props => (props.useTop ? 'flex-start' : 'center')
});
