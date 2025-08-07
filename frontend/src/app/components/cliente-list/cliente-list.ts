import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../services/cliente';
import { MoedaPipe } from '../../pipes/moeda.pipe';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
  standalone: true,
  imports: [CommonModule, FormsModule, MoedaPipe]
})
export class ClienteListComponent implements OnInit {

  @Output() clienteSelecionadoChange = new EventEmitter<Cliente | null>();


  clientes: Cliente[] = [];
  loading: boolean = false;
  mensagem: string = '';
  sucesso: boolean = false;
  

  editandoCliente: Cliente | null = null;
  clienteEditando: Cliente = { nome: '', email: '' };

  constructor(private clienteService: ClienteService) {}


  ngOnInit() {
    this.carregarClientes();
  }


  carregarClientes() {
    this.loading = true;
    this.mensagem = '';

    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
        this.mensagem = `Carregados ${data.length} cliente(s)`;
        this.sucesso = true;
        
        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          this.mensagem = '';
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.mensagem = `Erro ao carregar clientes: ${error.error?.message || error.message}`;
        this.sucesso = false;
      }
    });
  }


  abrirOperacoes(cliente: Cliente) {

    this.clienteSelecionadoChange.emit(cliente);
  }


  deletarCliente(id: number) {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.loading = true;
      this.mensagem = '';

      this.clienteService.deletarCliente(id).subscribe({
        next: () => {
 
          this.clientes = this.clientes.filter(c => c.id !== id);
          

          if (this.editandoCliente?.id === id) {
            this.editandoCliente = null;
            this.clienteEditando = { nome: '', email: '' };
          }
          
          this.loading = false;
          this.mensagem = 'Cliente deletado com sucesso!';
          this.sucesso = true;
          
 
          setTimeout(() => {
            this.mensagem = '';
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          this.mensagem = `Erro ao deletar cliente: ${error.error?.message || error.message}`;
          this.sucesso = false;
        }
      });
    }
  }

  limparMensagem() {
    this.mensagem = '';
  }


  iniciarEdicao(cliente: Cliente) {
    this.editandoCliente = cliente;
    this.clienteEditando = { 
      nome: cliente.nome, 
      email: cliente.email 
    };
    this.mensagem = '';
  }


  cancelarEdicao() {
    this.editandoCliente = null;
    this.clienteEditando = { nome: '', email: '' };
    this.mensagem = '';
  }

  salvarEdicao() {
    if (!this.editandoCliente) return;


    if (!this.clienteEditando.nome || !this.clienteEditando.email) {
      this.mensagem = 'Por favor, preencha todos os campos';
      this.sucesso = false;
      return;
    }


    if (!this.isValidEmail(this.clienteEditando.email)) {
      this.mensagem = 'Por favor, insira um email válido';
      this.sucesso = false;
      return;
    }

    this.loading = true;
    this.mensagem = '';

    this.clienteService.atualizarCliente(this.editandoCliente.id!, this.clienteEditando).subscribe({
      next: (clienteAtualizado) => {

        const index = this.clientes.findIndex(c => c.id === clienteAtualizado.id);
        if (index !== -1) {
          this.clientes[index] = clienteAtualizado;
        }


        if (this.editandoCliente?.id === clienteAtualizado.id) {
          this.editandoCliente = clienteAtualizado;
        }

        this.loading = false;
        this.mensagem = 'Cliente atualizado com sucesso!';
        this.sucesso = true;
        this.cancelarEdicao();


        setTimeout(() => {
          this.mensagem = '';
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.mensagem = `Erro ao atualizar cliente: ${error.error?.message || error.message}`;
        this.sucesso = false;
      }
    });
  }


  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
