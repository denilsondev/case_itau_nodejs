export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  saldo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateClienteDto {
  nome: string;
  email: string;
}

export interface UpdateClienteDto {
  nome?: string;
  email?: string;
}

export interface DepositarDto {
  valor: number;
}

export interface SacarDto {
  valor: number;
} 