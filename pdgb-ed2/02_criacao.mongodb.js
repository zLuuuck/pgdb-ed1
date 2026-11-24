// =============================================================================
// PI Programação Banco de Dados - Trabalho 2
// Criação da Base de Dados NoSQL (MongoDB) - Coleta de Doações Humanitárias
//
// Integrantes da equipe:
//   - Caio Federico Esquivel Lovera Arze
//   - Douglas Clayton Da Silva
//   - Fernando Bach
//   - Lucas Toterol Rodrigues
//
// Papéis: Doador, Recebedor e Coletor (todos na coleção Usuarios, campo Tipo).
// Doações e necessidades são feitas sempre no endereço do usuário e as
// tratativas acontecem via WhatsApp (por isso o Phone fica em Usuarios).
//
// O script pode ser executado várias vezes: ele recria as coleções do zero.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. BANCO DE DADOS
// -----------------------------------------------------------------------------
use("DoacoesHumanitarias");

// -----------------------------------------------------------------------------
// 2. COLEÇÕES
// Remove (se existirem) para que o script seja reexecutável sem duplicar dados.
// O _id de cada coleção faz o papel da PK do diagrama.
// -----------------------------------------------------------------------------
["Coleta", "Doacao", "NecessidadeDoacao", "Usuarios", "TipoDoacao"].forEach(
  (nome) => db.getCollection(nome).drop(),
);

db.createCollection("TipoDoacao");
db.createCollection("Usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "Nome", "Coordenadas", "Endereco", "Email", "Phone", "Tipo"],
      properties: {
        Tipo: { enum: ["Doador", "Coletor", "Recebedor"] },
      },
    },
  },
});
db.createCollection("NecessidadeDoacao");
db.createCollection("Doacao");
db.createCollection("Coleta"); // _id composto: { IdentificadorNecessidade, IdentificadorDoacao }

// -----------------------------------------------------------------------------
// 3. DOCUMENTOS (dados de exemplo consistentes)
// -----------------------------------------------------------------------------

// Tipos de doação
db.TipoDoacao.insertMany([
  { _id: 1, Descricao: "Mantimento" },
  { _id: 2, Descricao: "Água" },
  { _id: 3, Descricao: "Remédio" },
  { _id: 4, Descricao: "Roupas" },
]);

// Usuários: 1-3 Doadores | 4-6 Recebedores | 7-9 Coletores
db.Usuarios.insertMany([
  {
    _id: 1,
    Nome: "Mariana Souza",
    Coordenadas: { Latitude: -25.4284, Longitude: -49.2733 },
    Endereco: {
      Rua: "Rua XV de Novembro, 1200",
      Complemento: "Apto 51",
      CEP: "80020-310",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-1001",
    },
    Email: "mariana.souza@email.com",
    Phone: "(41) 99911-1001",
    Tipo: "Doador",
  },
  {
    _id: 2,
    Nome: "Carlos Eduardo Lima",
    Coordenadas: { Latitude: -25.4411, Longitude: -49.2769 },
    Endereco: {
      Rua: "Av. Sete de Setembro, 3300",
      Complemento: "Casa",
      CEP: "80230-010",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-1002",
    },
    Email: "carlos.lima@email.com",
    Phone: "(41) 99911-1002",
    Tipo: "Doador",
  },
  {
    _id: 3,
    Nome: "Fernanda Alves",
    Coordenadas: { Latitude: -25.3935, Longitude: -49.2321 },
    Endereco: {
      Rua: "Rua Padre Anchieta, 850",
      Complemento: "Bloco B, apto 12",
      CEP: "80730-000",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-1003",
    },
    Email: "fernanda.alves@email.com",
    Phone: "(41) 99911-1003",
    Tipo: "Doador",
  },
  {
    _id: 4,
    Nome: "Associação Esperança",
    Coordenadas: { Latitude: -25.5073, Longitude: -49.3149 },
    Endereco: {
      Rua: "Rua Pedro Gusso, 2500",
      Complemento: "Sede",
      CEP: "81310-000",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-2004",
    },
    Email: "contato@assocesperanca.org",
    Phone: "(41) 99922-2004",
    Tipo: "Recebedor",
  },
  {
    _id: 5,
    Nome: "Lar Santa Clara",
    Coordenadas: { Latitude: -25.4602, Longitude: -49.2113 },
    Endereco: {
      Rua: "Rua Itacolomi, 410",
      Complemento: "",
      CEP: "82030-000",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-2005",
    },
    Email: "lar.santaclara@email.org",
    Phone: "(41) 99922-2005",
    Tipo: "Recebedor",
  },
  {
    _id: 6,
    Nome: "Josefa Pereira",
    Coordenadas: { Latitude: -25.5399, Longitude: -49.2662 },
    Endereco: {
      Rua: "Rua Jaime Reis, 77",
      Complemento: "Fundos",
      CEP: "81650-000",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-2006",
    },
    Email: "josefa.pereira@email.com",
    Phone: "(41) 99922-2006",
    Tipo: "Recebedor",
  },
  {
    _id: 7,
    Nome: "Rafael Martins",
    Coordenadas: { Latitude: -25.4195, Longitude: -49.2646 },
    Endereco: {
      Rua: "Rua Marechal Deodoro, 630",
      Complemento: "Sala 4",
      CEP: "80010-010",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-3007",
    },
    Email: "rafael.martins@email.com",
    Phone: "(41) 99933-3007",
    Tipo: "Coletor",
  },
  {
    _id: 8,
    Nome: "Beatriz Nogueira",
    Coordenadas: { Latitude: -25.4777, Longitude: -49.2915 },
    Endereco: {
      Rua: "Rua Brigadeiro Franco, 1900",
      Complemento: "Apto 33",
      CEP: "80250-030",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-3008",
    },
    Email: "beatriz.nogueira@email.com",
    Phone: "(41) 99933-3008",
    Tipo: "Coletor",
  },
  {
    _id: 9,
    Nome: "Thiago Ribeiro",
    Coordenadas: { Latitude: -25.4356, Longitude: -49.3059 },
    Endereco: {
      Rua: "Rua Mateus Leme, 2100",
      Complemento: "Casa 2",
      CEP: "80510-190",
      Cidade: "Curitiba",
      Estado: "PR",
      Telefone: "(41) 3222-3009",
    },
    Email: "thiago.ribeiro@email.com",
    Phone: "(41) 99933-3009",
    Tipo: "Coletor",
  },
]);

// Necessidades de doação (feitas por Recebedores: usuários 4, 5 e 6)
db.NecessidadeDoacao.insertMany([
  {
    _id: 1,
    IdentificadorUsuario: 4,
    Data: new Date("2026-11-01T10:00:00Z"),
    Descricao: "Cestas básicas (arroz, feijão, óleo, macarrão)",
    IdentificadorTipoDoacao: 1,
    Quantidade: 20,
  },
  {
    _id: 2,
    IdentificadorUsuario: 5,
    Data: new Date("2026-11-01T14:30:00Z"),
    Descricao: "Garrafões de água mineral 20 litros",
    IdentificadorTipoDoacao: 2,
    Quantidade: 30,
  },
  {
    _id: 3,
    IdentificadorUsuario: 6,
    Data: new Date("2026-11-02T09:15:00Z"),
    Descricao: "Medicamentos para pressão alta e analgésicos",
    IdentificadorTipoDoacao: 3,
    Quantidade: 10,
  },
  {
    _id: 4,
    IdentificadorUsuario: 4,
    Data: new Date("2026-11-03T11:00:00Z"),
    Descricao: "Agasalhos e cobertores para o inverno",
    IdentificadorTipoDoacao: 4,
    Quantidade: 15,
  },
  {
    _id: 5,
    IdentificadorUsuario: 5,
    Data: new Date("2026-11-04T16:45:00Z"),
    Descricao: "Alimentos não perecíveis para o lar de idosos",
    IdentificadorTipoDoacao: 1,
    Quantidade: 10,
  },
]);

// Doações oferecidas (feitas por Doadores: usuários 1, 2 e 3)
db.Doacao.insertMany([
  {
    _id: 1,
    IdentificadorUsuario: 1,
    Data: new Date("2026-11-02T08:00:00Z"),
    Descricao: "25 cestas básicas completas",
    IdentificadorTipoDoacao: 1,
    Quantidade: 25,
  },
  {
    _id: 2,
    IdentificadorUsuario: 2,
    Data: new Date("2026-11-02T13:20:00Z"),
    Descricao: "Garrafões de água mineral 20 litros",
    IdentificadorTipoDoacao: 2,
    Quantidade: 30,
  },
  {
    _id: 3,
    IdentificadorUsuario: 3,
    Data: new Date("2026-11-03T10:10:00Z"),
    Descricao: "Caixas de remédios lacradas, dentro da validade",
    IdentificadorTipoDoacao: 3,
    Quantidade: 10,
  },
  {
    _id: 4,
    IdentificadorUsuario: 1,
    Data: new Date("2026-11-04T09:40:00Z"),
    Descricao: "Agasalhos, casacos e cobertores limpos",
    IdentificadorTipoDoacao: 4,
    Quantidade: 20,
  },
  {
    _id: 5,
    IdentificadorUsuario: 3,
    Data: new Date("2026-11-05T15:00:00Z"),
    Descricao: "Alimentos não perecíveis variados",
    IdentificadorTipoDoacao: 1,
    Quantidade: 12,
  },
]);

// Coletas: liga uma Necessidade a uma Doação e registra o Coletor (usuários 7-9).
// O _id composto reproduz a PK composta do diagrama.
// DataEntrega null = doação já retirada, mas ainda não entregue.
db.Coleta.insertMany([
  {
    _id: { IdentificadorNecessidade: 1, IdentificadorDoacao: 1 },
    IdentificadorUsuario: 7,
    DataColeta: new Date("2026-11-05T09:00:00Z"),
    DataEntrega: new Date("2026-11-05T11:30:00Z"),
  },
  {
    _id: { IdentificadorNecessidade: 2, IdentificadorDoacao: 2 },
    IdentificadorUsuario: 8,
    DataColeta: new Date("2026-11-06T10:00:00Z"),
    DataEntrega: new Date("2026-11-06T12:00:00Z"),
  },
  {
    _id: { IdentificadorNecessidade: 3, IdentificadorDoacao: 3 },
    IdentificadorUsuario: 9,
    DataColeta: new Date("2026-11-07T14:00:00Z"),
    DataEntrega: new Date("2026-11-07T15:30:00Z"),
  },
  {
    _id: { IdentificadorNecessidade: 4, IdentificadorDoacao: 4 },
    IdentificadorUsuario: 7,
    DataColeta: new Date("2026-11-08T09:30:00Z"),
    DataEntrega: new Date("2026-11-08T11:00:00Z"),
  },
  {
    _id: { IdentificadorNecessidade: 5, IdentificadorDoacao: 5 },
    IdentificadorUsuario: 8,
    DataColeta: new Date("2026-11-09T16:00:00Z"),
    DataEntrega: null,
  },
]);

// -----------------------------------------------------------------------------
// 4. CONSULTAS
// -----------------------------------------------------------------------------

// 4.1 Dados de COLETA com endereços (coletor, local de retirada e local de entrega)
db.Coleta.aggregate([
  {
    $lookup: {
      from: "Doacao",
      localField: "_id.IdentificadorDoacao",
      foreignField: "_id",
      as: "doacao",
    },
  },
  { $unwind: "$doacao" },
  {
    $lookup: {
      from: "NecessidadeDoacao",
      localField: "_id.IdentificadorNecessidade",
      foreignField: "_id",
      as: "necessidade",
    },
  },
  { $unwind: "$necessidade" },
  {
    $lookup: {
      from: "Usuarios",
      localField: "doacao.IdentificadorUsuario",
      foreignField: "_id",
      as: "doador",
    },
  },
  { $unwind: "$doador" },
  {
    $lookup: {
      from: "Usuarios",
      localField: "necessidade.IdentificadorUsuario",
      foreignField: "_id",
      as: "recebedor",
    },
  },
  { $unwind: "$recebedor" },
  {
    $lookup: {
      from: "Usuarios",
      localField: "IdentificadorUsuario",
      foreignField: "_id",
      as: "coletor",
    },
  },
  { $unwind: "$coletor" },
  {
    $project: {
      _id: 0,
      IdentificadorNecessidade: "$_id.IdentificadorNecessidade",
      IdentificadorDoacao: "$_id.IdentificadorDoacao",
      Coletor: "$coletor.Nome",
      TelefoneColetor: "$coletor.Phone",
      DataColeta: 1,
      DataEntrega: 1,
      Retirada: {
        Doador: "$doador.Nome",
        Endereco: "$doador.Endereco",
      },
      Entrega: {
        Recebedor: "$recebedor.Nome",
        Endereco: "$recebedor.Endereco",
      },
    },
  },
  { $sort: { DataColeta: 1 } },
]);

// 4.2 Dados de NECESSIDADE de doação incluindo endereços
db.NecessidadeDoacao.aggregate([
  {
    $lookup: {
      from: "Usuarios",
      localField: "IdentificadorUsuario",
      foreignField: "_id",
      as: "recebedor",
    },
  },
  { $unwind: "$recebedor" },
  {
    $lookup: {
      from: "TipoDoacao",
      localField: "IdentificadorTipoDoacao",
      foreignField: "_id",
      as: "tipo",
    },
  },
  { $unwind: "$tipo" },
  {
    $project: {
      _id: 1,
      Data: 1,
      Descricao: 1,
      Quantidade: 1,
      TipoDoacao: "$tipo.Descricao",
      Recebedor: "$recebedor.Nome",
      Phone: "$recebedor.Phone",
      Endereco: "$recebedor.Endereco",
      Coordenadas: "$recebedor.Coordenadas",
    },
  },
  { $sort: { Data: 1 } },
]);

// 4.3 Dados de DOAÇÃO incluindo endereços
db.Doacao.aggregate([
  {
    $lookup: {
      from: "Usuarios",
      localField: "IdentificadorUsuario",
      foreignField: "_id",
      as: "doador",
    },
  },
  { $unwind: "$doador" },
  {
    $lookup: {
      from: "TipoDoacao",
      localField: "IdentificadorTipoDoacao",
      foreignField: "_id",
      as: "tipo",
    },
  },
  { $unwind: "$tipo" },
  {
    $project: {
      _id: 1,
      Data: 1,
      Descricao: 1,
      Quantidade: 1,
      TipoDoacao: "$tipo.Descricao",
      Doador: "$doador.Nome",
      Phone: "$doador.Phone",
      Endereco: "$doador.Endereco",
      Coordenadas: "$doador.Coordenadas",
    },
  },
  { $sort: { Data: 1 } },
]);

// 4.4 Extra: quantidade total doada e necessitada por tipo de doação
db.TipoDoacao.aggregate([
  {
    $lookup: {
      from: "Doacao",
      localField: "_id",
      foreignField: "IdentificadorTipoDoacao",
      as: "doacoes",
    },
  },
  {
    $lookup: {
      from: "NecessidadeDoacao",
      localField: "_id",
      foreignField: "IdentificadorTipoDoacao",
      as: "necessidades",
    },
  },
  {
    $project: {
      _id: 0,
      TipoDoacao: "$Descricao",
      TotalDoado: { $sum: "$doacoes.Quantidade" },
      TotalNecessario: { $sum: "$necessidades.Quantidade" },
    },
  },
]);

// 4.5 Extra: coletas pendentes de entrega (retiradas, mas ainda não entregues)
db.Coleta.find(
  { DataEntrega: null },
  {
    _id: 1,
    IdentificadorUsuario: 1,
    DataColeta: 1,
    DataEntrega: 1,
  },
);

// 4.6 Extra: necessidades ainda sem coleta registrada
db.NecessidadeDoacao.aggregate([
  {
    $lookup: {
      from: "Coleta",
      localField: "_id",
      foreignField: "_id.IdentificadorNecessidade",
      as: "coletas",
    },
  },
  { $match: { coletas: { $size: 0 } } },
  { $project: { coletas: 0 } },
]);

// 4.7 Extra: número de coletas realizadas por coletor
db.Coleta.aggregate([
  { $group: { _id: "$IdentificadorUsuario", totalColetas: { $sum: 1 } } },
  {
    $lookup: {
      from: "Usuarios",
      localField: "_id",
      foreignField: "_id",
      as: "coletor",
    },
  },
  { $unwind: "$coletor" },
  { $project: { _id: 0, Coletor: "$coletor.Nome", totalColetas: 1 } },
  { $sort: { totalColetas: -1 } },
]);
