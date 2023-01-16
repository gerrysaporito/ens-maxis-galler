import { Divider, Heading, Stack, Flex } from '@chakra-ui/react';
import { useState } from 'react';

import { DropdownCheckbox } from '../pure/DropdownCheckbox';
import { Attributes } from '@app/interface/attributes';

export const Filter: React.FC = () => {
  const attributesObject = Attributes.toObject();

  // Attributes used to search NFTs for.
  const [searchAttributes, setSearchAttributes] = useState<
    Partial<{
      [key in keyof typeof attributesObject]: string[];
    }>
  >({});

  console.log(searchAttributes);

  // Creating the dropdown list of filter values.
  const filters = Object.keys(attributesObject).map((attrKey) => {
    const key = attrKey as keyof typeof attributesObject;

    const updateSearchOptions = (updatedSearchOptions: string[]) => {
      setSearchAttributes((prev) => {
        const copy = { ...prev };
        copy[key] = updatedSearchOptions;
        return copy;
      });
    };

    return (
      <DropdownCheckbox
        key={attrKey}
        label={attrKey}
        options={attributesObject[key]}
        optionsChecked={searchAttributes[key] ?? []}
        setOptionsChecked={updateSearchOptions}
      />
    );
  });

  return (
    <Stack>
      <Heading>FILTER</Heading>
      <Divider />
      <Flex flexDirection='column' flex='1'>
        {filters}
      </Flex>
    </Stack>
  );
};
