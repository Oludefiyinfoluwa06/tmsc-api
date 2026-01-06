import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  IsUrl,
} from 'class-validator';

export enum CenterImageType {
  MACHINE = 'MACHINE',
  TRAINING = 'TRAINING',
}

export class CreateModularCenterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateModularCenterDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class AddCenterImageDto {
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsEnum(CenterImageType)
  @IsOptional()
  type?: CenterImageType;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCenterImageDto {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsEnum(CenterImageType)
  @IsOptional()
  type?: CenterImageType;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ReorderItemsDto {
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];
}
