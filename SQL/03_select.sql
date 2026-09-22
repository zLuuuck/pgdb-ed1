USE CarteiraVirtual;
GO

SELECT *
FROM wallet.Moeda;
GO


SELECT *
FROM wallet.Corretora;
GO


SELECT
    IdCliente,
    Nome,
    Email,
    Celular,
    MoedaPrincipal
FROM wallet.Cliente;
GO


SELECT
    c.IdCarteira,
    c.Endereco,
    cl.Nome AS Cliente,
    co.Nome AS Corretora
FROM wallet.Carteira c
INNER JOIN wallet.Cliente cl
    ON c.IdCliente = cl.IdCliente
INNER JOIN wallet.Corretora co
    ON c.CodigoCorretora = co.CodigoCorretora;
GO


SELECT
    cl.Nome AS Cliente,
    m.Nome AS Moeda,
    ic.Quantidade
FROM wallet.ItemCarteira ic
INNER JOIN wallet.Carteira c
    ON ic.IdCarteira = c.IdCarteira
INNER JOIN wallet.Cliente cl
    ON c.IdCliente = cl.IdCliente
INNER JOIN wallet.Moeda m
    ON ic.CodigoMoeda = m.CodigoMoeda;
GO


SELECT
    m.Nome AS Moeda,
    pm.CodigoMoedaCotacao,
    pm.Valor
FROM wallet.ParesMoedas pm
INNER JOIN wallet.Moeda m
    ON pm.CodigoMoedaBase = m.CodigoMoeda;
GO


SELECT
    cl.Nome AS Cliente,
    m.Nome AS Moeda,
    ic.Quantidade,
    pm.Valor AS Cotacao,
    ic.Quantidade * pm.Valor AS ValorCarteira
FROM wallet.ItemCarteira ic
INNER JOIN wallet.Carteira c
    ON ic.IdCarteira = c.IdCarteira
INNER JOIN wallet.Cliente cl
    ON c.IdCliente = cl.IdCliente
INNER JOIN wallet.Moeda m
    ON ic.CodigoMoeda = m.CodigoMoeda
INNER JOIN wallet.ParesMoedas pm
    ON ic.CodigoMoeda = pm.CodigoMoedaBase
ORDER BY cl.Nome;
GO