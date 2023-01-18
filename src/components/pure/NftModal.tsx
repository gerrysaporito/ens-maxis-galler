import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Text,
} from '@chakra-ui/react';
import type { SetStateAction } from 'react';

import type { INft } from '@app/interface/nft';
import { ipfsToHttp } from '@app/interface/routes';

interface INftModal {
  nft: INft;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

export const NftModal: React.FC<INftModal> = ({
  nft,
  isModalOpen,
  setIsModalOpen,
}) => {
  const imgSource = nft.metadata.image.includes('ipfs://')
    ? ipfsToHttp(nft.metadata.image)
    : nft.metadata.image;

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{nft.metadata.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={imgSource}
            fallbackSrc='/assets/EnsMaxisLogo.webp'
            alt={nft.metadata.name}
            objectFit='fill'
            w='full'
          />
          <Text fontSize='md'>No. {nft.token_id}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
