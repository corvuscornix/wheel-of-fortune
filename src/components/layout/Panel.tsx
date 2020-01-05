import styled from 'styled-components/macro';
import { handleStylePropValue } from './utils';

interface PanelProps {
  height?: string | number;
  width?: string | number;
}

export const Panel = styled.div<PanelProps>`
  width: ${props => handleStylePropValue(props.width, '100%')};
  height: ${props => handleStylePropValue(props.height, '100%')};
`;
