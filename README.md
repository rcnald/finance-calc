# finance-calculate

`finance-calculate`, uma aplicação que permite o usuário a fazer cálculos financeiros de renda fixa, sendo eles para descobrir tanto, o investimento, renderá, quanto vale hoje, qual a taxa precisa ser alcançada,dentre outros.

Esse foi o meu primeiro projeto "serio" em React e Next.js. Surgindo a partir de uma dificuldade que enfrentei ao tentar realizar cálculos financeiros. Todo o projeto foi elaborado e implementado por mim, desde o conceito até as funcionalidades finais. Essa experiência me permitiu criar uma solução que resolve um problema real de forma prática e eficiente.

# Preview

![Preview](./fiancecalculatepreview.gif)

## Funcionalidades

- **Descobrir Valor Presente:** Permite calcular o valor que você precisa investir hoje para atingir um valor futuro desejado, considerando a taxa periódica de rendimento, o período de investimento e os aportes periódicos.

- **Descobrir Valor Futuro:** Calcula quanto você terá no futuro, dado o valor presente, a taxa periódica de rendimento, o período de investimento e os aportes periódicos realizados ao longo do tempo.
- **Descobrir Taxa Periódica:** Determina a taxa de rendimento necessária para atingir um valor futuro específico, considerando o valor presente, o período de investimento e os aportes periódicos.
- **Descobrir Aportes Periódicos:** Calcula quanto você precisa contribuir regularmente para atingir um valor futuro, considerando o valor presente, a taxa de rendimento e o período de investimento.
- **Descobrir Período de Investimento:** Permite calcular quanto tempo será necessário para atingir um valor futuro, considerando o valor presente, a taxa de rendimento e os aportes periódicos.
- **Adicionais:** Além de tudo isso, ainda podemos, escolher o intervalo dos períodos, se tem ou não incidência de imposto de renda, e o tipo de taxa (indexada, pré-fixada, pos-fixada), junto ao seu benchmark.

## Pré-requisitos

Antes de começar, certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu sistema.

## Como Usar

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/rcnald/finance-calc.git
   # ou
   gh repo clone rcnald/finance-calc
   ```

2. **Entre no diretório do projeto:**
   ```bash
   cd finance-calc
   ```

3. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

4. **Inicie o projeto:**
   ```bash
   npm run dev
   ```
   - O projeto será iniciado na porta [http://localhost:3000](http://localhost:3000) (se disponível).

## Principais Tecnologias Usadas

- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)**
- **[axios](https://axios-http.com/)**
- **[clsx](https://github.com/lukeed/clsx)**
- **[lucide-react](https://lucide.dev/)**
- **[next](https://nextjs.org/)**
- **[react](https://react.dev/)**
- **[react-hook-form](https://react-hook-form.com/)**
- **[recharts](https://recharts.org/)**
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)**
- **[tailwindcss-animate](https://github.com/joe-bell/tailwindcss-animate)**
- **[typescript](https://www.typescriptlang.org/)**
- **[zod](https://zod.dev/)**
- **[ignite-design-system](https://github.com/rcnald/ignite-design-system)**
- **[shadcn/ui](https://ui.shadcn.com/)**