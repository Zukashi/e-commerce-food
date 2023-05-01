import { IsNumber } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  readonly quantity: number;
}
