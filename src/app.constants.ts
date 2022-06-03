import { CollectionTokens } from "./models/collectionTokens";

export type MoralisAvatarAddress = {
  userId: string;
  ownedCollection: CollectionTokens;
  chain: string;
  address: string;
};
export const FETCH_APARTMENT_DATA_SERVICE = "FETCH_APARTMENT_DATA_SERVICE";
