import { Divider, Stack, Flex, Heading, IconButton } from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

import { DropdownCheckbox } from '../pure/DropdownCheckbox';
import { useIsMobile } from '@app/hooks/useIsMobile';
import { Attributes } from '@app/interface/attributes';

const AttributesObject = Attributes.toObject();

interface IFilter {
  searchAttributes: Partial<{
    [key in keyof typeof AttributesObject]: string[];
  }>;
  setSearchAttributes: Dispatch<
    SetStateAction<
      Partial<{
        [key in keyof typeof AttributesObject]: string[];
      }>
    >
  >;
}

export const Filter: React.FC<IFilter> = ({
  searchAttributes,
  setSearchAttributes,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { isMobile } = useIsMobile();

  // Creating the dropdown list of filter values.
  const filters = Object.keys(AttributesObject).map((attrKey, i) => {
    const key = attrKey as keyof typeof AttributesObject;

    const updateSearchOptions = (updatedSearchOptions: string[]) => {
      setSearchAttributes((prev) => {
        const copy = { ...prev };
        copy[key] = updatedSearchOptions;
        return copy;
      });
    };

    return (
      <>
        <DropdownCheckbox
          key={key}
          label={key}
          options={AttributesObject[key]}
          optionsChecked={searchAttributes[key] ?? []}
          setOptionsChecked={updateSearchOptions}
        />
        <Divider key={key + i.toString()} mt='2' mb='2' />
      </>
    );
  });

  return (
    <Flex w='full' justifyContent='center'>
      <Stack w='full'>
        {isMobile ? (
          <Flex align='center'>
            <IconButton
              onClick={() => setIsOpen((prev) => !prev)}
              icon={<FaFilter />}
              aria-label='Filter button'
            />
          </Flex>
        ) : (
          <Heading>FILTER</Heading>
        )}
        {(isOpen || !isMobile) && (
          <>
            <Divider />
            <Flex
              flexDirection='column'
              flex='1'
              overflowY='scroll'
              sx={{
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {filters}
            </Flex>
          </>
        )}
      </Stack>
    </Flex>
  );
};
