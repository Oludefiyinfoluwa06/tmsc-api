import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto } from '../products/products.dto';
import { AddCenterImageDto } from '../modular-centers/modular-centers.dto';

describe('DTO Transformations', () => {
  it('should transform CreateProductDto string values to correct types', async () => {
    const plain = {
      slug: 'test-product',
      title: 'Test Product',
      order: '10',
      isActive: 'true',
    };

    const dto = plainToInstance(CreateProductDto, plain);

    expect(typeof dto.order).toBe('number');
    expect(dto.order).toBe(10);
    expect(typeof dto.isActive).toBe('boolean');
    expect(dto.isActive).toBe(true);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should transform AddCenterImageDto string values (false case)', async () => {
    const plain = {
      imageUrl: 'http://example.com/img.jpg',
      order: '5',
      isActive: 'false',
    };

    const dto = plainToInstance(AddCenterImageDto, plain);

    expect(dto.order).toBe(5);
    expect(dto.isActive).toBe(false);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle boolean actual values (not strings)', () => {
    const plain = {
      slug: 'test',
      title: 'Test',
      isActive: true,
    };

    const dto = plainToInstance(CreateProductDto, plain);
    expect(dto.isActive).toBe(true);
  });
});
