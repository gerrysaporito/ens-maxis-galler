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
  attributes: IAttributes;
  compiler: string;
  description: string;
  dna: string;
  edition: number;
  image: string;
  name: string;
}
interface IAttributes {
  Avatar: (typeof NftAvatar)[number];
  Background: (typeof NftBackground)[number];
  'Maxis Ring': (typeof NftMaxisRing)[number];
  Body: (typeof NftBody)[number];
  Head: (typeof NftHead)[number];
  Eyes: (typeof NftEyes)[number];
  Mouth: (typeof NftMouth)[number];
  Hair: (typeof NftHair)[number];
  Clothing: (typeof NftClothing)[number];
  Nose: (typeof NftNose)[number];
  Eyewear: (typeof NftEyewear)[number];
  Accessory: (typeof NftAccessory)[number];
  Headwear: (typeof NftHeadwear)[number];
}

export const NftAvatar = [
  'Zombie',
  'Male',
  'Female',
  'AliENS',
  'Panda',
  'Ape',
  'Numbers Guy',
  'Ethmoji',
  'Cheetah',
  'Kangaroo',
] as const;

export const NftBackground = [
  'Bubbles',
  'Purple',
  'Dark Grey',
  'Magenta',
  'Wallpaper',
  'Pink',
  'Orange',
  'Passionfruit',
  'Dark Web',
  'Yellow',
  'Blue',
  'Red',
  'Textured Green',
  'Picasso',
  'Matrix (Gold)',
  'Matrix (Green)',
  'Stars',
  'Space Travel',
] as const;

export const NftMaxisRing = [
  'Golden',
  'Metal',
  'Green',
  'Galaxy',
  'Orange',
  'Trippy',
  'Sky Blue',
  'Charcoal',
  'Crocodile Skin',
  'Aquamarine',
  'Purple',
  'Yellow',
  'Robot',
  'Grey',
  'Pink',
  'Jungle',
  'Electric',
  '420',
  'Magenta',
  'Diamond',
  'Zombie Slayer',
  'Worldwide',
  'Flames',
] as const;

export const NftBody = [
  'Zombie',
  'Dark',
  'Medium',
  'Light',
  'Blue Martian',
  'Panda',
  'Ape',
  'Tatted Ape',
  'Numbers Guy (Medium)',
  'Ethmoji',
  'Cheetah',
  'Kangaroo',
  'Numbers Guy (Light)',
  'Numbers Guy (Dark)',
] as const;

export const NftHead = [
  'Zombie',
  'Dark',
  'Medium',
  'Ear Bitten Off',
  'Light',
  'Blue Martian',
  'Panda',
  'Ape',
  'Beats by Martian',
  'Numbers Guy (Medium)',
  'Ethmoji',
  'Cheetah',
  'You Should See The Other Guy',
  'Numbers Guy (Light)',
  'Kangaroo',
  'Numbers Guy (Dark)',
] as const;

export const NftEyes = [
  'Hanging Eye',
  'Determined',
  'Dafuq',
  'Serious Wink',
  'Stern',
  'Crazed',
  'Stare',
  'Mutation',
  'Furious',
  'Lava',
  'Purple Haze',
  'Angry',
  'Wink',
  'Panda',
  'Rage',
  'White',
  'Lantern',
  'Scar',
  'War',
  'Numbers Guy',
  'Ethmoji',
  'Cheetah',
  'Kangaroo',
  'Kangaroo (Punched)',
] as const;

export const NftMouth = [
  'Cuban',
  'Bubblegum',
  'Smile',
  'Kiss',
  'Bearded Carnivore',
  'Gold Tooth',
  'Pissed',
  'Juicy Lips',
  'Happy',
  'Mutant Drool',
  'Carnivore',
  'Beep-Bop',
  'Cheese',
  'Seductive',
  'Panda',
  'Moustache',
  'Oooo-oo-ahh-ah',
  'Scream',
  'Flesh Eater',
  'Pearly Whites',
  'Laughing',
  'Numbers Guy',
  'Ethmoji',
  'Cheetah',
  'Kangaroo',
  'Kangaroo (Punched)',
] as const;

export const NftHair = [
  'Hazard',
  'Lucky Charms',
  'Afro Puff',
  'Fade',
  'Braids',
  'Fuqboi',
  'Electric Blue',
  'Highlights',
  'Wavy',
  'Octopus',
  'Blue',
  'High Top',
  'Pixie Cut',
  'Chun Li Buns',
  'Bald',
  'Redhead',
  'Fro',
  'Sh-Ape',
  'Pink Hair',
  'Dreads',
  'Great Ape Ponytail',
  'Open Brain',
  'The Dino',
  'Slicked Back',
  'Ponytail',
] as const;

export const NftClothing = [
  'Walking Dead Sheriff',
  'Beach Tank Top',
  'Tube Top',
  'Black Hoodie',
  'Hoodie',
  'Leather Jacket',
  'Kung Fu Suit',
  'ENS Blouse',
  'Punks Jacket',
  'ENS Tank Top',
  'ENS Tactical',
  'ENS Army Tee',
  'Cheongsam',
  'Letterman Jacket',
  'Miami Vibes',
  'Blue Kimono',
  'ENS Tee',
  'Summer Graphic Tee',
  'Orange T-Shirt',
  'Tie-Dye Top',
  'Reptile T-Shirt',
  'Saturn Tank Top',
  'White Tank Top (Ripped)',
  'Ripped',
  'Black T-Shirt',
  'DBZ',
  'Tux',
  'Kandura',
] as const;

export const NftNose = [
  'Zombie Nose',
  'Default',
  'Runny Nose',
  'No Nose Ring',
] as const;

export const NftEyewear = [
  'Punk Glasses',
  'Green Shades',
  'Blue Shades',
  'Futuristic Glasses',
  'Shades',
  'Third Eye',
  'Laugh Tears',
  'Golden Glasses',
  'Steampunk Shades',
] as const;

export const NftAccessory = [
  'Silver Earring',
  'Piercing',
  'Skull Piercing',
  'Hoops',
  'Nose Ring',
  'Gold Nose Ring',
  'FUD U Tattoo',
  'Gold Chain',
  'Gold Earring',
  'Septum Nose Ring',
  'Ginger Goatee',
  'DBZ',
  'Mutant Earwax',
  'Dog Tag',
  'Bamboo',
  'Bitten Coin',
  '10k Earring',
  'Boxing Gloves',
  '999 Set',
] as const;

export const NftHeadwear = [
  'Red Cap',
  'Astro Helmet',
  'Bandana',
  'Ethmoji Hat',
  'Army Helmet',
  'Headphones',
  'Beanie',
  'Cat Ears',
  'Crown',
  'Digital Headwear',
  'QueENS Crown',
  'Heisenberg',
  'Barbed Wire',
  'Banana Sweat Band',
  'Australian Hat',
  'Keffiyeh',
  'Sedge Hat',
  'Poker Hat',
] as const;
