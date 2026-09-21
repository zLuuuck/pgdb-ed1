-- CRIAÇÃO DO BANCO
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


-- CRIANDO TABELA CORRETORA
CREATE TABLE wallet.Corretora ( 
    CodigoCorretora INT IDENTITY(1,1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
 
    CONSTRAINT PK_Corretora PRIMARY KEY (CodigoCorretora)
); 
GO


-- CRIANDO TABELA CLIENTE
CREATE TABLE wallet.Cliente (
    IdCliente INT IDENTITY(1,1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Celular VARCHAR(20) NOT NULL,
    PassHash CHAR(32) NOT NULL,
    MoedaPrincipal CHAR(3) NOT NULL,

    CONSTRAINT PK_Cliente PRIMARY KEY (IdCliente),

    CONSTRAINT FK_Cliente_Moeda
        FOREIGN KEY (MoedaPrincipal)
        REFERENCES wallet.Moeda (CodigoMoeda)
);
GO


-- CRIANDO TABELA CARTEIRA
CREATE TABLE wallet.Carteira (
    IdCarteira INT IDENTITY(1,1) NOT NULL,
    Endereco VARCHAR(50) NOT NULL,
    IdCliente INT NOT NULL,
    CodigoCorretora INT NOT NULL,
 
    CONSTRAINT PK_Carteira PRIMARY KEY (IdCarteira),
 
    CONSTRAINT FK_Carteira_Cliente
        FOREIGN KEY (IdCliente)
        REFERENCES wallet.Cliente (IdCliente),
 
    CONSTRAINT FK_Carteira_Corretora
        FOREIGN KEY (CodigoCorretora)
        REFERENCES wallet.Corretora (CodigoCorretora)
);
GO


-- CRIANDO TABELA ITEMCARTEIRA
CREATE TABLE wallet.ItemCarteira (
    IdItemCarteira INT IDENTITY(1,1) NOT NULL,
    IdCarteira INT NOT NULL,
    CodigoMoeda CHAR(3) NOT NULL,
    Quantidade DECIMAL(18,8) NOT NULL,

    CONSTRAINT PK_ItemCarteira PRIMARY KEY (IdItemCarteira),

    CONSTRAINT FK_ItemCarteira_Carteira
        FOREIGN KEY (IdCarteira)
        REFERENCES wallet.Carteira (IdCarteira),

    CONSTRAINT FK_ItemCarteira_Moeda
        FOREIGN KEY (CodigoMoeda)
        REFERENCES wallet.Moeda (CodigoMoeda)
);
GO


-- CRIANDO TABELA PARESMOEDAS
CREATE TABLE wallet.ParesMoedas (
    IdPar INT IDENTITY(1,1) NOT NULL,
    CodigoMoedaBase CHAR(3) NOT NULL,
    CodigoMoedaCotacao CHAR(3) NOT NULL,
    Valor DECIMAL(18,2) NOT NULL,

    CONSTRAINT PK_ParesMoedas PRIMARY KEY (IdPar),

    CONSTRAINT FK_ParesMoedas_Base
        FOREIGN KEY (CodigoMoedaBase)
        REFERENCES wallet.Moeda (CodigoMoeda),

    CONSTRAINT FK_ParesMoedas_Cotacao
        FOREIGN KEY (CodigoMoedaCotacao)
        REFERENCES wallet.Moeda (CodigoMoeda)
);
GO


-- INDICES
CREATE INDEX IX_Carteira_IdCliente
    ON wallet.Carteira (IdCliente);
GO

CREATE INDEX IX_Carteira_CodigoCorretora
    ON wallet.Carteira (CodigoCorretora);
GO

CREATE INDEX IX_ItemCarteira_IdCarteira
    ON wallet.ItemCarteira (IdCarteira);
GO

CREATE INDEX IX_ItemCarteira_CodigoMoeda
    ON wallet.ItemCarteira (CodigoMoeda);
GO

CREATE INDEX IX_ParesMoedas_Base
    ON wallet.ParesMoedas (CodigoMoedaBase);
GO

CREATE INDEX IX_ParesMoedas_Cotacao
    ON wallet.ParesMoedas (CodigoMoedaCotacao);
GO













