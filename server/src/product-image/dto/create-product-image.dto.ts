import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly imageName: string;

  @IsNumber()
  readonly productId: number;
}
