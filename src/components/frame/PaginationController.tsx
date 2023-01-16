import { Grid, Button, Flex } from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';

import { useUpdateRouterQuery } from '@app/hooks/useUpdateRouterQuery';

export const PaginationController: React.FC<{
  setPageNumber: Dispatch<SetStateAction<number>>;
  pageNumber: number;
  numPages: number;
}> = ({ pageNumber, setPageNumber, numPages }) => {
  const { updateRouterQuery } = useUpdateRouterQuery();

  const onPageChangeClick = (
    increment: number,
  ): React.MouseEventHandler<HTMLButtonElement> => {
    return (e) => {
      e.preventDefault();
      setPageNumber((prev) => {
        const val = prev + increment >= 0 ? prev + increment : 0;
        updateRouterQuery({ pageNumber: val.toString() });
        return val;
      });
    };
  };

  interface IButtonMeta {
    text: string;
    shouldBeDisabled: boolean;
    currentPage?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }
  const buttons: IButtonMeta[] = [
    {
      text: 'Prev',
      shouldBeDisabled: pageNumber - 1 < 1,
      onClick: onPageChangeClick(-1),
    },
    {
      text: `${pageNumber - 2}`,
      shouldBeDisabled: pageNumber - 2 < 1,
      onClick: onPageChangeClick(-2),
    },
    {
      text: `${pageNumber - 1}`,
      shouldBeDisabled: pageNumber - 1 < 1,
      onClick: onPageChangeClick(-1),
    },
    {
      text: `${pageNumber}`,
      shouldBeDisabled: true,
      currentPage: true,
    },
    {
      text: `${pageNumber + 1}`,
      shouldBeDisabled: pageNumber + 1 > numPages,
      onClick: onPageChangeClick(1),
    },
    {
      text: `${pageNumber + 2}`,
      shouldBeDisabled: pageNumber + 2 > numPages,
      onClick: onPageChangeClick(2),
    },
    {
      text: `Next`,
      shouldBeDisabled: pageNumber + 1 > numPages,
      onClick: onPageChangeClick(1),
    },
  ];

  return (
    <Flex justifyContent='center' alignItems='center'>
      <Grid templateColumns='repeat(7, 1fr)' gap={6}>
        {buttons.map(({ text, shouldBeDisabled, currentPage, onClick }, i) => {
          return (
            <Button
              key={i}
              disabled={shouldBeDisabled && !currentPage}
              variant={currentPage ? 'solid' : 'ghost'}
              onClick={onClick}
              color='black'
            >
              {shouldBeDisabled && !currentPage ? '' : text}
            </Button>
          );
        })}
      </Grid>
    </Flex>
  );
};
