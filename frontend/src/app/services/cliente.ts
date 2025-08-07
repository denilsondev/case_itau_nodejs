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

  private apiUrl: string;

  constructor(private http: HttpClient) {

    this.apiUrl = `http://${window.location.hostname}:8080/api/clientes`;
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  atualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deletarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  depositar(id: number, valor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/depositar`, { valor });
  }

  sacar(id: number, valor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/sacar`, { valor });
  }
}

