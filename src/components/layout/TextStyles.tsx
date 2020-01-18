import { styled } from '../../theme/theme';

interface TextProps {
  error?: boolean;
}

export const Text = styled.div<TextProps>`
  color: ${props => {
    if (props.error) {
      return props.theme.color.alarm;
    }

    return props.theme.color.defaultText;
  }};
`;

export const Header2 = styled.h2`
  margin-top: 0;
`;
