import { validate } from 'class-validator';
import { SacarDto } from '../../../../../modules/clientes/dto/operacao/sacar.dto';

describe('SacarDto', () => {
  it('deve ser válido com valor positivo', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = 100.50;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser válido com valor mínimo (0.01)', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = 0.01;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido com valor zero', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = 0;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPositive).toBeDefined();
  });

  it('deve ser inválido com valor negativo', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = -50;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isPositive).toBeDefined();
  });

  it('deve ser inválido com valor menor que 0.01', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = 0.005;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('deve ser inválido com valor não numérico', async () => {
    // Arrange
    const dto = new SacarDto();
    (dto as any).valor = 'não é número';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNumber).toBeDefined();
  });

  it('deve ser inválido sem valor', async () => {
    // Arrange
    const dto = new SacarDto();

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
  });

  it('deve ser válido com valor decimal', async () => {
    // Arrange
    const dto = new SacarDto();
    dto.valor = 123.45;

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });
}); 