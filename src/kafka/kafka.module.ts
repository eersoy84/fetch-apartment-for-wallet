import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { FETCH_APARTMENT_DATA_SERVICE } from "src/app.constants";
import { KafkaService } from "./kafka.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FETCH_APARTMENT_DATA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "fetchApartmentForWallet",
            brokers: [process.env.KAFKA_BROKER_URL],
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
