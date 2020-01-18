import styled from 'styled-components/macro';
import { handleStylePropValue } from './utils';

interface FlexContainerProps {
  grow?: string;
  width?: string;
  height?: string;
}

export const FlexRow = styled.div<FlexContainerProps>`
  position: relative;
  display: flex;
  flex-grow: ${props => props.grow};
  width: ${props => handleStylePropValue(props.width, '100%')};
`;

export const FlexColumn = styled.div<FlexContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: ${props => props.grow};
  height: ${props => handleStylePropValue(props.height, 'auto')};
`;

export const CenterAlign = styled(FlexColumn)`
  margin: auto;
  align-items: center;
`;
