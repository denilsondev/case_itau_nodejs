import { validate } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto';

describe('CreateClienteDto', () => {
  it('deve ser válido com dados corretos', async () => {
    // Arrange - Preparar dados válidos
    const dto = new CreateClienteDto();
    dto.nome = 'João Silva';
    dto.email = 'joao@email.com';

    // Act - Executar validação
    const errors = await validate(dto);

    // Assert - Verificar que não há erros
    expect(errors.length).toBe(0);
  });

  it('deve ser inválido com nome vazio', async () => {
    // Arrange - Preparar dados inválidos
    const dto = new CreateClienteDto();
    dto.nome = '';
    dto.email = 'joao@email.com';

    // Act - Executar validação
    const errors = await validate(dto);

    // Assert - Verificar que há erros
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('deve ser inválido com email inválido', async () => {
    // Arrange - Preparar dados inválidos
    const dto = new CreateClienteDto();
    dto.nome = 'João Silva';
    dto.email = 'email-invalido';

    // Act - Executar validação
    const errors = await validate(dto);

    // Assert - Verificar que há erros
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });
}); 