import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @Transform(({ value }): number | undefined =>
    value !== undefined && value !== null
      ? parseInt(String(value), 10)
      : undefined,
  )
  @IsInt()
  @IsOptional()
  order?: number;

  @Transform(({ value }): boolean | undefined =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
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

  @Transform(({ value }): number | undefined =>
    value !== undefined && value !== null
      ? parseInt(String(value), 10)
      : undefined,
  )
  @IsInt()
  @IsOptional()
  order?: number;

  @Transform(({ value }): boolean | undefined =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
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

  @Transform(({ value }): number | undefined =>
    value !== undefined && value !== null
      ? parseInt(String(value), 10)
      : undefined,
  )
  @IsInt()
  @IsOptional()
  order?: number;

  @Transform(({ value }): boolean | undefined =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
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

  @Transform(({ value }): number | undefined =>
    value !== undefined && value !== null
      ? parseInt(String(value), 10)
      : undefined,
  )
  @IsInt()
  @IsOptional()
  order?: number;

  @Transform(({ value }): boolean | undefined =>
    value === 'true' || value === true
      ? true
      : value === 'false' || value === false
        ? false
        : undefined,
  )
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ReorderItemsDto {
  @IsString({ each: true })
  @IsNotEmpty()
  ids: string[];
}
