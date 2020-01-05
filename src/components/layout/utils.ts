export function handleStylePropValue(
  value: string | number | undefined,
  defValue: string
): string {
  switch (typeof value) {
    case 'number':
      return value + 'px';
    case 'undefined':
      return defValue;
  }

  return value;
}
