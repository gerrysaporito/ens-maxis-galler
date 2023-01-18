import {
  Text,
  Flex,
  Grid,
  IconButton,
  SimpleGrid,
  Spinner,
  Button,
  Input,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ImShuffle } from 'react-icons/im';

import { FadeFrom } from '../animation/FadeFrom';
import { NftCard } from '../pure/NftCard';
import { useIsMobile } from '@app/hooks/useIsMobile';
import { usePaginationController } from '@app/hooks/usePaginationController';
import { Attributes } from '@app/interface/attributes';
import {
  ENS_MAXIS_CONTRACT_ADDRESS,
  OrderType,
} from '@app/interface/constants';
import type { INft } from '@app/interface/nft';
import { ROUTE_GET_NFTS_BY_METADATA } from '@app/interface/routes';
import { asyncDelayMs } from '@app/lib/asyncDelayMs';
import { fetchClient } from '@app/lib/client';
import { handleError } from '@app/lib/handleError';
import type {
  PostNftsBodyType,
  IGetNfts,
} from '@app/pages/api/2023-01-14/nfts';

const AttributesObject = Attributes.toObject();

interface IGallery {
  searchAttributes: Partial<{
    [key in keyof typeof AttributesObject]: string[];
  }>;
  setSearchAttributes: React.Dispatch<
    React.SetStateAction<
      Partial<{
        [key in keyof typeof AttributesObject]: string[];
      }>
    >
  >;
}

export const Gallery: React.FC<IGallery> = ({
  searchAttributes,
  setSearchAttributes,
}) => {
  const [nfts, setNfts] = useState<INft[]>([]);
  const { isMobile } = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState(OrderType.ASC);
  const [searchTerm, setSearchTerm] = useState('');
  const [reload, setReload] = useState(false);
  const {
    limitPerPage,
    pageNumber,
    PageChangeSelector,
    PageController,
    setPageNumber,
    setResultsSize,
  } = usePaginationController({ collectionSize: 10_000 });

  // Reset the page number whenever the search term updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPageNumber(1), [searchAttributes]);

  // Query new NFT data anytime the params change.
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const jsonBody: PostNftsBodyType = {
        contractAddress: ENS_MAXIS_CONTRACT_ADDRESS,
        limitPerPage,
        pageNumber,
        searchAttributes,
        orderType,
        searchTerm,
      };

      try {
        const result = await fetchClient<IGetNfts>({
          endpoint: ROUTE_GET_NFTS_BY_METADATA,
          method: 'post',
          jsonBody,
        });
        if (!result.success) {
          console.error({ result });
          setIsLoading(false);
          return;
        }

        setNfts(result.data.nfts);
        setResultsSize(result.data.totalCount);
      } catch (e) {
        handleError({
          e,
          failedTo: 'get all NFTs on gallery page load',
        });
      }

      // Make the user feel like the page is loading.
      await asyncDelayMs(500 + Math.random() * 500);
      setIsLoading(false);
    })();
  }, [
    limitPerPage,
    pageNumber,
    searchAttributes,
    reload,
    orderType,
    searchTerm,
    setPageNumber,
    setResultsSize,
  ]);

  const cards = nfts.map((nft) => (
    <NftCard key={nft.metadata.name} nft={nft} />
  ));

  const actionButtons = (
    <>
      <Text as='span'>
        <ShuffleButton
          setReload={setReload}
          setOrderType={setOrderType}
          setPageNumber={setPageNumber}
        />
      </Text>
      <Text as='span'>
        <ClearSearchButton
          setReload={setReload}
          setOrderType={setOrderType}
          setSearchAttributes={setSearchAttributes}
          setSearchTerm={setSearchTerm}
          setPageNumber={setPageNumber}
        />
      </Text>
    </>
  );

  const pageSelectors = (
    <>
      <Text as='span' pr={isMobile ? '1' : '5'}>
        <PageChangeSelector />
      </Text>

      <Flex
        flexDirection='column'
        pr={isMobile ? '0' : '5'}
        justifyContent='center'
      >
        <PageController isDropdown />
      </Flex>
    </>
  );

  const searchInput = (
    <SearchTermInput
      setReload={setReload}
      setOrderType={setOrderType}
      setSearchTerm={setSearchTerm}
      searchTerm={searchTerm}
      setPageNumber={setPageNumber}
    />
  );

  return (
    <Grid
      w='full'
      gap='5'
      overflowY='scroll'
      sx={{ '::-webkit-scrollbar': { display: 'none' } }}
      id='gallery'
    >
      <Stack>
        <Flex justifyContent={isMobile ? 'space-between' : 'flex-start'}>
          {!isMobile && pageSelectors}
          {!isMobile && searchInput}
          {!isMobile && actionButtons}
          {isMobile && (
            <>
              {pageSelectors}
              <Flex justifyContent='flex-end'>{actionButtons}</Flex>
            </>
          )}
        </Flex>
        {isMobile && <Text as='span'>{searchInput}</Text>}
        {/* {isMobile && <Flex justifyContent='flex-end'>{actionButtons}</Flex>} */}
      </Stack>
      {isLoading ? (
        <Flex justifyContent='center' alignItems='center' h='200px'>
          <Spinner />
        </Flex>
      ) : (
        <FadeFrom direction='bottom'>
          <SimpleGrid columns={{ sm: 2, md: 4 }} gap='8' flex='1'>
            {cards}
          </SimpleGrid>
          <Flex flexDirection='column' pt='5' pb='10' justifyContent='center'>
            <PageController />
          </Flex>{' '}
        </FadeFrom>
      )}
    </Grid>
  );
};

interface IShuffleButton {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}
const ShuffleButton: React.FC<IShuffleButton> = ({
  setReload,
  setOrderType,
  setPageNumber,
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setReload((prev) => !prev);
    setOrderType(OrderType.SHUFFLE);
    setPageNumber(1);
  };

  return (
    <Tooltip label='Get random NFTs for your selected filter parameters.'>
      <IconButton
        onClick={onClick}
        aria-label='Join our Discord Community'
        variant='ghost'
        icon={<ImShuffle />}
      />
    </Tooltip>
  );
};

interface IClearSearchButton {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setSearchAttributes: React.Dispatch<
    React.SetStateAction<
      Partial<{
        [key in keyof typeof AttributesObject]: string[];
      }>
    >
  >;
}
const ClearSearchButton: React.FC<IClearSearchButton> = ({
  setReload,
  setOrderType,
  setSearchAttributes,
  setSearchTerm,
  setPageNumber,
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setReload((prev) => !prev);
    setOrderType(OrderType.ASC);
    setSearchAttributes({});
    setSearchTerm('');
    setPageNumber(1);
  };

  return (
    <Tooltip label='Clear filter parameters.'>
      <Button onClick={onClick} variant='ghost'>
        Clear
      </Button>
    </Tooltip>
  );
};

interface ISearchTermInput {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  setSearchTerm: React.Dispatch<string>;
  searchTerm: string;
}
const SearchTermInput: React.FC<ISearchTermInput> = ({
  setReload,
  setOrderType,
  setSearchTerm,
  searchTerm,
  setPageNumber,
}) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setReload((prev) => !prev);
    setOrderType(OrderType.ASC);
    setSearchTerm(e.target.value);
    setPageNumber(1);
  };

  return (
    <Input
      value={searchTerm}
      onChange={onChange}
      w='full'
      placeholder='Search by...'
    />
  );
};
