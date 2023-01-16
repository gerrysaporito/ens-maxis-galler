import { Divider, Heading, Stack, Flex } from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';

import { DropdownCheckbox } from '../pure/DropdownCheckbox';
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
          key={attrKey}
          label={attrKey}
          options={AttributesObject[key]}
          optionsChecked={searchAttributes[key] ?? []}
          setOptionsChecked={updateSearchOptions}
        />
        <Divider key={attrKey + i.toString()} />
      </>
    );
  });

  return (
    <Stack height='90vh' pl='10'>
      <Heading>FILTER</Heading>
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
    </Stack>
  );
};
