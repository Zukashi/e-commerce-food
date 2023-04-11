import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;
}
