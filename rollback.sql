-- PI - PROGRAMACAO EM BANCO DE DADOS - 2026/02
-- CARTEIRA VIRTUAL (WALLET) - APLICACAO CRIPTOMOEDAS
-- SCRIPT 01 - CRIACAO (BANCO, ESQUEMA, TABELAS, INDICES, DADOS, VISAO E LISTAGENS)
-- EQUIPE:
--   CAIO FEDERICO ESQUIVEL LOVERA ARZE
--   FERNANDO BACH
--   DOUGLAS CLAYTON DA SILVA
--   LUCAS TOTEROL RODRIGUES
--
-- ORDEM INVERSA DA CRIACAO:
--   VISAO -> INDICES -> TABELAS (FILHAS ANTES DAS MAES) -> SCHEMA -> BANCO
-- CADA DROP TESTA SE O OBJETO EXISTE, ENTAO O SCRIPT PODE SER
-- EXECUTADO MAIS DE UMA VEZ SEM ERRO.
USE CarteiraVirtual_CDFL;

GO
-- 1. VISAO (DEPENDE DAS TABELAS; SEM REMOVE-LA O SCHEMA NAO SAI)
IF OBJECT_ID ('wallet.vw_SaldoCliente', 'V') IS NOT NULL
DROP VIEW wallet.vw_SaldoCliente;

-- 2. INDICES
IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_Cliente_Email'
)
DROP INDEX IX_Cliente_Email ON wallet.Cliente;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_Carteira_IdCliente'
)
DROP INDEX IX_Carteira_IdCliente ON wallet.Carteira;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_Carteira_CodigoCorretora'
)
DROP INDEX IX_Carteira_CodigoCorretora ON wallet.Carteira;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_ItemCarteira_IdCarteira'
)
DROP INDEX IX_ItemCarteira_IdCarteira ON wallet.ItemCarteira;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_ItemCarteira_CodigoMoeda'
)
DROP INDEX IX_ItemCarteira_CodigoMoeda ON wallet.ItemCarteira;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_ParesMoedas_Base'
)
DROP INDEX IX_ParesMoedas_Base ON wallet.ParesMoedas;

IF EXISTS (
  SELECT
    *
  FROM
    sys.indexes
  WHERE
    name = 'IX_ParesMoedas_Cotacao'
)
DROP INDEX IX_ParesMoedas_Cotacao ON wallet.ParesMoedas;

-- 3. TABELAS (DAS FILHAS PARA AS MAES, POR CAUSA DAS FOREIGN KEYS)
--    ItemCarteira -> Carteira, Moeda
--    Carteira     -> Cliente, Corretora
--    ParesMoedas  -> Moeda
--    Cliente      -> Moeda
IF OBJECT_ID ('wallet.ParesMoedas', 'U') IS NOT NULL
  DROP TABLE wallet.ParesMoedas;

IF OBJECT_ID ('wallet.ItemCarteira', 'U') IS NOT NULL
  DROP TABLE wallet.ItemCarteira;

IF OBJECT_ID ('wallet.Carteira', 'U') IS NOT NULL
  DROP TABLE wallet.Carteira;

IF OBJECT_ID ('wallet.Cliente', 'U') IS NOT NULL
  DROP TABLE wallet.Cliente;

IF OBJECT_ID ('wallet.Corretora', 'U') IS NOT NULL
  DROP TABLE wallet.Corretora;

IF OBJECT_ID ('wallet.Moeda', 'U') IS NOT NULL
  DROP TABLE wallet.Moeda;

-- 4. SCHEMA (SO PODE SER REMOVIDO QUANDO ESTIVER VAZIO)
IF SCHEMA_ID ('wallet') IS NOT NULL
  DROP SCHEMA wallet;

-- 5. BANCO DE DADOS
USE master;

-- SINGLE_USER + ROLLBACK IMMEDIATE FECHA CONEXOES ABERTAS NO BANCO,
-- QUE IMPEDIRIAM O DROP DATABASE
IF DB_ID ('CarteiraVirtual_CDFL') IS NOT NULL BEGIN
ALTER DATABASE CarteiraVirtual_CDFL
SET
  SINGLE_USER
WITH
  ROLLBACK IMMEDIATE;

DROP DATABASE CarteiraVirtual_CDFL;

PRINT 'Banco CarteiraVirtual_CDFL removido.';

END ELSE PRINT 'Banco CarteiraVirtual_CDFL nao existe. Nada a desfazer.';