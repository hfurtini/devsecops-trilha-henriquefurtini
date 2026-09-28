# Onboarding SACI 2026.2 - DevSecOps

## Dados do Candidato
* **Nome:** [Henrique Araújo Furtini]
* **Curso:** [Ciência da computação]
* **Trilha:** DevSecOps

---

## Desafio Técnico Inicial

### Pergunta:
Trilha: 
Pergunta Rápida: Escreva uma breve explicação (COM SUAS PALAVRAS) sobre o que são SAST, DAST, SCA e como cada um deles ajuda no desenvolvimento seguro.

### Resposta:
SAST significa Static Application Security Testing. O objetivo do SAST é analisar o código, sem realizar a execução do mesmo, para tentar encontrar possíveis vulnerabilidades de segurança que poderiam ser corrigidas antes de um eventual merge. Ele evita que vulnerabilidades presentes no código sejam incorporadas ao projeto final.

Já o DAST representa Dynamic Application Security Testing. O DAST funciona em tempo de execução e interage com a aplicação buscando por possíveis falhas referentes ao âmbito da segurança decorrentes dessas interações. Ele permite identificar vulnerabilidades que podem aparecer no comportamento real, incluindo problemas que não são facilmente identificados apenas observando o código em si.

Por fim, o SCA significa Software Composition Analysis. Sua função é analisar possíveis vulnerabilidades em bibliotecas e dependências utilizadas pelo código e, caso existam, o SCA pode recomendar atualizações dessas bibliotecas para versões mais recentes ou seguras. Ele ajuda a identificar dependências com vulnerabilidades conhecidas.