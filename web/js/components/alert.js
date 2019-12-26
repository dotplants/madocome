import styled from 'styled-components';
import { lighten } from 'polished';

const Alert = styled.div(({ theme }) => ({
  padding: '10px',
  background: lighten(0.25, theme.bgBase),
  color: theme.textBase,
  fontSize: '1rem'
}));

export default Alert;
