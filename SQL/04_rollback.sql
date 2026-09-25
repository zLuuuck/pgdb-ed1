-- 04_ROLLBACK.SQL
-- Remove todos os objetos criados pelo 01_criacao.sql,
 
USE CarteiraVirtual;
GO
 
 
-- 1. ÍNDICES
DROP INDEX IX_Carteira_IdCliente ON wallet.Carteira;
DROP INDEX IX_Carteira_CodigoCorretora ON wallet.Carteira;
DROP INDEX IX_ItemCarteira_IdCarteira ON wallet.ItemCarteira;
DROP INDEX IX_ItemCarteira_CodigoMoeda ON wallet.ItemCarteira;
DROP INDEX IX_ParesMoedas_Base ON wallet.ParesMoedas;
DROP INDEX IX_ParesMoedas_Cotacao ON wallet.ParesMoedas;
GO
 
 
-- 2. TABELAS (das filhas para as mães, por causa das FKs)
DROP TABLE wallet.ParesMoedas;
DROP TABLE wallet.ItemCarteira;
DROP TABLE wallet.Carteira;
DROP TABLE wallet.Cliente;
DROP TABLE wallet.Corretora;
DROP TABLE wallet.Moeda;
GO
 
 
-- 3. SCHEMA
DROP SCHEMA wallet;
GO
 
 
-- 4. BANCO DE DADOS
USE master;

 
-- Força o fechamento de qualquer conexão aberta no banco
ALTER DATABASE CarteiraVirtual SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

 
DROP DATABASE CarteiraVirtual;
GO