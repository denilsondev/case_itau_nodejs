import { validate } from 'class-validator';
import { CreateClienteDto } from '../../../../../modules/clientes/dto/cliente/create.dto';

describe('CreateClienteDto', () => {
  it('deve ser válido com dados corretos', async () => {
    // Arrange
    const dto = new CreateClienteDto();
    dto.nome = 'João Silva';
    dto.email = 'joao@email.com';

    // Act 
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido com nome vazio', async () => {
    // Arrange
    const dto = new CreateClienteDto();
    dto.nome = '';
    dto.email = 'joao@email.com';

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('deve ser inválido com email inválido', async () => {
    // Arrange
    const dto = new CreateClienteDto();
    dto.nome = 'João Silva';
    dto.email = 'email-invalido';

    // Act 
    const errors = await validate(dto);

    // Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });
}); 