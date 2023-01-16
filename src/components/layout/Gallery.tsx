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
  nfts: INft[];
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
  nfts: _nfts,
  searchAttributes,
  setSearchAttributes,
}) => {
  const [nfts, setNfts] = useState(_nfts);
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState(OrderType.ASC);
  const [searchTerm, setSearchTerm] = useState('');
  const [reload, setReload] = useState(false);
  const { limitPerPage, pageNumber, PageChangeSelector, PageController } =
    usePaginationController({ collectionSize: 10_000 });

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
      } catch (e) {
        handleError({
          e,
          failedTo: 'get all NFTs on gallery page load',
        });
      }
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
  ]);

  const cards = nfts.map((nft) => (
    <NftCard key={nft.metadata.name} nft={nft} />
  ));

  return (
    <Grid h='100%' gap='5'>
      <Flex>
        <Text as='span' pr='5'>
          <PageChangeSelector />
        </Text>
        <Text as='span' pr='5'>
          <ShuffleButton setReload={setReload} setOrderType={setOrderType} />
        </Text>
        <Text as='span' pr='5'>
          <SearchTermInput
            setReload={setReload}
            setOrderType={setOrderType}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
        </Text>
        <Text as='span' pr='5'>
          <ClearSearchButton
            setReload={setReload}
            setOrderType={setOrderType}
            setSearchAttributes={setSearchAttributes}
            setSearchTerm={setSearchTerm}
          />
        </Text>
      </Flex>
      {isLoading ? (
        <Flex justifyContent='center' alignItems='center' h='100%'>
          <Spinner />
        </Flex>
      ) : (
        <SimpleGrid columns={{ sm: 2, md: 4 }} gap='8'>
          {cards}
        </SimpleGrid>
      )}
      <Flex pt='5' pb='20' justifyContent='center'>
        <PageController />
      </Flex>
    </Grid>
  );
};

interface IShuffleButton {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
}
const ShuffleButton: React.FC<IShuffleButton> = ({
  setReload,
  setOrderType,
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setReload((prev) => !prev);
    setOrderType(OrderType.SHUFFLE);
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
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setReload((prev) => !prev);
    setOrderType(OrderType.ASC);
    setSearchAttributes({});
    setSearchTerm('');
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
  setSearchTerm: React.Dispatch<string>;
  searchTerm: string;
}
const SearchTermInput: React.FC<ISearchTermInput> = ({
  setReload,
  setOrderType,
  setSearchTerm,
  searchTerm,
}) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setReload((prev) => !prev);
    setOrderType(OrderType.ASC);
    setSearchTerm(e.target.value);
  };

  return (
    <Input value={searchTerm} onChange={onChange} placeholder='Search by...' />
  );
};
