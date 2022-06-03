import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Token } from "@worldwidewebb/shared-messages/nfts";
import { ApartmentForAddressObj, FETCH_APARTMENT_DATA_SERVICE } from "src/app.constants";
import { WalletRequestDto } from "src/dto";
import { MoralisService } from "src/moralis/moralis.service";

@Injectable()
export class FetchApartmentForWalletService {
  protected readonly logger = new Logger(MoralisService.name);
  constructor(
    private moralisService: MoralisService,
    @Inject(FETCH_APARTMENT_DATA_SERVICE) private readonly fetchApartmentDataClient: ClientKafka
  ) {}

  async handleApartmentForWalletRequest(value: WalletRequestDto) {
    //
    const { userId, chain, address } = value;
    const apartmentsForAddress: Token[] = await this.moralisService.fetchApartmentsForAddress(chain, address);
    this.logger.verbose("Emitting apartment for wallet address event...");
    console.log("apartmentsforAddress", apartmentsForAddress);

    apartmentsForAddress.map((apartment: Token) => {
      let apartmentForAddressObj: ApartmentForAddressObj = {
        userId,
        apartment,
      };
      this.fetchApartmentDataClient.emit("apartment.data.request", apartmentForAddressObj);
    });
  }
}
