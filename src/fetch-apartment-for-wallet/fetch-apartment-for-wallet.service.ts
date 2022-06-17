import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Token } from "@worldwidewebb/shared-messages/nfts";
import { ApartmentForAddressObj, APARTMENT_DATA_REQUEST_TOPIC, FETCH_APARTMENT_DATA_SERVICE } from "src/app.constants";
import { WalletRequestDto } from "src/dto";
import { KafkaService } from "src/kafka/kafka.service";
import { MoralisService } from "src/moralis/moralis.service";

@Injectable()
export class FetchApartmentForWalletService {
  protected readonly logger = new Logger(MoralisService.name);
  constructor(
    private moralisService: MoralisService,
    @Inject(FETCH_APARTMENT_DATA_SERVICE) private readonly fetchApartmentDataClient: ClientKafka,
    private readonly kafka: KafkaService
  ) {}

  async handleApartmentForWalletRequest(value: WalletRequestDto, partition: number) {
    const { userId, chain, address } = value;
    const apartmentsForAddress: Token[] = await this.moralisService.fetchApartmentsForAddress(chain, address);
    this.logger.verbose("Emitting apartment for wallet address event...");

    Promise.all(
      apartmentsForAddress.map(async (apartment: Token) => {
        let apartmentForAddressObj: ApartmentForAddressObj = {
          userId,
          apartment,
        };
        await this.kafka.send(APARTMENT_DATA_REQUEST_TOPIC, apartmentForAddressObj, partition);
      })
    );
  }
}
