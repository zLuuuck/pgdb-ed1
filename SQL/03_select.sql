USE CarteiraVirtual;


SELECT *
FROM wallet.Moeda;


SELECT *
FROM wallet.Corretora;



SELECT
    IdCliente,
    Nome,
    Email,
    Celular,
    MoedaPrincipal
FROM wallet.Cliente;



SELECT
    c.IdCarteira,
    c.Endereco,
    cl.Nome AS Cliente,
    co.Nome AS Corretora
<<<<<<< HEAD
FROM wallet.Carteira c
INNER JOIN wallet.Cliente cl
    ON c.IdCliente = cl.IdCliente
INNER JOIN wallet.Corretora co
    ON c.CodigoCorretora = co.CodigoCorretora;


=======
FROM
    wallet.Carteira AS c
    INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
    INNER JOIN wallet.Corretora AS co ON c.CodigoCorretora = co.CodigoCorretora;
>>>>>>> 924303e (unindo os 3 scripts em um so, documentando código)

SELECT
    cl.Nome AS Cliente,
    m.Nome AS Moeda,
    ic.Quantidade
<<<<<<< HEAD
FROM wallet.ItemCarteira ic
INNER JOIN wallet.Carteira c
    ON ic.IdCarteira = c.IdCarteira
INNER JOIN wallet.Cliente cl
    ON c.IdCliente = cl.IdCliente
INNER JOIN wallet.Moeda m
    ON ic.CodigoMoeda = m.CodigoMoeda;


=======
FROM
    wallet.ItemCarteira AS ic
    INNER JOIN wallet.Carteira AS c ON ic.IdCarteira = c.IdCarteira
    INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
    INNER JOIN wallet.Moeda AS m ON ic.CodigoMoeda = m.CodigoMoeda;
>>>>>>> 924303e (unindo os 3 scripts em um so, documentando código)

SELECT
    m.Nome AS Moeda,
    pm.CodigoMoedaCotacao,
    pm.Valor
<<<<<<< HEAD
FROM wallet.ParesMoedas pm
INNER JOIN wallet.Moeda m
    ON pm.CodigoMoedaBase = m.CodigoMoeda;


=======
FROM
    wallet.ParesMoedas AS pm
    INNER JOIN wallet.Moeda AS m ON pm.CodigoMoedaBase = m.CodigoMoeda;
>>>>>>> 924303e (unindo os 3 scripts em um so, documentando código)

SELECT
    cl.Nome AS Cliente,
    m.Nome AS Moeda,
    ic.Quantidade,
    pm.Valor AS Cotacao,
    ic.Quantidade * pm.Valor AS ValorCarteira
<<<<<<< HEAD
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






=======
FROM
    wallet.ItemCarteira AS ic
    INNER JOIN wallet.Carteira AS c ON ic.IdCarteira = c.IdCarteira
    INNER JOIN wallet.Cliente AS cl ON c.IdCliente = cl.IdCliente
    INNER JOIN wallet.Moeda AS m ON ic.CodigoMoeda = m.CodigoMoeda
    INNER JOIN wallet.ParesMoedas AS pm ON ic.CodigoMoeda = pm.CodigoMoedaBase
ORDER BY
    cl.Nome;
>>>>>>> 924303e (unindo os 3 scripts em um so, documentando código)
