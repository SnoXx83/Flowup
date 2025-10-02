import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum BlocType {
  TEXT = 'text',
  TITLE = 'title',
  IMAGE = 'image',
}

export class CreateBlocDto {
  @IsEnum(BlocType)
  @IsNotEmpty()
  type: BlocType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  url?: string; 
}