import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ClienteRepository } from '../../../modules/clientes/cliente.repository';
import { Cliente } from '../../../modules/clientes/entities/cliente.entity';
import { CreateClienteDto } from '../../../modules/clientes/dto/cliente/create.dto';

describe('ClienteRepository', () => {
  let repository: ClienteRepository;
  let mockRepository: any;
  let mockDataSource: any;

  const mockCliente: Cliente = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    saldo: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSourceInstance = {
    createQueryRunner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteRepository,
        {
          provide: getRepositoryToken(Cliente),
          useValue: mockTypeOrmRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSourceInstance,
        },
      ],
    }).compile();

    repository = module.get<ClienteRepository>(ClienteRepository);
    mockRepository = module.get(getRepositoryToken(Cliente));
    mockDataSource = module.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os clientes', async () => {
      const clientes = [mockCliente];
      mockRepository.find.mockResolvedValue(clientes);

      const result = await repository.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(clientes);
    });
  });

  describe('findById', () => {
    it('deve retornar cliente por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockCliente);

      const result = await repository.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCliente);
    });

    it('deve retornar null quando cliente não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      const createDto: CreateClienteDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
      };

      mockRepository.findOne.mockResolvedValue(null); // Email não existe
      mockRepository.create.mockReturnValue(mockCliente);
      mockRepository.save.mockResolvedValue(mockCliente);

      const result = await repository.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: createDto.email } });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCliente);
      expect(result).toEqual(mockCliente);
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      const createDto: CreateClienteDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
      };

      const clienteExistente = { ...mockCliente, id: 2 };
      mockRepository.findOne.mockResolvedValue(clienteExistente);

      await expect(repository.create(createDto)).rejects.toThrow('Email já está em uso');
    });
  });

  describe('update', () => {
    it('deve atualizar cliente com sucesso', async () => {
      const updateDto = { nome: 'João Atualizado' };
      mockRepository.findOne.mockResolvedValue(mockCliente);
      mockRepository.save.mockResolvedValue({ ...mockCliente, ...updateDto });

      const result = await repository.update(1, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('deve retornar null quando cliente não existe', async () => {
      const updateDto = { nome: 'João Atualizado' };
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.update(999, updateDto);

      expect(result).toBeNull();
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      const updateDto = { email: 'novo@email.com' };
      mockRepository.findOne.mockResolvedValue(mockCliente);
      
      const clienteComEmail = { ...mockCliente, id: 2, email: 'novo@email.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockCliente) // Primeira chamada (cliente original)
        .mockResolvedValueOnce(clienteComEmail); // Segunda chamada (email já existe)

      await expect(repository.update(1, updateDto)).rejects.toThrow('Email já está em uso');
    });
  });

  describe('findByEmail', () => {
    it('deve retornar cliente por email', async () => {
      mockRepository.findOne.mockResolvedValue(mockCliente);

      const result = await repository.findByEmail('joao@email.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'joao@email.com' } });
      expect(result).toEqual(mockCliente);
    });

    it('deve retornar null quando email não existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('inexistente@email.com');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deve deletar cliente com sucesso', async () => {
      const deleteResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('deve retornar false quando cliente não existe', async () => {
      const deleteResult = { affected: 0 };
      mockRepository.delete.mockResolvedValue(deleteResult);

      const result = await repository.delete(999);

      expect(result).toBe(false);
    });
  });
}); 