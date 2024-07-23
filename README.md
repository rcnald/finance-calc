# Objetivo
Criar um sistema onde eu posso fazer cálculos financeiros de renda fixa.

## Requisitos

<details>
<summary>Seleção do Tipo de Cálculo</summary>

- Tipo de cálculo:
  - Valor futuro
  - Valor presente
  - Prazo 
  - Taxa
  - Aportes
- Incidência de impostos:
  - Imposto de renda
  - Imposto sobre operação financeira (IOF)

</details>

<details>
<summary>Inserção de Dados pelo Usuário</summary>

- Taxa:
  - Pós-fixada:
    - Selecionar índice (e.g., CDI, IPCA)
    - Taxa
  - Pré-fixada:
    - Taxa
  - Indexada:
    - Selecionar índice (e.g., IPCA, IGPM)
    - Taxa
- Valor inicial (montante investido inicialmente)
- Prazo:
  - Equivalência de tempo do prazo (meses, anos, etc.)
- Valor futuro (opcional, se aplicável)
- Valor dos aportes adicionais (se aplicável):
  - Equivalência de prazo dos aportes (mensal, anual, etc.)
- Cupom de juros (se aplicável):
  - Intervalo de tempo do cupom (mensal, semestral, anual, etc.)

</details>

<details>
<summary>Cálculos Realizados pelo Sistema</summary>

- Valor presente
- Valor futuro
- Valor aplicado (total de aportes realizados)
- Valor em juros (rendimento total)
- Taxa de juros real (considerando a inflação)
- Inflação atual (pode ser um valor inserido pelo usuário ou obtido de uma fonte externa)
- Imposto de renda (considerando a tabela de alíquotas aplicável)

</details>

<details>
<summary>Histórico dos Cálculos</summary>

- Valor presente
- Valor futuro
- Taxa 
- Prazo

</details>

---

## Use Cases

<details>
<summary>Calcular Valor Futuro</summary>

#### Nome:
Calcular valor futuro

#### Descrição:
O usuário quer calcular o valor futuro de um investimento dado o valor inicial, a taxa de juros, o prazo e a periodicidade dos aportes adicionais.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o valor futuro.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor inicial, taxa de juros, prazo, aportes).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta o valor futuro calculado ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.

</details>

</details>

<details>
<summary>Calcular Valor Futuro com Cupom</summary>

#### Nome:
Calcular valor futuro com cupom

#### Descrição:
O usuário quer calcular o valor futuro de um investimento dado o valor inicial, valor atual, taxas, aportes, prazo, e intervalo de cupom de juros.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o valor futuro com cupom.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor inicial, valor atual, taxa, prazo, cupom).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta o valor de aportes calculado ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.

</details>

<details>
<summary>Calcular Valor Presente</summary>

#### Nome:
Calcular valor presente

#### Descrição:
O usuário quer calcular o valor presente de um investimento dado o valor futuro, a taxa de juros, o prazo e a periodicidade dos aportes adicionais.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o valor presente.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor futuro, taxa de juros, prazo, aportes).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta o valor presente calculado ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.

</details>

<details>
<summary>Calcular Taxa</summary>

#### Nome:
Calcular taxa

#### Descrição:
O usuário quer calcular o valor da taxa de um investimento dado o valor futuro, valor atual, o prazo e a periodicidade dos aportes adicionais.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o valor da taxa.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor futuro, valor atual, prazo, aportes).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta a taxa calculada ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.

</details>

<details>
<summary>Calcular Prazo</summary>

#### Nome:
Calcular prazo

#### Descrição:
O usuário quer calcular o prazo de um investimento dado o valor futuro, valor atual, taxa e periodicidade dos aportes adicionais.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o prazo.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor futuro, valor atual, taxa, aportes).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta o prazo calculado ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.
</details>

<details>
<summary>Calcular Valor de Aportes</summary>

#### Nome:
Calcular valor de aportes

#### Descrição:
O usuário quer calcular o valor de aportes de um investimento dado o valor futuro, valor atual, taxas.

#### Ator Principal:
Usuário

#### Fluxo Principal:
1. O usuário seleciona a opção de calcular o valor de aportes.
2. O sistema apresenta um formulário para o usuário inserir os dados necessários (valor futuro, valor atual, taxa, prazo).
3. O usuário preenche o formulário e submete.
4. O sistema realiza os cálculos.
5. O sistema apresenta o valor de aportes calculado ao usuário.

#### Fluxo Alternativo:
3a. O usuário preenche as informações incorretamente:
  - O sistema exibe uma mensagem de erro.
  - O usuário corrige os dados e submete novamente.

#### Pós-condições:
- Valor exibido ao usuário.

</details>

<!-- ## Fluxo -->

<!-- ![alt text](image-5.png) -->

## Regras de Negócio
<details>
<summary>Prazo</summary>

  - O valor do prazo nunca será menor ou igual a 0.
  - O valor padrão de unidade de medida de tempo será mês.
</details>

<details>
<summary>Valores</summary>

  - O valor do valor futuro nunca será menor que o valor do valor presente.
  - O valor inicial só poderá ser 0 se houver aportes.
</details>

<details>
<summary>Taxas</summary>

  - A taxa de juros deve ser um valor positivo.
  - Para taxas pós-fixadas e indexadas, é necessário selecionar um índice de referência.
</details>
  
<details>
<summary>Aportes</summary>

  - Se os aportes forem periódicos, a periodicidade vai ser a mesma informada no prazo.
  - O valor dos aportes adicionais não pode ser negativo.
</details>

<details>
<summary>Cupons de Juros</summary>

  - Se houver cupons de juros, o intervalo de tempo entre eles deve ser especificado (mensal, semestral, anual, etc.).
</details>

<details>
<summary>Impostos</summary>

  - A incidência de imposto de renda e IOF deve ser considerada conforme as normas vigentes.
  - Para o cálculo do imposto de renda, a tabela de alíquotas aplicável deve ser utilizada.

</details>

primeiro mostrar quais os dados ele levou em conta
valor inicial
taxa de * % do * a.*
* aportes de * por *
valor aplicado acumulado
valor do rendimento
valor total
quanto rendeu em %
quanto rendeu em % valor liquido (descontar inflação)
inflação atual
incognita
período