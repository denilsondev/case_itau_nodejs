import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ClienteService, Cliente } from '../../services/cliente';
import { MoedaPipe } from '../../pipes/moeda.pipe';

@Component({
  selector: 'app-operacoes-bancarias',
  templateUrl: './operacoes-bancarias.html',
  styleUrl: './operacoes-bancarias.css',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, MoedaPipe]
})
export class OperacoesBancariasComponent {
  // Input: Cliente selecionado (vem do componente pai)
  @Input() clienteSelecionado: Cliente | null = null;
  
  // Output: Evento emitido quando operação é realizada
  @Output() operacaoRealizada = new EventEmitter<void>();

  // Propriedades do componente
  valor: string = '';
  tipoOperacao: 'deposito' | 'saque' | null = null;
  loading: boolean = false;
  mensagem: string = '';
  sucesso: boolean = false;

  // Propriedade para valor numérico
  valorNumerico: number = 0;

  // Método para verificar se valor é válido
  isValorValido(): boolean {
    this.valorNumerico = this.converterParaNumero(this.valor);
    return this.valorNumerico > 0;
  }

  // Método chamado quando o valor do input muda
  onValorChange() {
    console.log('🚀 onValorChange chamado!');
    console.log('valor atual:', this.valor);
    console.log('tipo do valor:', typeof this.valor);
    
    this.valorNumerico = this.converterParaNumero(this.valor);
    
    console.log('valorNumerico após conversão:', this.valorNumerico);
    console.log('---');
  }

  constructor(private clienteService: ClienteService) {}

  // Método chamado quando o formulário é enviado
  realizarOperacao() {
    // Validar se há cliente selecionado
    if (!this.clienteSelecionado) {
      this.mensagem = 'Nenhum cliente selecionado';
      this.sucesso = false;
      return;
    }

    // Converter valor de string para number
    this.valorNumerico = this.converterParaNumero(this.valor);
    
    // Validar valor
    if (!this.valorNumerico || this.valorNumerico <= 0) {
      this.mensagem = 'Valor deve ser maior que zero';
      this.sucesso = false;
      return;
    }

    // Validar tipo de operação
    if (!this.tipoOperacao) {
      this.mensagem = 'Selecione o tipo de operação';
      this.sucesso = false;
      return;
    }

    // Iniciar loading
    this.loading = true;
    this.mensagem = '';

    // Realizar operação baseada no tipo
    if (this.tipoOperacao === 'deposito') {
      this.realizarDeposito(this.valorNumerico);
    } else if (this.tipoOperacao === 'saque') {
      this.realizarSaque(this.valorNumerico);
    }
  }

  // Realizar depósito
  private realizarDeposito(valor: number) {
    this.clienteService.depositar(this.clienteSelecionado!.id!, valor).subscribe({
      next: (resultado) => {
        this.loading = false;
        this.mensagem = `Depósito de R$ ${this.valorNumerico} realizado com sucesso! Novo saldo: R$ ${resultado.saldo}`;
        this.sucesso = true;
        
        // Limpar formulário
        this.limparFormulario();
        
        // Emitir evento para atualizar lista
        this.operacaoRealizada.emit();
      },
      error: (error) => {
        this.loading = false;
        this.mensagem = `Erro no depósito: ${error.error?.message || error.message}`;
        this.sucesso = false;
      }
    });
  }

  // Realizar saque
  private realizarSaque(valor: number) {
    this.clienteService.sacar(this.clienteSelecionado!.id!, valor).subscribe({
      next: (resultado) => {
        this.loading = false;
        this.mensagem = `Saque de R$ ${this.valorNumerico} realizado com sucesso! Novo saldo: R$ ${resultado.saldo}`;
        this.sucesso = true;
        
        // Limpar formulário
        this.limparFormulario();
        
        // Emitir evento para atualizar lista
        this.operacaoRealizada.emit();
      },
      error: (error) => {
        this.loading = false;
        this.mensagem = `Erro no saque: ${error.error?.message || error.message}`;
        this.sucesso = false;
      }
    });
  }

  // Converter string formatada para number
  converterParaNumero(valorString: string): number {
    console.log('=== INÍCIO converterParaNumero ===');
    console.log('valorString recebido:', valorString);
    console.log('tipo do valorString:', typeof valorString);
    
    if (!valorString) {
      console.log('valorString vazio, retornando 0');
      return 0;
    }
    
    // Simplificar ao máximo - apenas parseFloat
    const resultado = parseFloat(valorString);
    console.log('parseFloat resultado:', resultado);
    console.log('isNaN:', isNaN(resultado));
    
    const final = isNaN(resultado) ? 0 : resultado;
    console.log('valor final retornado:', final);
    console.log('=== FIM converterParaNumero ===');
    
    return final;
  }

  // Limpar formulário
  private limparFormulario() {
    this.valor = '';
    this.tipoOperacao = null;
  }

  // Limpar mensagens
  limparMensagem() {
    this.mensagem = '';
  }

  // Getter para o saldo do cliente selecionado
  get saldoCliente(): number {
    return this.clienteSelecionado?.saldo || 0;
  }
}
