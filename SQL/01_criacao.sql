IF DB_ID('CarteiraVirtual') IS NULL
    CREATE DATABASE CarteiraVirtual;
GO

USE CarteiraVirtual;
GO

CREATE SCHEMA wallet;
GO

CREATE TABLE wallet.Moeda (
    CodigoMoeda CHAR(3) NOT NULL,
    Nome VARCHAR(50) NOT NULL,
    Par VARCHAR(50) NOT NULL,

    CONSTRAINT PK_Moeda PRIMARY KEY (CodigoMoeda)
);
GO

CREATE TABLE wallet.Cliente (
    IdCliente INT IDENTITY(1,1) NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PassHash CHAR(32) NOT NULL,

    CONSTRAINT PK_Cliente PRIMARY KEY (IdCliente),
    CONSTRAINT UQ_Cliente_Email UNIQUE (Email)
);
GO


