import styled from 'styled-components/macro';

export const Button = styled.button<{ positive?: boolean; negative?: boolean }>`
  border: none;
  padding: 8px;
  margin: 4px;
  font-size: 16px;
  background: ${({ positive, negative, theme }) => {
    if (positive) {
      return theme.colorConfirm;
    } else if (negative) {
      return theme.colorAlarm;
    } else {
      return '#fafafa';
    }
  }};

  :active {
    opacity: 0.8;
  }
`;

export const SmallButton = styled(Button)`
  padding: 2px 4px;
  font-size: 14px;
`;
