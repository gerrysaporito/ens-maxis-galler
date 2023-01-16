import {
  Text,
  Flex,
  Grid,
  IconButton,
  SimpleGrid,
  Spinner,
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
}

export const Gallery: React.FC<IGallery> = ({
  nfts: _nfts,
  searchAttributes,
}) => {
  const [nfts, setNfts] = useState(_nfts);
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState(OrderType.ASC);
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
        console.log(result.data.nfts.length);

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
  }, [limitPerPage, pageNumber, searchAttributes, reload, orderType]);

  const cards = nfts.map((nft) => (
    <NftCard key={nft.metadata.name} nft={nft} />
  ));

  return (
    <Grid h='100%' gap='5'>
      <Flex>
        <Text as='span' pr='5'>
          <PageChangeSelector />
        </Text>
        <Text as='span'>
          <ShuffleButton setReload={setReload} setOrderType={setOrderType} />
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

interface IShuggleButton {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
}
const ShuffleButton: React.FC<IShuggleButton> = ({
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
