import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVendorProductDTO {
  @IsString()
  readonly productName: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly category: string;

  @IsNumber()
  readonly quantity: number;

  @IsString()
  @IsOptional()
  readonly tags?: string;
}
