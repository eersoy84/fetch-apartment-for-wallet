import { Controller, Logger, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { WALLET_REQUEST_TOPIC } from "src/app.constants";
import { FetchApartmentForWalletService } from "./fetch-apartment-for-wallet.service";

@Controller()
export class FetchApartmentForWalletController {
  constructor(private readonly fetchApartmentForWalletService: FetchApartmentForWalletService) {}

  @EventPattern(WALLET_REQUEST_TOPIC)
  handleNftForWalletRequest(@Payload(new ValidationPipe()) data: any) {
    const { value, partition } = data;
    this.fetchApartmentForWalletService.handleApartmentForWalletRequest(value, partition);
  }
}
