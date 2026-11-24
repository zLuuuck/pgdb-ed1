use("RH");

db.colaboradores.insertMany([
  { _id: 0, nome: "Peterson", idade: 28, cargo: "Ger. RH" },
  { _id: 1, nome: "Pamela", idade: 35, cargo: "Analista de Segurança" },
  { _id: 2, nome: "Talita", idade: 23, cargo: "Analista SEO" },
]);

use("RH");
db.colaboradores.find();


db.colaboradores.find( {idade: 28} );


db.colaboradores.find({ idade: {$gt:25} });

// Remove todos
db.colaboradores.remove()

db.colaboradores.update( { _id: 0 }, { $set: {cargo: "Gerente de RH"} } )


