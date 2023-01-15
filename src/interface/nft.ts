export interface INft {
  token_address: string;
  token_id: number;
  amount: number;
  token_hash: string;
  block_number_minted: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string;
  metadata: INftMetadata;
  last_token_uri_sync: Date | null;
  last_metadata_sync: Date | null;
  minter_address: string;
}

export interface INftMetadata {
  attributes: {
    trait_type: (typeof TraitTypesConst)[number];
    value: string;
  }[];
  compiler: string;
  description: string;
  dna: string;
  edition: number;
  image: string;
  name: string;
}

const TraitTypesConst = [
  'Avatar',
  'Background',
  'Maxis Ring',
  'Body',
  'Head',
  'Eyes',
  'Mouth',
  'Hair',
  'Clothing',
  'Nose',
  'Eyewear',
  'Accessory',
  'Headwear',
] as const;
export const TraitTypes = new Set(TraitTypesConst);
