import styled from 'styled-components';
import { lighten } from 'polished';

export const Menu = styled.div({
  boxShadow: props => props.theme.shadow,
  zIndex: 3,
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  padding: '10px 0',
  background: props => lighten(0.2, props.theme.bgBase)
});

export const MenuItem = styled.button({
  display: 'block',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  color: props => props.theme.text,
  background: props => lighten(0.2, props.theme.bgBase),
  border: 'none',
  ':hover': {
    background: props => lighten(0.4, props.theme.bgBase)
  }
});

export const MenuHr = styled.div({
  width: '100%',
  height: '10px'
});
