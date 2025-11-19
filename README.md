# 🚀 **API LogPack — Manual de Instruções (MD Revisado)**

## 📝 **Sumário**

- [🚀 **API LogPack — Manual de Instruções (MD Revisado)**](#-api-logpack--manual-de-instruções-md-revisado)
  - [📝 **Sumário**](#-sumário)
- [**SEÇÃO 1: Introdução ao LogPack**](#seção-1-introdução-ao-logpack)
  - [🔐 **Estrutura de Usuários**](#-estrutura-de-usuários)
  - [📦 **Visão Geral do Estoque**](#-visão-geral-do-estoque)
- [**SEÇÃO 2: Manual da API por Funcionalidade**](#seção-2-manual-da-api-por-funcionalidade)
  - [💼 **Gerente de Produção (Manager)**](#-gerente-de-produção-manager)
    - [**🏭 Gerenciamento de Setores**](#-gerenciamento-de-setores)
    - [**📦 Gerenciamento de Insumos**](#-gerenciamento-de-insumos)
    - [**📨 Pedidos de Funcionários**](#-pedidos-de-funcionários)
    - [**📑 Contestação de Orçamentos**](#-contestação-de-orçamentos)
  - [🛒 **Gerente de Compras (Buyer)**](#-gerente-de-compras-buyer)
    - [**💰 Orçamentos e Renegociação**](#-orçamentos-e-renegociação)
  - [👷 **Funcionário (Employee)**](#-funcionário-employee)
    - [**📨 Solicitação de Insumo**](#-solicitação-de-insumo)
  - [👑 **Administrador (Admin)**](#-administrador-admin)
    - [**👤 Gerenciamento de Usuários**](#-gerenciamento-de-usuários)
  - [⚙ **Rotas Públicas**](#-rotas-públicas)

---

# **SEÇÃO 1: Introdução ao LogPack**

O **LogPack** é um sistema de controle de estoque dinâmico projetado para otimizar a gestão de **Insumos**, combinando monitoramento IoT em tempo real e um fluxo de aprovação estruturado para solicitações, compras e armazenamento.

## 🔐 **Estrutura de Usuários**

Cada usuário possui permissões específicas e claramente definidas:

| Usuário      | Função Primária                      | Ações Principais                                          |
| ------------ | ------------------------------------ | --------------------------------------------------------- |
| **Admin**    | Controle global do sistema           | Gerenciar usuários, ativar/desativar, alterar cargos      |
| **Manager**  | Gestão de setores, insumos e pedidos | Criar/editar setores e insumos, aprovar pedidos           |
| **Buyer**    | Negociação e orçamentos              | Criar orçamentos, renegociar valores, cancelar orçamentos |
| **Employee** | Uso operacional                      | Solicitar insumos quando o volume está baixo              |

---

## 📦 **Visão Geral do Estoque**

* **Setores**: Possuem *nome único* e *tamanho máximo* definido pelo Manager.
* **Insumos**: Cada insumo possui um **SKU único**.

  * Só é permitido criar novo insumo com SKU repetido se o anterior estiver **inativo**.
* **Volume (%)**: Cada setor registra a **porcentagem ocupada** via IoT.
* **Status**: Insumos e setores precisam estar **ATIVOS** para uso.

---

# **SEÇÃO 2: Manual da API por Funcionalidade**

As funcionalidades estão organizadas por tipo de usuário, tornando o entendimento mais intuitivo.

---

## 💼 **Gerente de Produção (Manager)**

Responsável pela estrutura de estoque e fluxo de pedidos.

### **🏭 Gerenciamento de Setores**

| Funcionalidade | Endpoint                         | Descrição                                        |
| -------------- | -------------------------------- | ------------------------------------------------ |
| Criar setor    | `POST /manager/setor`            | Criação de setor com nome único e tamanho máximo |
| Editar nome    | `PUT /manager/setor/name/{id}`   | Edita o nome do setor                            |
| Alterar status | `PUT /manager/setor/status/{id}` | Ativa ou desativa o setor                        |

### **📦 Gerenciamento de Insumos**

| Funcionalidade     | Endpoint                           | Descrição                         |
| ------------------ | ---------------------------------- | --------------------------------- |
| Criar insumo       | `POST /manager/insumo`             | Criação com SKU único             |
| Editar insumo      | `PUT /manager/insumo/{id}`         | Atualização geral de dados        |
| Alterar status     | `PUT /manager/insumo/status/{id}`  | Ativar/inativar insumo            |
| Verificação manual | `PUT /manager/insumo/verify/{id}`  | Salva o dia da verificação        |
| Ajustar capacidade | `PUT /manager/insumo/storage/{id}` | Define o estoque máximo do insumo |

### **📨 Pedidos de Funcionários**

| Funcionalidade         | Endpoint                          | Descrição                                                 |
| ---------------------- | --------------------------------- | --------------------------------------------------------- |
| Listar pedidos         | `GET /manager/pedido`             | Paginação dos pedidos                                     |
| Ver pedido             | `GET /manager/pedido/{id}`        | Recupera um pedido específico                             |
| Aprovar/Negar          | `PUT /manager/pedido/status/{id}` | Aprovação ou negação de pedidos                           |
| Criar Pedido de Compra | `POST /manager/compra/{pedidoId}` | Converte pedido APROVADO em pedido de compra para o Buyer |

### **📑 Contestação de Orçamentos**

| Funcionalidade | Endpoint                                          | Descrição                            |
| -------------- | ------------------------------------------------- | ------------------------------------ |
| Listar         | `GET /manager/orcamentos`                         | Paginação dos orçamentos recebidos   |
| Ver orçamento  | `GET /manager/orcamentos/{orcamentoId}`           | Recupera orçamento                   |
| Contestar      | `PUT /manager/orcamentos/contestar/{orcamentoId}` | Aprovar, negar ou pedir renegociação |

---

## 🛒 **Gerente de Compras (Buyer)**

Lida com orçamentos, fornecedores e renegociações.

### **💰 Orçamentos e Renegociação**

| Funcionalidade     | Endpoint                               | Descrição                       |
| ------------------ | -------------------------------------- | ------------------------------- |
| Listar pedidos     | `GET /buyer/compras`                   | Paginação dos pedidos de compra |
| Ver pedido         | `GET /buyer/compras/{id}`              | Recuperar pedido                |
| Criar orçamento    | `POST /buyer/orcamento/{compraId}`     | Envia orçamento para o Manager  |
| Editar descrição   | `PUT /buyer/orcamento/descricao/{id}`  | Altera descrição inicial        |
| Renegociar valor   | `PUT /buyer/orcamento/renegociar/{id}` | Altera valores do orçamento     |
| Cancelar orçamento | `PUT /buyer/orcamento/cancelar/{id}`   | Cancela orçamento               |

---

## 👷 **Funcionário (Employee)**

Operacional, foco em uso e solicitações.

### **📨 Solicitação de Insumo**

| Funcionalidade   | Endpoint                 | Descrição                                  |
| ---------------- | ------------------------ | ------------------------------------------ |
| Solicitar insumo | `POST /employee/request` | Solicitação gerada quando volume < **35%** |

---

## 👑 **Administrador (Admin)**

Gestão geral do sistema.

### **👤 Gerenciamento de Usuários**

| Funcionalidade  | Endpoint                 | Descrição              |
| --------------- | ------------------------ | ---------------------- |
| Listar usuários | `GET /admin`             | Paginação              |
| Ver usuário     | `GET /admin/{id}`        | Dados de um usuário    |
| Editar usuário  | `PUT /admin/manage/{id}` | Edita nome/cargo       |
| Alterar status  | `PUT /admin/status/{id}` | Ativa/desativa usuário |

---

## ⚙ **Rotas Públicas**

Abertas para qualquer usuário autenticado.

| Funcionalidade  | Endpoint            | Descrição             |
| --------------- | ------------------- | --------------------- |
| Cadastro        | `POST /users`       | Criação de conta      |
| Login           | `POST /users/login` | Autenticação          |
| Atualizar dados | `PUT /users/{id}`   | Editar dados pessoais |
| Listar insumos  | `GET /insumos`      | Paginação             |
| Ver insumo      | `GET /insumos/{id}` | Detalhes              |
| Listar setores  | `GET /setor`        | Paginação             |
| Ver setor       | `GET /setor/{id}`   | Detalhes              |