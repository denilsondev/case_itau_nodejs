import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteFormComponent } from './components/cliente-form/cliente-form';
import { ClienteListComponent } from './components/cliente-list/cliente-list';
import { OperacoesBancariasComponent } from './components/operacoes-bancarias/operacoes-bancarias';
import { Cliente } from './services/cliente';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ClienteFormComponent, ClienteListComponent, OperacoesBancariasComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Sistema Bancario :)';
  clienteSelecionado: Cliente | null = null;
  mostrarModalCriar: boolean = false;

  // Método para receber cliente selecionado da lista
  onClienteSelecionado(cliente: Cliente | null) {
    this.clienteSelecionado = cliente;
  }

  // Método para abrir modal de criar cliente
  abrirModalCriarCliente() {
    this.mostrarModalCriar = true;
  }

  // Método para fechar modal de criar cliente
  fecharModalCriarCliente() {
    this.mostrarModalCriar = false;
  }

  // Método chamado quando cliente é criado
  onClienteCriado(cliente: Cliente) {
    this.fecharModalCriarCliente();
    // Aqui você pode adicionar lógica para recarregar a lista
  }

  // Método para fechar modal de operações
  fecharModalOperacoes() {
    this.clienteSelecionado = null;
  }

  // Método para atualizar lista quando operação é realizada
  onOperacaoRealizada() {
    // Vamos implementar depois para recarregar a lista
    this.fecharModalOperacoes();
  }
}
