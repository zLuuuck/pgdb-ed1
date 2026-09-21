-- CRIAÇÃO DO BANCO
IF DB_ID('CarteiraVirtual') IS NULL
    CREATE DATABASE CarteiraVirtual;
GO

USE CarteiraVirtual;
GO

-- CRIAÇÃO DO SCHEMA
CREATE SCHEMA wallet;
GO


-- CRIANDO TABELA MOEDA
CREATE TABLE wallet.Moeda (
    CodigoMoeda CHAR(3) NOT NULL,
    Nome VARCHAR(50) NOT NULL,
    Par VARCHAR(50) NOT NULL,

    CONSTRAINT PK_Moeda PRIMARY KEY (CodigoMoeda)
);
GO


-- CIRANDO TABELA CLIENTE
CREATE TABLE wallet.Cliente (
    IdCliente INT IDENTITY(1,1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PassHash CHAR(32) NOT NULL,

    CONSTRAINT PK_Cliente PRIMARY KEY (IdCliente),
    CONSTRAINT UQ_Cliente_Email UNIQUE (Email)
);
GO


-- CRIANDO TABELA CARTEIRA
CREATE TABLE wallet.Carteira (
    IdCarteira INT IDENTITY(1,1) NOT NULL,
    Endereco VARCHAR(50) NOT NULL,
    Saldo DECIMAL(18,8) NOT NULL,
    IdCliente INT NOT NULL,
    CodigoMoeda CHAR(3) NOT NULL,

    CONSTRAINT PK_Carteira PRIMARY KEY (IdCarteira),

    CONSTRAINT FK_Carteira_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES wallet.Cliente (IdCliente),

    CONSTRAINT FK_Carteira_Moeda
        FOREIGN KEY (CodigoMoeda)
        REFERENCES wallet.Moeda (CodigoMoeda)
);
GO


-- CRIANDO TABELA COTACAO
CREATE TABLE wallet.Cotacao (
    IdCotacao INT IDENTITY(1,1) NOT NULL,
    PrecoUSD DECIMAL(18,2) NOT NULL,
    DataCotacao DATETIME2,
    CodigoMoeda CHAR(3) NOT NULL,

    CONSTRAINT PK_Cotacao PRIMARY KEY (IdCotacao),

    CONSTRAINT FK_Cotacao_Moeda
        FOREIGN KEY (CodigoMoeda)
        REFERENCES wallet.Moeda (CodigoMoeda)
);
GO


CREATE INDEX IX_Carteira_IdCliente
	ON wallet.Carteira (IdCliente);
GO

CREATE INDEX IX_Carteira_CodigoMoeda
	ON wallet.Carteira (CodigoMoeda);
GO

CREATE INDEX IX_Cotacao_CodigoMoeda
	ON wallet.Cotacao (CodigoMoeda);
GO
















