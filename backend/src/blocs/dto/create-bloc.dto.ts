import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

// You can create an enum for block types for better type safety
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
  url?: string; // For images or external content
}