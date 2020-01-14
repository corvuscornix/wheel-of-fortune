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

export const ConfirmButton = styled(Button)`
  background: ${props => props.theme.colorConfirm};
`;

export const AlarmButton = styled(Button)`
  background: ${props => props.theme.colorAlarm};
`;

export const SmallButton = styled(Button)`
  padding: 4px;
  font-size: 14px;
`;
