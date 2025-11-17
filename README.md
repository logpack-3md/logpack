## 🚀 API LogPack / **MANUAL DE INSTRUÇÕES**

### 📝 SUMÁRIO
- [🚀 API LogPack / **MANUAL DE INSTRUÇÕES**](#-api-logpack--manual-de-instruções)
  - [📝 SUMÁRIO](#-sumário)
- [**SEÇÃO 1: *Introdução ao LogPack***](#seção-1-introdução-ao-logpack)
  - [Estrutura de Usuários](#estrutura-de-usuários)
  - [Visão Geral do Estoque](#visão-geral-do-estoque)
- [**SEÇÃO 2: *Manual da API por Funcionalidade***](#seção-2-manual-da-api-por-funcionalidade)
  - [💼 Gerente de Produção (**Manager**)](#-gerente-de-produção-manager)
  - [🛒 Gerente de Compras (**Buyer**)](#-gerente-de-compras-buyer)
  - [👷 Funcionário (**Employee**)](#-funcionário-employee)
  - [👑 Administrador (**Admin**)](#-administrador-admin)

---

## **SEÇÃO 1: *Introdução ao LogPack***

O LogPack é um sistema de controle de estoque dinâmico, desenhado para otimizar a gestão de **Insumos** através de monitoramento em tempo real (via IoT) e um fluxo de trabalho estruturado para compras e pedidos.

### Estrutura de Usuários

O sistema é segmentado por quatro perfis distintos, cada um com responsabilidades e permissões claras:

| Usuário | Função Primária | Ações Chave |
| :--- | :--- | :--- |
| **Admin** | Gerenciamento do Sistema e Usuários. | Ativar/Inativar usuários, editar funções. |
| **Manager** | Gestão de Produção e Estoque. | Criação/Edição de setores e insumos, aprovação de pedidos. |
| **Buyer** | Gestão de Compras e Orçamentos. | Criação de orçamentos, renegociação, cancelamento de pedidos de compra. |
| **Employee** | Consumo e Solicitação de Insumos. | Editar perfil, solicitar insumos (quando estoque baixo). |

### Visão Geral do Estoque

* **Setores:** O estoque de insumos é dividido em **Setores**, que possuem um **Tamanho Máximo** definido pelo Manager (ex: 4000). Setores precisam ter nomes **únicos**.
* **Insumos:** Cada insumo possui um **SKU** único. Um novo insumo com um SKU já existente só pode ser criado se o insumo original estiver **desabilitado**.
* **Volume:** O sistema armazena a **porcentagem (%) do volume** de insumos dentro de cada setor, permitindo o monitoramento IoT.
* **Status:** Tanto **Setores** quanto **Insumos** devem estar com o status **ATIVO** para serem utilizados no sistema.

---

## **SEÇÃO 2: *Manual da API por Funcionalidade***

Todas as funcionalidades foram separadas e organizadas para maior desempenho e clareza, retornando um maior entendimento sobre a API em si.

### 💼 Gerente de Produção (**Manager**)

O Manager é o responsável pela estrutura e fluxo de pedidos.

| Funcionalidade | Endpoint (Exemplo) | Descrição |
| :--- | :--- | :--- |
| **Gerenciar Setor** | `POST /manager/setor` | **Criar** novo setor (Nome Único, Tamanho Máximo). |
| | `PUT /manager/setor/{id}` | **Editar** nome, Tamanho Máximo e/ou status do setor (Ativar/Inativar). |
| **Gerenciar Insumo** | `POST /manager/insumo` | **Criar** novo insumo com **SKU** único. |
| | `PUT /manager/insumo/{id}` | **Atualizar** informações e **Status** do insumo (Ativar/Inativar). |
| **Pedidos de Compra** | `GET /manager/pedido/solicitacoes` | Visualizar solicitações de insumo (do Employee). |
| | `PUT /pedido/{id}/status` | **Aprovar/Negar** pedidos de solicitação. |
| | `POST /compra` | **Criar Pedido de Compra** a partir de um pedido APROVADO (enviado ao Buyer). |
| **Contestação** | `PUT /compra/{id}/contestar` | Função para **Aprovar**, **Negar** ou **Solicitar Renegociação** após o Buyer retornar o Orçamento. |

### 🛒 Gerente de Compras (**Buyer**)

O Buyer gerencia a aquisição de insumos, focando em negociação e orçamentos.

| Funcionalidade | Endpoint (Exemplo) | Descrição |
| :--- | :--- | :--- |
| **Gerenciar Orçamento** | `GET /compra/pendente` | Receber o **Pedido de Compra** para orçamento. |
| | `PUT /compra/{id}/orcamento` | **Retornar Orçamento** para o Manager. Permite alterar a **descrição** inicial do pedido. |
| **Renegociação** | `PUT /compra/{id}/renegociar` | Acessível após **solicitação de renegociação** do Manager. Permite **Alterar o Valor** do Orçamento ou **Cancelar** o Pedido. |

### 👷 Funcionário (**Employee**)

O Employee é o usuário operacional com funções limitadas, focadas em monitoramento e solicitação.

| Funcionalidade | Endpoint (Exemplo) | Descrição |
| :--- | :--- | :--- |
| **Perfil** | `PUT /perfil` | **Editar** informações do seu próprio perfil. |
| **Solicitação** | `POST /pedido/solicitar` | **Solicitar Insumos** quando o IOT apontar que o volume está **abaixo de 35%**. |

### 👑 Administrador (**Admin**)

O Admin é o guardião do sistema e gerencia o acesso e as funções dos usuários.

| Funcionalidade | Endpoint (Exemplo) | Descrição |
| :--- | :--- | :--- |
| **Gerenciar Usuário** | `PUT /usuario/{id}/status` | **Ativar** novos usuários cadastrados ou **Inativar** usuários existentes. |
| | `PUT /usuario/{id}/funcao` | **Editar** a função (Admin, Manager, Buyer, Employee) de qualquer usuário existente. |