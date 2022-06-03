import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FetchApartmentForWalletModule } from "./fetch-apartment-for-wallet/fetch-apartment-for-wallet.module";

@Module({
  imports: [FetchApartmentForWalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
