import {
  Checkbox,
  Stack,
  Flex,
  Button,
  Input,
  Text,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';

interface IDropdownCheckbox {
  options: string[];
  optionsChecked: string[];
  setOptionsChecked: (updatedSearchOptions: string[]) => void;
  label: string;
  icon?: string;
}
export const DropdownCheckbox: React.FC<IDropdownCheckbox> = ({
  options,
  optionsChecked,
  setOptionsChecked,
  label,
  icon,
}) => {
  const [optionsList, setOptionsList] = useState(options);
  const [isHidden, setIsHidden] = useState(false);

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setOptionsList(
      options.filter((option) => option.toLowerCase().includes(e.target.value)),
    );
  };

  const optionsElements = optionsList.map((option) => (
    <Checkbox
      key={option}
      isChecked={optionsChecked.includes(option)}
      name={option}
      onChange={() => {
        if (optionsChecked.includes(option)) {
          optionsChecked.splice(optionsChecked.indexOf(option), 1);
          setOptionsChecked(optionsChecked);
        } else {
          setOptionsChecked([...optionsChecked, option]);
        }
      }}
    >
      {option}
    </Checkbox>
  ));

  return (
    <Stack>
      <Flex justifyContent='space-between' alignItems='center' w='100%'>
        <Text as='span'>
          {icon && <Image src={icon} alt={`${label} icon.`} pr='2' />}
          {label}
        </Text>
        <Button onClick={() => setIsHidden((prev) => !prev)}>+</Button>
      </Flex>
      {!isHidden && (
        <Stack>
          <Input placeholder='Search...' onChange={onSearch} />
          {optionsElements}
        </Stack>
      )}
    </Stack>
  );
};
