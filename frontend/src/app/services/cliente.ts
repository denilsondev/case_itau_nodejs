import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  saldo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DepositarDto {
  valor: number;
}

export interface SacarDto {
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // private apiUrl = 'http://54.80.160.20:8080/api/clientes';
  private apiUrl = 'http://107.20.56.165:8080/api/clientes';

  constructor(private http: HttpClient) { }

  // Listar todos os clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // Buscar cliente por ID
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Criar novo cliente
  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // Atualizar cliente
  atualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  // Deletar cliente
  deletarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Realizar depósito
  depositar(id: number, valor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/depositar`, { valor });
  }

  // Realizar saque
  sacar(id: number, valor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/sacar`, { valor });
  }
}
