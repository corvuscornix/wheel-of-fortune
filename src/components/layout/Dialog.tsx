import { handleStylePropValue } from './utils';
import { styled } from '../../theme/theme';

export const Overlay = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  background: rgba(1, 1, 1, 0.3);
  display: flex;
  top: 0;
  left: 0;
  flex-direction: column;
`;

interface DialogProps {
  height?: string | number;
  width?: string | number;
}

export const Dialog = styled.div<DialogProps>`
  width: ${props => handleStylePropValue(props.width, 'auto')};
  height: ${props => handleStylePropValue(props.height, 'auto')};
  background: ${props => props.theme.color.background};
  color: white;
  padding: 24px;
  min-height: 200px;
  min-width: 300px;
  max-height: 100vh;
  max-width: 100vw;
  margin: auto;
`;
