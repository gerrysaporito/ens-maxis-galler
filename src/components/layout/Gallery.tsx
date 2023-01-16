import {
  Text,
  Flex,
  Grid,
  IconButton,
  SimpleGrid,
  Spinner,
  Button,
  Input,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ImShuffle } from 'react-icons/im';

import { NftCard } from '../pure/NftCard';
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

  return (
    <Grid
      gap='5'
      h='90vh'
      pr='10'
      overflowY='scroll'
      sx={{ '::-webkit-scrollbar': { display: 'none' } }}
    >
      <Flex>
        <Text as='span' pr='5'>
          <PageChangeSelector />
        </Text>
        <Text as='span' pr='5'>
          <ShuffleButton
            setReload={setReload}
            setOrderType={setOrderType}
            setPageNumber={setPageNumber}
          />
        </Text>
        <Text as='span' pr='5'>
          <SearchTermInput
            setReload={setReload}
            setOrderType={setOrderType}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            setPageNumber={setPageNumber}
          />
        </Text>
        <Text as='span' pr='5'>
          <ClearSearchButton
            setReload={setReload}
            setOrderType={setOrderType}
            setSearchAttributes={setSearchAttributes}
            setSearchTerm={setSearchTerm}
            setPageNumber={setPageNumber}
          />
        </Text>
      </Flex>
      {isLoading ? (
        <Flex justifyContent='center' alignItems='center' h='100%'>
          <Spinner />
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ sm: 2, md: 4 }} gap='8' flex='1'>
            {cards}
          </SimpleGrid>
          <Flex flexDirection='column' pt='5' pb='20' justifyContent='center'>
            <PageController />
          </Flex>
        </>
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
    <IconButton
      onClick={onClick}
      aria-label='Join our Discord Community'
      variant='ghost'
      icon={<ImShuffle />}
    />
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
    <Button onClick={onClick} variant='ghost'>
      Clear
    </Button>
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
    <Input value={searchTerm} onChange={onChange} placeholder='Search by...' />
  );
};
