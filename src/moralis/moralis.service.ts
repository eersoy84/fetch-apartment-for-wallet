import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { models } from "@worldwidewebb/tsoa-shared";
import { CollectionTokens } from "src/models/collectionTokens";
import retry from "async-await-retry";
import Moralis from "moralis/node";
import { Token } from "@worldwidewebb/shared-messages/nfts";
import { WORLDWIDE_WEBB_APARTMENT_ADDRESS } from "src/utils";
import { InternalError } from "@worldwidewebb/tsoa-shared/dist/models";

@Injectable()
export class MoralisService implements OnModuleInit {
  private readonly logger = new Logger(MoralisService.name);
  async onModuleInit() {
    await this.initializeMoralis();
  }

  async initializeMoralis() {
    let moralisSecret = process.env.MORALIS_SECRET;
    let serverUrl = process.env.MORALIS_SERVER_URL;
    if (process.env.MORALIS_SECRET_NAME) {
      this.logger.log("Fetching Moralis Credentials...");
      const secretsClient = new SecretManagerServiceClient();
      const [serverSecretResponse] = await secretsClient.accessSecretVersion({
        name: process.env.MORALIS_SECRET_NAME,
      });
      moralisSecret = serverSecretResponse?.payload?.data?.toString();

      const [serverUrlResponse] = await secretsClient.accessSecretVersion({
        name: process.env.MORALIS_SERVER_URL_SECRET_NAME,
      });
      serverUrl = serverUrlResponse?.payload?.data?.toString();
    }

    await Moralis.start({ serverUrl, moralisSecret });
    this.logger.verbose("Initializing Moralis...");
  }

  async fetchApartmentsForAddress(chain: string, address: string): Promise<Token[]> {
    if (chain != "eth") return [];

    // Paginate Web3API
    const apartments: Token[] = [];
    let total = 0;
    let cursor: string | undefined = undefined;
    do {
      try {
        const data = await retry(
          async () => {
            return await Moralis.Web3API.account.getNFTsForContract({
              chain,
              address,
              token_address: WORLDWIDE_WEBB_APARTMENT_ADDRESS,
              cursor,
            });
          },
          undefined,
          { interval: 2000, retriesMax: 5 }
        );

        if (!data || !data.result) {
          break;
        }
        if (data.total) {
          total = data.total;
        }

        const results = data.result.map((result: any) => ({
          id: result.token_id,
          url: "",
          amount: 1,
          metadata: result.metadata || "",
        }));

        apartments.push(...results);
        cursor = data.cursor;
      } catch (err) {
        console.error(err);
        throw new InternalError();
      }
    } while (apartments.length < total);

    return apartments;
  }
}
