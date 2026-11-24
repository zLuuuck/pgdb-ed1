use("RH");

// Cria colecao alunosutp com o conteúdo abaixo.
db.alunosutp.insertMany([
  {
    _id: 0,
    sID: 22001,
    nome: "Alex",
    ano: 1,
    AV: 4.0,
    ED: 3.4,
    materias: ["PBD", "POO", "AOO", "TCC"],
    CodTipoSang: 1,
  },
  {
    _id: 1,
    sID: 21001,
    nome: "Bernardo",
    ano: 2,
    AV: 3.7,
    ED: 3.0,
    materias: ["LPR", "CDI"],
    CodTipoSang: 3,
  },
  {
    _id: 2,
    sID: 20010,
    nome: "Chris",
    ano: 3,
    AV: 2.5,
    ED: 2.4,
    materias: ["LPR", "EDS", "AOO"],
    CodTipoSang: 3,
  },
  {
    _id: 3,
    sID: 22021,
    nome: "Danilo",
    ano: 1,
    AV: 3.2,
    ED: 3.4,
    materias: ["PBD", "POO", "AOO"],
    CodTipoSang: 8,
  },
  {
    _id: 4,
    sID: 17301,
    nome: "Haline",
    ano: 6,
    AV: 3.1,
    ED: 3.0,
    materias: ["PBD", "POO", "AOO"],
    CodTipoSang: 2,
  },
  {
    _id: 5,
    sID: 21022,
    nome: "Faby",
    ano: 1,
    AV: 2.2,
    ED: 2.4,
    materias: ["PBD", "EDS", "POO", "AOO"],
    CodTipoSang: 4,
  },
  {
    _id: 6,
    sID: 20020,
    nome: "Georgia",
    ano: 3,
    AV: 2.8,
    ED: 2.4,
    materias: ["PBD", "POO", "AOO"],
    CodTipoSang: 6,
  },
  {
    _id: 7,
    sID: 18020,
    nome: "Alisson",
    ano: 5,
    AV: 2.9,
    ED: 2.9,
    materias: ["LPR", "POO", "AOO", "TCC"],
    CodTipoSang: 7,
  },
]);

db.alunosutp.aggregate(
  { $project: { _id: 1, nome: 1, AV: 1 } },
  { $sort: { nome: -1 } },
  { $match: { nome: "Danilo" } },
);

use("RH");

db.alunosutp.aggregate(
  {
    $project: {
      _id: 1,
      nome: 1,
      AV: 1,
      ED: 1,
      NOTA: {
        $sum: ["$AV", "$ED"],
      },
    },
  },
  { $sort: { NOTA: 1 } },
);
 