import styled from 'styled-components';
import { lighten } from 'polished';

export const Menu = styled.div(({ theme }) => ({
  boxShadow: ({ theme }) => theme.shadow,
  zIndex: 3,
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  padding: '10px 0',
  background: lighten(0.2, theme.bgBase)
}));

export const MenuItem = styled.button(({ theme }) => ({
  display: 'block',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  padding: '5px 8px',
  fontSize: '0.95rem',
  color: theme.text,
  background: lighten(0.2, theme.bgBase),
  border: 'none',
  ':hover': {
    background: lighten(0.4, theme.bgBase)
  }
}));

export const MenuHr = styled.div({
  width: '100%',
  height: '10px'
});
