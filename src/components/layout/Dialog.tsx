import styled from 'styled-components/macro';
import { handleStylePropValue } from './utils';

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
  width: ${props => handleStylePropValue(props.width, '50%')};
  height: ${props => handleStylePropValue(props.height, '50%')};
  background: ${props => props.theme.colorBg};
  color: white;
  padding: 24px;
  min-height: 200px;
  min-width: 300px;
  margin: auto;
`;
