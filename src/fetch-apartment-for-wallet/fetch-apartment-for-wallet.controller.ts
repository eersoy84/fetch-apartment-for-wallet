import { Controller, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { FetchApartmentForWalletService } from "./fetch-apartment-for-wallet.service";

@Controller()
export class FetchApartmentForWalletController {
  constructor(private readonly fetchApartmentForWalletService: FetchApartmentForWalletService) {}

  @EventPattern("fetch.apartment.for.wallet.request")
  handleNftForWalletRequest(@Payload(new ValidationPipe()) data: any) {
    this.fetchApartmentForWalletService.handleApartmentForWalletRequest(data.value);
  }
}
