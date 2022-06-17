import { ConfigModule } from "@nestjs/config";
import { Token } from "@worldwidewebb/shared-messages/nfts";
ConfigModule.forRoot();

export type ApartmentForAddressObj = {
  userId: string;
  apartment: Token;
};
export const FETCH_APARTMENT_DATA_SERVICE = "FETCH_APARTMENT_DATA_SERVICE";
export const WALLET_REQUEST_TOPIC = process.env.WALLET_REQUEST_TOPIC || "wallet.request";
export const APARTMENT_DATA_REQUEST_TOPIC = process.env.APARTMENT_DATA_REQUEST_TOPIC || "apartment.data.request";

export const NUM_PARTITIONS = parseInt(process.env.NUM_PARTITIONS) || 1;
export const REPLICATION_FACTOR = parseInt(process.env.REPLICATION_FACTOR) || 1;
