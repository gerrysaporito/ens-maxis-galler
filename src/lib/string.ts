export const formatLeadingZeros = (tokenId: string | number) =>
  `000${tokenId}`.slice(-4);

export const shortenString = (str: string, charLength = 10) =>
  `${str.slice(0, charLength / 2)}...${str.slice(-charLength / 2)}`;
