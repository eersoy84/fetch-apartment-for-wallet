import { Controller, Logger, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { WALLET_REQUEST_TOPIC } from "src/app.constants";
import { FetchApartmentForWalletService } from "./fetch-apartment-for-wallet.service";

@Controller()
export class FetchApartmentForWalletController {
  constructor(private readonly fetchApartmentForWalletService: FetchApartmentForWalletService) {}

  @EventPattern(WALLET_REQUEST_TOPIC)
  handleNftForWalletRequest(@Payload(new ValidationPipe()) data: any) {
    Logger.verbose("apartment-wallet-request");
    console.log(data);
    this.fetchApartmentForWalletService.handleApartmentForWalletRequest(data.value);
  }
}
