import styled from 'styled-components';
import { lighten } from 'polished';

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
  alignContent: 'center'
});

export const Side = styled.div({
  height: '100%',
  gridRow: 1,
  gridColumn: 2,
  background: props => lighten(0.18, props.theme.bgBase),
  boxShadow: props => props.theme.shadow
});
