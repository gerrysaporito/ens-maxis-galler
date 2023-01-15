import { z } from 'zod';

import { Attributes } from './attributes';

/* eslint-disable sonarjs/no-duplicate-string */
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
  attributes: Partial<AttributesType>;
  compiler: string;
  description: string;
  dna: string;
  edition: number;
  image: string;
  name: string;
}

export const AttributesSchema = z.object({
  Avatar: z.enum(Attributes.Avatar),
  Background: z.enum(Attributes.Background),
  'Maxis Ring': z.enum(Attributes.MaxisRing),
  Body: z.enum(Attributes.Body),
  Head: z.enum(Attributes.Head),
  Eyes: z.enum(Attributes.Eyes),
  Mouth: z.enum(Attributes.Mouth),
  Hair: z.enum(Attributes.Hair),
  Clothing: z.enum(Attributes.Clothing),
  Nose: z.enum(Attributes.Nose),
  Eyewear: z.enum(Attributes.Eyewear),
  Accessory: z.enum(Attributes.Accessory),
  Headwear: z.enum(Attributes.Headwear),
});
export type AttributesType = z.infer<typeof AttributesSchema>;
