-- PI - PROGRAMACAO EM BANCO DE DADOS - 2026/02
-- CARTEIRA VIRTUAL (WALLET) - APLICACAO CRIPTOMOEDAS
-- SCRIPT 01 - CRIACAO (BANCO, ESQUEMA, TABELAS, INDICES, DADOS, VISAO E LISTAGENS)
-- EQUIPE:
--   CAIO FEDERICO ESQUIVEL LOVERA ARZE
--   FERNANDO BACH
--   DOUGLAS CLAYTON DA SILVA
--   LUCAS TOTEROL RODRIGUES
-- ==================================================================
-- 1. CRIACAO DO BANCO
--    SUFIXO _CDFL (INICIAIS DA EQUIPE) EVITA COLISAO COM O BANCO DE
--    OUTRAS EQUIPES NO SERVIDOR COMPARTILHADO.
--    SE O BANCO JA EXISTIR, E REMOVIDO E RECRIADO (PERMITE REEXECUTAR).
-- ==================================================================
USE master

IF DB_ID ('CarteiraVirtual_CDFL') IS NOT NULL BEGIN
ALTER DATABASE CarteiraVirtual_CDFL
  SET
    SINGLE_USER
  WITH
    ROLLBACK IMMEDIATE

DROP DATABASE CarteiraVirtual_CDFL

END CREATE DATABASE CarteiraVirtual_CDFL

USE CarteiraVirtual_CDFL

GO
-- ==================================================================
-- 2. CRIACAO DO SCHEMA
-- ==================================================================
CREATE SCHEMA wallet

GO
-- ==================================================================
-- 3. CRIACAO DAS TABELAS (ORDEM RESPEITA AS FOREIGN KEYS)
-- ==================================================================
-- CRIANDO TABELA MOEDA
-- (A COLUNA PAR FOI REMOVIDA: O PAR PERTENCE A TABELA PARESMOEDAS)
CREATE TABLE
  wallet.Moeda (
    CodigoMoeda CHAR(3) NOT NULL,
    Nome VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Moeda PRIMARY KEY (CodigoMoeda)
  )

-- CRIANDO TABELA CORRETORA
CREATE TABLE
  wallet.Corretora (
    CodigoCorretora INT IDENTITY (1, 1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    CONSTRAINT PK_Corretora PRIMARY KEY (CodigoCorretora)
  )

-- CRIANDO TABELA CLIENTE
CREATE TABLE
  wallet.Cliente (
    IdCliente INT IDENTITY (1, 1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Celular VARCHAR(20) NOT NULL,
    PassHash CHAR(32) NOT NULL, -- MD5 DA SENHA EM HEXADECIMAL
    MoedaPrincipal CHAR(3) NOT NULL,
    CONSTRAINT PK_Cliente PRIMARY KEY (IdCliente),
    CONSTRAINT FK_Cliente_Moeda FOREIGN KEY (MoedaPrincipal) REFERENCES wallet.Moeda (CodigoMoeda)
  )

-- CRIANDO TABELA CARTEIRA
-- O ENDERECO (BASE58) IDENTIFICA A CARTEIRA NA BLOCKCHAIN, POR ISSO
-- E UNICO (UQ_Carteira_Endereco).
CREATE TABLE
  wallet.Carteira (
    IdCarteira INT IDENTITY (1, 1) NOT NULL,
    Endereco VARCHAR(50) NOT NULL,
    IdCliente INT NOT NULL,
    CodigoCorretora INT NOT NULL,
    CONSTRAINT PK_Carteira PRIMARY KEY (IdCarteira),
    CONSTRAINT UQ_Carteira_Endereco UNIQUE (Endereco),
    CONSTRAINT FK_Carteira_Cliente FOREIGN KEY (IdCliente) REFERENCES wallet.Cliente (IdCliente),
    CONSTRAINT FK_Carteira_Corretora FOREIGN KEY (CodigoCorretora) REFERENCES wallet.Corretora (CodigoCorretora)
  )

-- CRIANDO TABELA ITEMCARTEIRA
CREATE TABLE
  wallet.ItemCarteira (
    IdItemCarteira INT IDENTITY (1, 1) NOT NULL,
    IdCarteira INT NOT NULL,
    CodigoMoeda CHAR(3) NOT NULL,
    Quantidade DECIMAL(18, 8) NOT NULL,
    CONSTRAINT PK_ItemCarteira PRIMARY KEY (IdItemCarteira),
    CONSTRAINT FK_ItemCarteira_Carteira FOREIGN KEY (IdCarteira) REFERENCES wallet.Carteira (IdCarteira),
    CONSTRAINT FK_ItemCarteira_Moeda FOREIGN KEY (CodigoMoeda) REFERENCES wallet.Moeda (CodigoMoeda)
  )

-- CRIANDO TABELA PARESMOEDAS
-- CADA PAR (BASE, COTACAO) SO PODE EXISTIR UMA VEZ
-- (UQ_ParesMoedas_Par). SEM ISSO, UM PAR DUPLICADO DUPLICARIA O
-- SALDO DO CLIENTE NO JOIN DA VISAO DE SALDO.
CREATE TABLE
  wallet.ParesMoedas (
    IdPar INT IDENTITY (1, 1) NOT NULL,
    CodigoMoedaBase CHAR(3) NOT NULL,
    CodigoMoedaCotacao CHAR(3) NOT NULL,
    Valor DECIMAL(18, 2) NOT NULL,
    CONSTRAINT PK_ParesMoedas PRIMARY KEY (IdPar),
    CONSTRAINT UQ_ParesMoedas_Par UNIQUE (CodigoMoedaBase, CodigoMoedaCotacao),
    CONSTRAINT FK_ParesMoedas_Base FOREIGN KEY (CodigoMoedaBase) REFERENCES wallet.Moeda (CodigoMoeda),
    CONSTRAINT FK_ParesMoedas_Cotacao FOREIGN KEY (CodigoMoedaCotacao) REFERENCES wallet.Moeda (CodigoMoeda)
  )

-- ==================================================================
-- 4. INDICES (COLUNAS MAIS CONSULTADAS)
--    AS PRIMARY KEYS E UNIQUES JA CRIAM INDICE AUTOMATICAMENTE.
-- ==================================================================
-- LOGIN DO CLIENTE E FEITO PELO E-MAIL
CREATE UNIQUE INDEX IX_Cliente_Email ON wallet.Cliente (Email)

CREATE INDEX IX_Carteira_IdCliente ON wallet.Carteira (IdCliente)

CREATE INDEX IX_Carteira_CodigoCorretora ON wallet.Carteira (CodigoCorretora)

CREATE INDEX IX_ItemCarteira_IdCarteira ON wallet.ItemCarteira (IdCarteira)

CREATE INDEX IX_ItemCarteira_CodigoMoeda ON wallet.ItemCarteira (CodigoMoeda)

CREATE INDEX IX_ParesMoedas_Base ON wallet.ParesMoedas (CodigoMoedaBase)

CREATE INDEX IX_ParesMoedas_Cotacao ON wallet.ParesMoedas (CodigoMoedaCotacao)

-- ==================================================================
-- 5. INSERCAO DOS DADOS
--    OS INSERTS FICAM DENTRO DE UMA TRANSACAO (BEGIN TRAN / COMMIT
--    TRAN), EM UM UNICO LOTE (SEM GO ENTRE ELES).
--    OS CODIGOS IDENTITY (1, 2, 3) SAO PREVISIVEIS PORQUE O BANCO
--    ACABOU DE SER CRIADO NA ETAPA 1.
-- ==================================================================
BEGIN TRANSACTION

INSERT INTO
  wallet.Moeda (CodigoMoeda, Nome)
VALUES
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('LTC', 'Litecoin'),
  ('USD', 'Dolar Americano')

INSERT INTO
  wallet.Corretora (Nome)
VALUES
  ('Binance'),
  ('Coinbase'),
  ('Mercado Bitcoin')

-- PASSHASH EM MINUSCULAS, IGUAL AO EXEMPLO DO ENUNCIADO:
-- '123456' -> e10adc3949ba59abbe56e057f20f883e
INSERT INTO
  wallet.Cliente (Nome, Email, Celular, PassHash, MoedaPrincipal)
VALUES
  (
    'Sergio Luiz',
    'sergio.luiz@gmail.com',
    '(41) 91011-1213',
    LOWER(CONVERT(CHAR(32), HASHBYTES ('MD5', '123456'), 2)),
    'USD'
  ),
  (
    'Lucas Toterol',
    'lucas.toterol@gmail.com',
    '(41) 91415-1617',
    LOWER(CONVERT(CHAR(32), HASHBYTES ('MD5', '123456'), 2)),
    'USD'
  ),
  (
    'Douglas Clayton',
    'douglas.clayton@gmail.com',
    '(41) 91819-2021',
    LOWER(CONVERT(CHAR(32), HASHBYTES ('MD5', '123456'), 2)),
    'USD'
  )

INSERT INTO
  wallet.Carteira (Endereco, IdCliente, CodigoCorretora)
VALUES
  ('3QT1c5GxaqCnNvUusQsZ2jS6rWTRsNJSYp', 1, 1),
  ('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', 2, 2),
  ('1BoatSLRHtKNngkdXEeobR76b53LETtpyT', 3, 3)

INSERT INTO
  wallet.ItemCarteira (IdCarteira, CodigoMoeda, Quantidade)
VALUES
  (1, 'BTC', 0.50000000),
  (1, 'ETH', 2.00000000),
  (2, 'BTC', 0.25000000),
  (2, 'LTC', 10.00000000),
  (3, 'ETH', 5.00000000),
  (3, 'LTC', 20.00000000)

-- COTACOES DO ENUNCIADO
INSERT INTO
  wallet.ParesMoedas (CodigoMoedaBase, CodigoMoedaCotacao, Valor)
VALUES
  ('BTC', 'USD', 60356.70),
  ('ETH', 'USD', 2570.52),
  ('LTC', 'USD', 63.59)

COMMIT TRANSACTION

GO
-- ==================================================================
-- 6. VISAO: SALDO ATUAL POR USUARIO
--    CADA ITEM E CONVERTIDO PARA A MOEDA PRINCIPAL DO CLIENTE:
--      - ITEM NA PROPRIA MOEDA PRINCIPAL -> QUANTIDADE DIRETA
--      - SENAO -> QUANTIDADE x COTACAO DO PAR (MOEDA, MOEDA PRINCIPAL)
--    LEFT JOIN: TODO CLIENTE CADASTRADO APARECE, MESMO SEM CARTEIRA.
-- ==================================================================
CREATE VIEW
  wallet.vw_SaldoCliente AS
SELECT
  cl.IdCliente,
  cl.Nome AS Cliente,
  m.Nome AS Moeda,
  CAST(
    ISNULL (
      SUM(
        CASE
          WHEN ic.CodigoMoeda = cl.MoedaPrincipal THEN ic.Quantidade
          ELSE ic.Quantidade * pm.Valor
        END
      ),
      0
    ) AS DECIMAL(18, 2)
  ) AS ValorCarteira
FROM
  wallet.Cliente AS cl
  INNER JOIN wallet.Moeda AS m ON cl.MoedaPrincipal = m.CodigoMoeda
  LEFT OUTER JOIN wallet.Carteira AS c ON c.IdCliente = cl.IdCliente
  LEFT OUTER JOIN wallet.ItemCarteira AS ic ON ic.IdCarteira = c.IdCarteira
  LEFT OUTER JOIN wallet.ParesMoedas AS pm ON pm.CodigoMoedaBase = ic.CodigoMoeda
  AND pm.CodigoMoedaCotacao = cl.MoedaPrincipal
GROUP BY
  cl.IdCliente,
  cl.Nome,
  m.Nome

GO
-- ==================================================================
-- 7. LISTAGEM DOS DADOS INSERIDOS
-- ==================================================================
SELECT
  *
FROM
  wallet.Moeda

SELECT
  *
FROM
  wallet.Corretora

SELECT
  IdCliente,
  Nome,
  Email,
  Celular,
  PassHash,
  MoedaPrincipal
FROM
  wallet.Cliente

SELECT
  c.IdCarteira,
  c.Endereco,
  cl.Nome AS Cliente,
  co.Nome AS Corretora
FROM
  wallet.Carteira AS c
  INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
  INNER JOIN wallet.Corretora AS co ON c.CodigoCorretora = co.CodigoCorretora

SELECT
  cl.Nome AS Cliente,
  m.Nome AS Moeda,
  ic.Quantidade
FROM
  wallet.ItemCarteira AS ic
  INNER JOIN wallet.Carteira AS c ON ic.IdCarteira = c.IdCarteira
  INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
  INNER JOIN wallet.Moeda AS m ON ic.CodigoMoeda = m.CodigoMoeda

SELECT
  m.Nome AS Moeda,
  pm.CodigoMoedaBase + '/' + pm.CodigoMoedaCotacao AS Par,
  pm.Valor
FROM
  wallet.ParesMoedas AS pm
  INNER JOIN wallet.Moeda AS m ON pm.CodigoMoedaBase = m.CodigoMoeda

-- VALOR DE CADA MOEDA NA CARTEIRA, CONVERTIDO PARA A MOEDA PRINCIPAL
-- (O JOIN COM PARESMOEDAS FILTRA PELA MOEDA PRINCIPAL DO CLIENTE)
SELECT
  cl.Nome AS Cliente,
  m.Nome AS Moeda,
  ic.Quantidade,
  pm.Valor AS Cotacao,
  ic.Quantidade * pm.Valor AS ValorCarteira
FROM
  wallet.ItemCarteira AS ic
  INNER JOIN wallet.Carteira AS c ON ic.IdCarteira = c.IdCarteira
  INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
  INNER JOIN wallet.Moeda AS m ON ic.CodigoMoeda = m.CodigoMoeda
  INNER JOIN wallet.ParesMoedas AS pm ON pm.CodigoMoedaBase = ic.CodigoMoeda
  AND pm.CodigoMoedaCotacao = cl.MoedaPrincipal
ORDER BY
  cl.Nome

-- LISTAGEM EXIGIDA: SALDO ATUAL POR USUARIO
-- (DESCRICAO DA MOEDA + VALOR DA CARTEIRA)
SELECT
  Cliente,
  Moeda,
  ValorCarteira
FROM
  wallet.vw_SaldoCliente
ORDER BY
  Cliente