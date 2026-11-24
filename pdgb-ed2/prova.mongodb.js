// Exercício Prático 2 - PBD 2026/2 - MongoDB
// Aluno: Lucas Toterol Rodrigues
// Executar no mongosh:  mongosh --file exercicio_pratico_2.js
// (ou colar bloco a bloco no shell)

use("utp_pbd");

// ---------------------------------------------------------------
// Questão 1: Coleção STOCKS
// ---------------------------------------------------------------
db.STOCKS.drop();

db.STOCKS.insertMany([
  {
    Symbol: "AAPL",
    Name: "Apple Inc",
    Date: ISODate("2025-11-17"),
    Open: 268.93,
    High: 272.8,
    Low: 266.7,
    Close: 268.92,
    Volume: 18615738,
  },
  {
    Symbol: "MSFT",
    Name: "Microsoft Corporation",
    Date: ISODate("2025-11-17"),
    Open: 508.0,
    High: 512.47,
    Low: 505.6,
    Close: 510.35,
    Volume: 6536794,
  },
  {
    Symbol: "GOOGL",
    Name: "Alphabet Inc",
    Date: ISODate("2025-11-17"),
    Open: 285.54,
    High: 293.86,
    Low: 283.31,
    Close: 288.35,
    Volume: 32068378,
  },
  {
    Symbol: "AMZN",
    Name: "Amazon.com Inc",
    Date: ISODate("2025-11-17"),
    Open: 233.0,
    High: 238.0,
    Low: 229.26,
    Close: 233.53,
    Volume: 36724145,
  },
  {
    Symbol: "META",
    Name: "Meta Platforms Inc",
    Date: ISODate("2025-11-17"),
    Open: 609.35,
    High: 613.0,
    Low: 603.36,
    Close: 607.11,
    Volume: 6656126,
  },
  {
    Symbol: "NVDA",
    Name: "NVIDIA Corp",
    Date: ISODate("2025-11-17"),
    Open: 185.87,
    High: 192.35,
    Low: 185.04,
    Close: 187.67,
    Volume: 85164990,
  },
  {
    Symbol: "TSLA",
    Name: "Tesla Inc",
    Date: ISODate("2025-11-17"),
    Open: 399.06,
    High: 423.77,
    Low: 397.39,
    Close: 419.74,
    Volume: 55149723,
  },
  {
    Symbol: "INTC",
    Name: "Intel Corp",
    Date: ISODate("2025-11-17"),
    Open: 35.41,
    High: 35.9,
    Low: 35.14,
    Close: 35.56,
    Volume: 30995717,
  },
  {
    Symbol: "CSCO",
    Name: "Cisco Systems Inc",
    Date: ISODate("2025-11-17"),
    Open: 77.98,
    High: 79.36,
    Low: 77.54,
    Close: 79.27,
    Volume: 11060147,
  },
  {
    Symbol: "ORCL",
    Name: "Oracle Corp",
    Date: ISODate("2025-11-17"),
    Open: 217.24,
    High: 225.39,
    Low: 217.28,
    Close: 220.35,
    Volume: 7365289,
  },
  {
    Symbol: "IBM",
    Name: "International Business Machines",
    Date: ISODate("2025-11-17"),
    Open: 306.0,
    High: 307.0,
    Low: 300.5,
    Close: 301.1,
    Volume: 1146405,
  },
  {
    Symbol: "ADBE",
    Name: "Adobe Inc",
    Date: ISODate("2025-11-17"),
    Open: 330.33,
    High: 332.84,
    Low: 327.85,
    Close: 331.68,
    Volume: 1052853,
  },
  {
    Symbol: "CRM",
    Name: "Salesforce Inc",
    Date: ISODate("2025-11-17"),
    Open: 242.07,
    High: 244.45,
    Low: 238.67,
    Close: 240.36,
    Volume: 1809690,
  },
  {
    Symbol: "TXN",
    Name: "Texas Instruments Inc",
    Date: ISODate("2025-11-17"),
    Open: 158.63,
    High: 159.75,
    Low: 156.62,
    Close: 157.97,
    Volume: 1935718,
  },
  {
    Symbol: "QCOM",
    Name: "Qualcomm Inc",
    Date: ISODate("2025-11-17"),
    Open: 172.8,
    High: 175.12,
    Low: 168.65,
    Close: 170.09,
    Volume: 3595246,
  },
  {
    Symbol: "TSM",
    Name: "Taiwan Semiconductor Manufacturing",
    Date: ISODate("2025-11-17"),
    Open: 281.44,
    High: 286.81,
    Low: 280.69,
    Close: 283.48,
    Volume: 5225998,
  },
  {
    Symbol: "AVGO",
    Name: "Broadcom Inc",
    Date: ISODate("2025-11-17"),
    Open: 340.47,
    High: 352.06,
    Low: 338.3,
    Close: 346.48,
    Volume: 5650524,
  },
  {
    Symbol: "ASML",
    Name: "ASML Holding NV",
    Date: ISODate("2025-11-17"),
    Open: 1004.72,
    High: 1024.46,
    Low: 1002.24,
    Close: 1022.61,
    Volume: 704060,
  },
  {
    Symbol: "INTU",
    Name: "Intuit Inc",
    Date: ISODate("2025-11-17"),
    Open: 663.3,
    High: 665.0,
    Low: 650.66,
    Close: 653.96,
    Volume: 440256,
  },
  {
    Symbol: "PLTR",
    Name: "Palantir Technologies Inc",
    Date: ISODate("2025-11-17"),
    Open: 170.73,
    High: 176.2,
    Low: 169.88,
    Close: 173.13,
    Volume: 25262580,
  },
]);

print("Q1 - documentos em STOCKS: " + db.STOCKS.countDocuments());
printjson(db.STOCKS.find({}, { _id: 0 }).limit(3).toArray());

// ---------------------------------------------------------------
// Questão 2: Coleção WALLET
// ---------------------------------------------------------------
db.WALLET.drop();

db.WALLET.insertMany([
  { client: 1, symbol: "AAPL", quantity: 10, price: 268.92 },
  { client: 1, symbol: "MSFT", quantity: 22, price: 510.35 },
  { client: 1, symbol: "GOOGL", quantity: 5, price: 288.35 },
  { client: 1, symbol: "AMZN", quantity: 19, price: 233.53 },
  { client: 1, symbol: "META", quantity: 8, price: 607.11 },
  { client: 2, symbol: "AAPL", quantity: 11, price: 268.92 },
  { client: 2, symbol: "ORCL", quantity: 40, price: 220.35 },
  { client: 2, symbol: "GOOGL", quantity: 25, price: 288.35 },
  { client: 3, symbol: "NVDA", quantity: 100, price: 187.67 },
  { client: 3, symbol: "IBM", quantity: 130, price: 301.1 },
  { client: 3, symbol: "AAPL", quantity: 135, price: 288.35 },
  { client: 4, symbol: "TXN", quantity: 100, price: 157.97 },
  { client: 5, symbol: "AVGO", quantity: 50, price: 346.48 },
]);

print("Q2 - documentos em WALLET: " + db.WALLET.countDocuments());
printjson(db.WALLET.find({}, { _id: 0 }).toArray());

// ---------------------------------------------------------------
// Questão 3: Valor total da carteira por cliente (quantity * price)
// ---------------------------------------------------------------
print("Q3 - valor total da carteira por cliente");
printjson(
  db.WALLET.aggregate([
    {
      $group: {
        _id: "$client",
        totalCarteira: { $sum: { $multiply: ["$quantity", "$price"] } },
      },
    },
    {
      $project: {
        _id: 0,
        client: "$_id",
        totalCarteira: { $round: ["$totalCarteira", 2] },
      },
    },
    { $sort: { client: 1 } },
  ]).toArray(),
);

// ---------------------------------------------------------------
// Questão 4: $lookup entre WALLET e STOCKS (equivalente ao JOIN)
// ---------------------------------------------------------------
print("Q4 - WALLET JOIN STOCKS via $lookup");
printjson(
  db.WALLET.aggregate([
    {
      $lookup: {
        from: "STOCKS",
        localField: "symbol",
        foreignField: "Symbol",
        as: "acao",
      },
    },
    { $unwind: "$acao" }, // como INNER JOIN: descarta quem não casou
    {
      $project: {
        _id: 0,
        client: 1,
        symbol: 1,
        empresa: "$acao.Name",
        quantity: 1,
        precoCompra: "$price",
        fechamento: "$acao.Close",
        valorAtual: {
          $round: [{ $multiply: ["$quantity", "$acao.Close"] }, 2],
        },
      },
    },
    { $sort: { client: 1, symbol: 1 } },
  ]).toArray(),
);

// ---------------------------------------------------------------
// Questão 5: Pipeline com várias etapas (coleção STOCKS)
// Ações com volume acima de 5 milhões, calcula variação % do dia
// e amplitude, ordena pela maior variação e traz o top 5.
// ---------------------------------------------------------------
print("Q5 - pipeline: top 5 maiores variacoes do dia (volume > 5 mi)");
printjson(
  db.STOCKS.aggregate([
    { $match: { Volume: { $gt: 5000000 } } },
    {
      $addFields: {
        variacaoPct: {
          $multiply: [
            { $divide: [{ $subtract: ["$Close", "$Open"] }, "$Open"] },
            100,
          ],
        },
        amplitude: { $subtract: ["$High", "$Low"] },
      },
    },
    { $sort: { variacaoPct: -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        Symbol: 1,
        Name: 1,
        Open: 1,
        Close: 1,
        Volume: 1,
        variacaoPct: { $round: ["$variacaoPct", 2] },
        amplitude: { $round: ["$amplitude", 2] },
      },
    },
  ]).toArray(),
);
