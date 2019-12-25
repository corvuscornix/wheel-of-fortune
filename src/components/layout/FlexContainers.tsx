import styled from 'styled-components';

export const FlexRow = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
`;

export const FlexColumn = styled.div<{ grow?: string }>`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  flex-grow: ${props => props.grow};
`;

export const CenterAlign = styled(FlexColumn)`
  width: 100%;
  align-items: center;
`;
