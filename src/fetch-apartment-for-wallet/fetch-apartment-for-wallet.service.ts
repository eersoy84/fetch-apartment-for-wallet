import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { FETCH_APARTMENT_DATA_SERVICE, MoralisAvatarAddress } from "src/app.constants";
import { NftForWalletRequestDto } from "src/dto";
import { CollectionTokens } from "src/models/collectionTokens";
import { MoralisService } from "src/moralis/moralis.service";

@Injectable()
export class FetchApartmentForWalletService {
  protected readonly logger = new Logger(MoralisService.name);
  constructor(
    private moralisService: MoralisService,
    @Inject(FETCH_APARTMENT_DATA_SERVICE) private readonly fetchApartmentDataClient: ClientKafka
  ) {}

  async handleNftForWalletRequest(value: NftForWalletRequestDto) {
    const { userId, chain, address } = value;
    const moralisAvatarAddresses: CollectionTokens[] = await this.moralisService.fetchAvatarsForAddress(chain, address);
    this.logger.verbose("Apartment For Wallet");

    // moralisAvatarAddresses.map((ownedCollection) => {
    //   let moralisAvatarAddressObj: MoralisAvatarAddress = {
    //     userId,
    //     ownedCollection,
    //     chain,
    //     address,
    //   };
    //   this.fetchApartmentDataClient.emit("apartment.data.request", moralisAvatarAddressObj);
    // });
  }
}
