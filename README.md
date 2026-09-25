pgdb-ed1

Estudo Dirigido de Programação de Banco de Dados 

PI Programação Banco de Dados — Criação Base de Dados Aplicação Criptomoedas

Universidade Tuiuti do Paraná, Curso Superior de Tecnologia em Análise de Sistemas

Integrantes da equipe
- Lucas Toterol Rodrigues
- Caio Federico Esquivel Lovera Arze
- Fernando Bach
- Douglas Clayton da Silva

Estrutura dos scripts (pasta SQL/)
01_criacao.sql — cria o banco de dados, o schema wallet, as tabelas e os índices.
02_insert.sql — popula as tabelas com dados consistentes.
03_select.sql — lista os dados inseridos, incluindo o saldo atual por cliente (moeda + valor).
04_rollback.sql — desfaz tudo o que foi criado pelo 01_criacao.sql índices, tabelas, schema e banco de dados.

Ordem de execução
01_criacao.sql → 02_insert.sql → 03_select.sql → 04_rollback.sql