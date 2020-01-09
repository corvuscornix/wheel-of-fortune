import styled from 'styled-components/macro';

export const Button = styled.button<{ background?: string }>`
  border: none;
  padding: 8px;
  margin: 4px;
  font-size: 16px;
  background: ${props => props.background || '#fafafa'};

  :active {
    opacity: 0.8;
  }
`;
