import { IsNumber, IsString } from 'class-validator';

export class ChangeItemDto {
  @IsNumber()
  readonly quantity: number;
}
