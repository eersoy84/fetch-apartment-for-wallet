import { Module } from "@nestjs/common";
import { FetchApartmentForWalletService } from "./fetch-apartment-for-wallet.service";
import { FetchApartmentForWalletController } from "./fetch-apartment-for-wallet.controller";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MoralisModule } from "src/moralis/moralis.module";
import { FETCH_APARTMENT_DATA_SERVICE } from "src/app.constants";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FETCH_APARTMENT_DATA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "fetchApartmentData",
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          producer: {},
        },
      },
    ]),
    MoralisModule,
    FetchApartmentForWalletModule,
    KafkaModule,
  ],
  controllers: [FetchApartmentForWalletController],
  providers: [FetchApartmentForWalletService],
})
export class FetchApartmentForWalletModule {}
