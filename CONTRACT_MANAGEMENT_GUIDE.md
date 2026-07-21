# Contract Management Page - Guia de Uso

## Visão Geral
A página de Gerenciamento de Contrato permite que o cliente (Pontal Carapitangui) edite seus dados e configure as opções de pagamento do contrato de prestação de serviços.

## URL de Acesso
```
https://seu-dominio.com/contract-management
```

## Funcionalidades

### 1. Aba "Dados da Empresa"
Permite editar as informações da empresa:
- **Nome do Responsável**: Nome completo do responsável legal
- **CPF/CNPJ**: Documento da empresa
- **Email**: Email de contato
- **Telefone**: Telefone para contato
- **Endereço Completo**: Endereço completo da empresa
- **Valor do Pacote Base**: Valor base do contrato (padrão: R$ 3.500,00)

**Pacote Base Inclui:**
- Website Corporativo
- Cardápio Digital
- Estratégia de Google Ads
- Sistema de Pedidos

### 2. Aba "Opções do Contrato"

#### Módulos Opcionais
- **Sistema de Ingressos e Fichas de Consumo para Eventos**
  - Descrição: Plataforma dedicada à gestão de eventos, incluindo pagamento integrado e painéis de gerenciamento abrangentes
  - Valor: R$ 500,00
  - Checkbox para ativar/desativar

#### Opções de Pagamento

**Opção A: Pagamento à Vista**
- Desconto de 15% no valor total
- Pagamento único via PIX
- Exemplo: Se o total é R$ 4.000, com desconto fica R$ 3.400

**Opção B: Pagamento Parcelado 50/50**
- 50% na assinatura do contrato
- 50% na entrega para aprovação final
- Sem desconto
- Exemplo: Se o total é R$ 4.000, paga R$ 2.000 + R$ 2.000

### 3. Aba "Resumo & Pagamento"
Exibe:
- Resumo completo dos dados da empresa
- Detalhamento de serviços e valores
- Cálculo automático do valor total
- Informações de pagamento (PIX)
- Botões de ação:
  - **Salvar Contrato**: Salva os dados no localStorage
  - **Baixar Contrato**: Gera e baixa um arquivo de texto com o contrato
  - **Editar Dados**: Volta para a aba de dados

## Cálculo Automático de Valores

O sistema calcula automaticamente:

1. **Valor Total** = Pacote Base + Módulos Opcionais
2. **Se Pagamento à Vista:**
   - Desconto = Valor Total × 15%
   - Valor Final = Valor Total - Desconto
3. **Se Pagamento Parcelado:**
   - 1ª Parcela = Valor Total ÷ 2
   - 2ª Parcela = Valor Total ÷ 2

## Dados Salvos
Os dados são salvos no localStorage do navegador com a chave `contractData`. Isso permite que o cliente:
- Volte à página e veja seus dados preenchidos
- Edite os dados a qualquer momento
- Baixe o contrato atualizado

## Informações do Contratante (Pré-preenchidas)
- **Nome**: HUDSON LUIZ DOS SANTOS ARGOLLO
- **Nome Comercial**: CLUBE MKT
- **CPF**: 025.878.755-44
- **Endereço**: Avenida Rio Branco, 225, Centro, Jequié/BA, CEP 45203-011
- **PIX**: hudsonargollo@gmail.com

## Fluxo Recomendado

1. **Preencher Dados**: Acesse a aba "Dados da Empresa" e preencha todas as informações
2. **Escolher Opções**: Vá para "Opções do Contrato" e selecione módulos e forma de pagamento
3. **Revisar Resumo**: Acesse "Resumo & Pagamento" para verificar todos os detalhes
4. **Salvar**: Clique em "Salvar Contrato" para guardar os dados
5. **Baixar**: Clique em "Baixar Contrato" para obter o documento

## Validações

O sistema valida:
- ✓ Nome do Responsável (obrigatório)
- ✓ CPF/CNPJ (obrigatório)
- ✓ Endereço (obrigatório)
- ✓ Email (obrigatório)
- ✓ Valor do Pacote Base (deve ser número)

Se algum campo obrigatório não estiver preenchido, o sistema exibe uma mensagem de erro ao tentar salvar.

## Próximos Passos

Após salvar o contrato, o cliente pode:
1. Enviar o contrato baixado para análise
2. Realizar o pagamento via PIX para o email: hudsonargollo@gmail.com
3. Aguardar a entrega em 2-5 dias úteis

## Suporte

Para dúvidas sobre o contrato, entre em contato via WhatsApp com Hudson Luiz dos Santos Argollo.
