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
  title = 'Sistema Bancario';
  clienteSelecionado: Cliente | null = null;
  mostrarModalCriar: boolean = false;

  onClienteSelecionado(cliente: Cliente | null) {
    this.clienteSelecionado = cliente;
  }

  abrirModalCriarCliente() {
    this.mostrarModalCriar = true;
  }


  fecharModalCriarCliente() {
    this.mostrarModalCriar = false;
  }

 
  onClienteCriado(cliente: Cliente) {
    this.fecharModalCriarCliente();

  }


  fecharModalOperacoes() {
    this.clienteSelecionado = null;
  }

  
  onOperacaoRealizada() {

    this.fecharModalOperacoes();
  }
}
