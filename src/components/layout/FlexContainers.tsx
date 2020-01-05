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
  overflow: hidden;
  flex-grow: ${props => props.grow};
  width: ${props => handleStylePropValue(props.width, '100%')};
`;

export const FlexColumn = styled.div<FlexContainerProps>`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex-grow: ${props => props.grow};
  height: ${props => handleStylePropValue(props.height, '100%')};
`;

export const CenterAlign = styled(FlexColumn)`
  width: 100%;
  align-items: center;
`;
