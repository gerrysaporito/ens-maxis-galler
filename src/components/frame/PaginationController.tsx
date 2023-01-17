import { Grid, Button, Flex, Text, Select } from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';

import { useIsMobile } from '@app/hooks/useIsMobile';
import { useUpdateRouterQuery } from '@app/hooks/useUpdateRouterQuery';

export const PaginationController: React.FC<{
  setPageNumber: Dispatch<SetStateAction<number>>;
  pageNumber: number;
  numPages: number;
  isDropdown?: boolean;
}> = ({ pageNumber, setPageNumber, numPages, isDropdown }) => {
  const { updateRouterQuery } = useUpdateRouterQuery();
  const { isMobile } = useIsMobile();

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

  const onDropdownClick: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setPageNumber(parseInt(e.target.value));

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

  const dropdownOptions = new Array(numPages).fill(0).map((v, i) => (
    <option key={i} value={i + 1}>
      Page {i + 1}
    </option>
  ));

  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      id={`${isMobile && 'mobile-'}pagination-controller`}
    >
      {isDropdown ? (
        <Select value={pageNumber} onChange={onDropdownClick}>
          {dropdownOptions}
        </Select>
      ) : (
        <Grid templateColumns='repeat(7, 1fr)' gap={isMobile ? 2 : 6}>
          {buttons.map(
            ({ text, shouldBeDisabled, currentPage, onClick }, i) => {
              return (
                <Button
                  key={i}
                  size='sm'
                  disabled={shouldBeDisabled && !currentPage}
                  variant={currentPage ? 'solid' : 'ghost'}
                  onClick={onClick}
                  color='black'
                >
                  <Text as='span' fontSize='md'>
                    {shouldBeDisabled &&
                    !currentPage &&
                    !Number.isNaN(parseInt(text))
                      ? ''
                      : text}
                  </Text>
                </Button>
              );
            },
          )}
        </Grid>
      )}
    </Flex>
  );
};
