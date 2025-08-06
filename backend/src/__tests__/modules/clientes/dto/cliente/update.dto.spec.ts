import { validate } from 'class-validator';
import { UpdateClienteDto } from '../../../../../modules/clientes/dto/cliente/update.dto';

describe('UpdateClienteDto', () => {
  it('deve ser válido com dados completos', async () => {
    // Arrange
    const dto = new UpdateClienteDto();
    dto.nome = 'João Silva Atualizado';
    dto.email = 'joao.novo@email.com';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser válido apenas com nome', async () => {
    // Arrange
    const dto = new UpdateClienteDto();
    dto.nome = 'João Silva Atualizado';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser válido apenas com email', async () => {
    // Arrange
    const dto = new UpdateClienteDto();
    dto.email = 'joao.novo@email.com';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser válido com objeto vazio (todos campos opcionais)', async () => {
    // Arrange
    const dto = new UpdateClienteDto();

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido com nome muito curto', async () => {
    // Arrange
    const dto = new UpdateClienteDto();
    dto.nome = 'A';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBeDefined();
  });

  it('deve ser inválido com email inválido', async () => {
    // Arrange
    const dto = new UpdateClienteDto();
    dto.email = 'email-invalido';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });
}); 