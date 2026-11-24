use("EXERCICIO-20-10");

db.PRODUTOS.insertMany([
  { _id: 0, nome: "Sabonete", UnidadeMedida: "Unidade", qtde: 10, preco: 1.5 },
  { _id: 1, nome: "Refrigerante", UnidadeMedida: "Litro", qtde: 4, preco: 8.5 },
  {
    _id: 2,
    nome: "Carne Vermelha",
    UnidadeMedida: "Quilograma",
    qtde: 35,
    preco: 21.5,
  },
  { _id: 3, nome: "Peixe", UnidadeMedida: "Quilograma", qtde: 11, preco: 40.0 },
  {
    _id: 4,
    nome: "Frango",
    UnidadeMedida: "Quilograma",
    qtde: 20,
    preco: 23.7,
  },
  {
    _id: 5,
    nome: "Pepino Conserva",
    UnidadeMedida: "Unidade",
    qtde: 15,
    preco: 15.5,
  },
  { _id: 6, nome: "Moiashi", UnidadeMedida: "Quilograma", qtde: 7, preco: 3.5 },
  { _id: 7, nome: "Suco", UnidadeMedida: "Litro", qtde: 8, preco: 8.5 },
  {
    _id: 8,
    nome: "Bolacha Agua e Sal",
    UnidadeMedida: "Pacote",
    qtde: 10,
    preco: 3.0,
  },
]);

//1 liste apenas os produtos vendidos em quilo
use("EXERCICIO-20-10");

db.PRODUTOS.find({ UnidadeMedida: "Quilograma" });

//2 liste os produtos em ordem alfabetica
use("EXERCICIO-20-10");

db.PRODUTOS.find().sort({ nome: 1 });

//3 liste unidades de medida constantes da colecao PRODUTOS
//  sem repeticao.
use("EXERCICIO-20-10");

db.PRODUTOS.distinct("UnidadeMedida");

//4 conte o numero total de produtos por UnidadeMedida
use("EXERCICIO-20-10");

db.PRODUTOS.aggregate([
  { $group: { _id: "$UnidadeMedida", totalProdutos: { $sum: 1 } } },
]);

//5 qual a quantidade total de produtos por UnidadeMedida
use("EXERCICIO-20-10");

db.PRODUTOS.aggregate([
  { $group: { _id: "$UnidadeMedida", qtdeTotal: { $sum: "$qtde" } } },
]);

//6 qual o preco medido dos produtos por UnidadeMedida
use("EXERCICIO-20-10");

db.PRODUTOS.aggregate([
  { $group: { _id: "$UnidadeMedida", precoMedio: { $avg: "$preco" } } },
]);

//7 qual o preco medio de todos os produtos
use("EXERCICIO-20-10");

db.PRODUTOS.aggregate([
  { $group: { _id: null, precoMedio: { $avg: "$preco" } } },
]);

//8 liste o preco total por item (qtde * preco) por produto
use("EXERCICIO-20-10");

db.PRODUTOS.aggregate([
  {
    $project: {
      nome: 1,
      qtde: 1,
      preco: 1,
      precoTotal: { $multiply: ["$qtde", "$preco"] },
    },
  },
]);

//9
db.monstro.insertMany([
  { nome: "Saci", transp: 0.0, ValEcotoplasmat: 85 },
  { nome: "Curupira", transp: 0.5, ValEcotoplasmat: 70 },
  { nome: "MulaSCabeca", transp: 0.65, ValEcotoplasmat: 65 },
  { nome: "Frankestain", transp: 0.1, ValEcotoplasmat: 13 },
  { nome: "Fantasma", transp: 0.99, ValEcotoplasmat: 22 },
]);

//9 Exercicio: Liste o 'Susto' dado pela transparencia multiplicado pelo valor_
//  ectoplasmatico. Qual monstro possui o maior susto?

// lista o susto de todos os monstros, do maior para o menor
db.monstro.aggregate([
  {
    $project: {
      _id: 0,
      nome: 1,
      susto: { $multiply: ["$transp", "$ValEcotoplasmat"] },
    },
  },
  { $sort: { susto: -1 } },
]);

// monstro com o maior susto (MulaSCabeca: 0.65 * 65 = 42.25)
db.monstro.aggregate([
  {
    $project: {
      _id: 0,
      nome: 1,
      susto: { $multiply: ["$transp", "$ValEcotoplasmat"] },
    },
  },
  { $sort: { susto: -1 } },
  { $limit: 1 },
]);
