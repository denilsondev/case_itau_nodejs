import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientesService } from '../../../modules/clientes/clientes.service';
import { ClienteRepository } from '../../../modules/clientes/cliente.repository';
import { CreateClienteDto } from '../../../modules/clientes/dto/cliente/create.dto';
import { Cliente } from '../../../modules/clientes/entities/cliente.entity';

describe('ClientesService', () => {
  let service: ClientesService;
  let repository: ClienteRepository;
  let cacheManager: any;

  const mockCliente: Cliente = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    saldo: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    depositarComTransacao: jest.fn(),
    sacarComTransacao: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: ClienteRepository,
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
    repository = module.get<ClienteRepository>(ClienteRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      const createDto: CreateClienteDto = {
        nome: 'João Silva',
        email: 'joao@email.com',
      };

      mockRepository.create.mockResolvedValue(mockCliente);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(cacheManager.del).toHaveBeenCalledWith('clientes:all');
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de clientes do cache', async () => {
      const cachedClientes = [mockCliente];
      mockCacheManager.get.mockResolvedValue(cachedClientes);

      const result = await service.findAll();

      expect(cacheManager.get).toHaveBeenCalledWith('clientes:all');
      expect(result).toBeDefined();
    });

    it('deve buscar do banco quando não há cache', async () => {
      const clientes = [mockCliente];
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findAll.mockResolvedValue(clientes);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith('clientes:all', clientes, 300000);
      expect(result).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('deve retornar cliente por ID', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findById.mockResolvedValue(mockCliente);
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });

    it('deve lançar NotFoundException quando cliente não existe', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Cliente com ID 999 não encontrado');
    });
  });

  describe('update', () => {
    it('deve atualizar cliente com sucesso', async () => {
      const updateDto = { nome: 'João Atualizado' };
      mockRepository.update.mockResolvedValue(mockCliente);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.update(1, updateDto);

      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(cacheManager.del).toHaveBeenCalledWith('cliente:1');
      expect(cacheManager.del).toHaveBeenCalledWith('clientes:all');
      expect(result).toBeDefined();
    });

    it('deve lançar NotFoundException quando cliente não existe', async () => {
      const updateDto = { nome: 'João Atualizado' };
      mockRepository.update.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow('Cliente com ID 999 não encontrado');
    });
  });

  describe('remove', () => {
    it('deve deletar cliente com sucesso', async () => {
      mockRepository.delete.mockResolvedValue(true);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(cacheManager.del).toHaveBeenCalledWith('cliente:1');
      expect(cacheManager.del).toHaveBeenCalledWith('clientes:all');
      expect(result.message).toBe('Cliente deletado com sucesso');
    });

    it('deve lançar NotFoundException quando cliente não existe', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.remove(999)).rejects.toThrow('Cliente com ID 999 não encontrado');
    });
  });

  describe('depositar', () => {
    it('deve realizar depósito com sucesso', async () => {
      const depositarDto = { valor: 500 };
      const resultado = { sucesso: true, novoSaldo: 1500, mensagem: 'Depósito realizado com sucesso' };
      
      mockRepository.depositarComTransacao.mockResolvedValue(resultado);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.depositar(1, depositarDto);

      expect(repository.depositarComTransacao).toHaveBeenCalledWith(1, 500);
      expect(result.message).toBe('Depósito realizado com sucesso');
      expect(result.novoSaldo).toBe(1500);
    });

    it('deve lançar NotFoundException quando cliente não existe', async () => {
      const depositarDto = { valor: 500 };
      const resultado = { sucesso: false, novoSaldo: 0, mensagem: 'Cliente não encontrado' };
      
      mockRepository.depositarComTransacao.mockResolvedValue(resultado);

      await expect(service.depositar(999, depositarDto)).rejects.toThrow('Cliente não encontrado');
    });
  });

  describe('sacar', () => {
    it('deve realizar saque com sucesso', async () => {
      const sacarDto = { valor: 200 };
      const resultado = { sucesso: true, novoSaldo: 800, mensagem: 'Saque realizado com sucesso' };
      
      mockRepository.sacarComTransacao.mockResolvedValue(resultado);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.sacar(1, sacarDto);

      expect(repository.sacarComTransacao).toHaveBeenCalledWith(1, 200);
      expect(result.message).toBe('Saque realizado com sucesso');
      expect(result.novoSaldo).toBe(800);
    });

    it('deve lançar BadRequestException quando saldo insuficiente', async () => {
      const sacarDto = { valor: 2000 };
      const resultado = { sucesso: false, novoSaldo: 1000, mensagem: 'Saldo insuficiente para realizar o saque' };
      
      mockRepository.sacarComTransacao.mockResolvedValue(resultado);

      await expect(service.sacar(1, sacarDto)).rejects.toThrow('Saldo insuficiente para realizar o saque');
    });

    it('deve lançar NotFoundException quando cliente não existe', async () => {
      const sacarDto = { valor: 200 };
      const resultado = { sucesso: false, novoSaldo: 0, mensagem: 'Cliente não encontrado' };
      
      mockRepository.sacarComTransacao.mockResolvedValue(resultado);

      await expect(service.sacar(999, sacarDto)).rejects.toThrow('Cliente não encontrado');
    });
  });
}); 