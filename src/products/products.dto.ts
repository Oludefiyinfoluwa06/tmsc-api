import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

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

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

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
