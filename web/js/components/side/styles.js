import styled from 'styled-components';
import { lighten } from 'polished';
import { Menu } from '../menu';

export const Side = styled.div(({ theme, isHide }) => ({
  display: isHide ? 'none' : 'grid',
  height: '100vh',
  gridRow: 1,
  gridColumn: 2,
  background: lighten(0.18, theme.bgBase),
  boxShadow: theme.shadow,
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateColumns: '1fr'
}));

export const Selector = styled.div(({ theme }) => ({
  background: lighten(0.25, theme.bgBase),
  boxShadow: theme.shadow,
  gridRow: 1,
  gridColumn: 1,
  padding: '15px 20px',
  cursor: 'pointer'
}));

export const Right = styled.div({
  float: 'right'
});

export const StyledMenu = styled(Menu)({
  bottom: 'initial',
  top: '15px',
  right: '15px',
  width: 400 - 15 * 2
});

export const ColorBlock = styled.span(({ bg }) => ({
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  background: bg
}));

export const PostWrapper = styled.div({
  position: 'relative',
  zIndex: 2
});

export const ScrollToBottom = styled.button(({ isScrolling, theme }) => ({
  zIndex: -1,
  position: 'absolute',
  border: 'none',
  fontSize: '1.5rem',
  color: theme.textBase,
  background: theme.linkBase,
  boxShadow: theme.shadow,
  padding: 10,
  borderRadius: '100%',
  cursor: 'pointer',
  opacity: isScrolling ? 1 : 0,
  top: isScrolling ? -55 : 0,
  left: '50%',
  transform: 'translateX(-50%)'
}));
