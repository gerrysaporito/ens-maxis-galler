export const formatLeadingZeros = (tokenId: string | number) =>
  `000${tokenId}`.slice(-4);
