import styled from 'styled-components';
import { lighten } from 'polished';

const Alert = styled.div({
  padding: '10px',
  background: props => lighten(0.25, props.theme.bgBase),
  color: props => props.theme.textBase,
  fontSize: '1rem'
});

export default Alert;
