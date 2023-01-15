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
  metadata: Record<string, unknown>;
  last_token_uri_sync: Date | null;
  last_metadata_sync: Date | null;
  minter_address: string;
}
