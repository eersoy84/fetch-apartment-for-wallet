import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FetchApartmentForWalletModule } from "./fetch-apartment-for-wallet/fetch-apartment-for-wallet.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FetchApartmentForWalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
