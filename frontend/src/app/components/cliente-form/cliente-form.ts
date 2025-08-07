import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../../services/cliente';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ClienteFormComponent {
  // Output: Evento emitido quando cliente é criado
  @Output() clienteCriado = new EventEmitter<Cliente>();

  // Propriedades do componente
  cliente: Cliente = { nome: '', email: '' };
  loading: boolean = false;
  mensagem: string = '';
  sucesso: boolean = false;

  constructor(private clienteService: ClienteService) {}


  onSubmit() {

    if (!this.cliente.nome || !this.cliente.email) {
      this.mensagem = 'Por favor, preencha todos os campos';
      this.sucesso = false;
      return;
    }


    if (!this.isValidEmail(this.cliente.email)) {
      this.mensagem = 'Por favor, insira um email válido';
      this.sucesso = false;
      return;
    }


    this.loading = true;
    this.mensagem = '';


    this.clienteService.criarCliente(this.cliente).subscribe({
      next: (novoCliente) => {
        // Sucesso
        this.mensagem = `Cliente ${novoCliente.nome} criado com sucesso!`;
        this.sucesso = true;
        this.loading = false;
        

        this.cliente = { nome: '', email: '' };
        

        this.clienteCriado.emit(novoCliente);
      },
      error: (error) => {
        // Erro
        this.mensagem = `Erro ao criar cliente: ${error.error?.message || error.message}`;
        this.sucesso = false;
        this.loading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  limparMensagem() {
    this.mensagem = '';
  }
}
