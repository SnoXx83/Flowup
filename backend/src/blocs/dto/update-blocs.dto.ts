import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBlocDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  content: string;

  @IsString()
  type: string;
}