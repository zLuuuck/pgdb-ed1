USE CarteiraVirtual;



INSERT INTO wallet.Moeda
    (CodigoMoeda, Nome, Par)
VALUES
    ('BTC', 'Bitcoin', 'BTC/USD'),
    ('ETH', 'Ethereum', 'ETH/USD'),
    ('LTC', 'Litecoin', 'LTC/USD'),
    ('USD', 'Dolar Americano', 'USD/USD');



INSERT INTO wallet.Corretora
    (Nome)
VALUES
    ('Binance'),
    ('Coinbase'),
    ('Mercado Bitcoin');



INSERT INTO wallet.Cliente
    (Nome, Email, Celular, PassHash, MoedaPrincipal)
VALUES
    ('Sergio Luiz', 'sergio.luiz@gmail.com', '(41) 91011-1213',
     CONVERT(CHAR(32), HASHBYTES('MD5', '123456'), 2), 'USD'),

    ('Lucas Toterol', 'lucas.toterol@gmail.com', '(41) 91415-1617',
     CONVERT(CHAR(32), HASHBYTES('MD5', '123456'), 2), 'USD'),

    ('Douglas Clayton', 'douglas.clayton@gmail.com', '(41) 91819-2021',
     CONVERT(CHAR(32), HASHBYTES('MD5', '123456'), 2), 'USD');



INSERT INTO wallet.Carteira
    (Endereco, IdCliente, CodigoCorretora)
VALUES
    ('3QT1c5GxaqCnNvUusQsZ2jS6rWTRsNJSYp', 1, 1),
    ('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', 2, 2),
    ('1BoatSLRHtKNngkdXEeobR76b53LETtpyT', 3, 3);



INSERT INTO wallet.ItemCarteira
    (IdCarteira, CodigoMoeda, Quantidade)
VALUES
    (1, 'BTC', 0.50000000),
    (1, 'ETH', 2.00000000),
    (2, 'BTC', 0.25000000),
    (2, 'LTC', 10.00000000),
    (3, 'ETH', 5.00000000),
    (3, 'LTC', 20.00000000);



INSERT INTO wallet.ParesMoedas
    (CodigoMoedaBase, CodigoMoedaCotacao, Valor)
VALUES
    ('BTC', 'USD', 60356.70),
    ('ETH', 'USD', 2570.52),
    ('LTC', 'USD', 63.59);

