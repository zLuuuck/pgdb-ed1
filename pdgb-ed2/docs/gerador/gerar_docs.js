// Gera os documentos de entrega (.docx) do Exercício Prático 2 e do Trabalho 2.
// Uso: node gerar_docs.js <dir pdgb-ed2>
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, HeadingLevel, PageBreak,
  LevelFormat, Footer, PageNumber, TableOfContents,
} = require("docx");

const BASE = process.argv[2];
const DOCS = path.join(BASE, "docs");
const read = (f) => fs.readFileSync(path.join(BASE, f), "utf8");

// ---------------------------------------------------------------- estilo
const CM = 567; // DXA por cm
const PAGE = {
  size: { width: 11906, height: 16838 }, // A4
  margin: { top: 3 * CM, left: 3 * CM, bottom: 2 * CM, right: 2 * CM },
};
const CONTENT_W = 11906 - 5 * CM; // 9071 DXA = 16 cm
const IMG_W = 560; // px (≈ 14,8 cm)

const styles = {
  default: { document: { run: { font: "Arial", size: 24 } } },
  paragraphStyles: [
    { id: "Normal", name: "Normal", run: { font: "Arial", size: 24 },
      paragraph: { spacing: { line: 360, after: 120 } } },
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Arial", size: 26, bold: true, allCaps: true },
      paragraph: { spacing: { before: 360, after: 200 }, keepNext: true, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Arial", size: 24, bold: true },
      paragraph: { spacing: { before: 240, after: 120 }, keepNext: true, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Arial", size: 24, italics: true, bold: true },
      paragraph: { spacing: { before: 200, after: 100 }, keepNext: true, outlineLevel: 2 } },
  ],
};
const numbering = {
  config: [{
    reference: "bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
  }],
};

// ---------------------------------------------------------------- helpers
// suporta **negrito** e `código` inline
function runs(text, opts = {}) {
  const out = [];
  for (const part of String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/)) {
    if (!part) continue;
    if (part.startsWith("**")) out.push(new TextRun({ text: part.slice(2, -2), bold: true, size: opts.size }));
    else if (part.startsWith("`")) out.push(new TextRun({ text: part.slice(1, -1), font: "Courier New", size: (opts.size ?? 24) - 2 }));
    else out.push(new TextRun({ text: part, bold: opts.bold, size: opts.size }));
  }
  return out;
}
const p = (text, opts = {}) => new Paragraph({
  alignment: opts.align ?? AlignmentType.JUSTIFIED, spacing: opts.spacing, children: runs(text, opts),
});
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const bullet = (t) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: runs(t) });
const center = (t, o = {}) => p(t, { ...o, align: AlignmentType.CENTER });
const espaco = (before) => new Paragraph({ spacing: { before, after: 0 }, children: [] });
const brk = () => new Paragraph({ children: [new PageBreak()] });

const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };

function code(src, label) {
  const kids = [new Paragraph({ spacing: { after: 60 },
    children: [new TextRun({ text: label, size: 16, color: "595959", italics: true })] })];
  for (const ln of src.replace(/\s+$/, "").split("\n")) {
    kids.push(new Paragraph({ spacing: { line: 240, before: 0, after: 0 },
      children: [new TextRun({ text: ln.length ? ln : " ", font: "Courier New", size: 16 })] }));
  }
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA }, borders,
      shading: { type: ShadingType.CLEAR, fill: "F3F3F3", color: "auto" },
      margins: { top: 120, bottom: 120, left: 160, right: 160 }, children: kids,
    })] })],
  });
}

function table(header, rows, widths) {
  const mk = (r, head) => new TableRow({ tableHeader: head, children: r.map((t, i) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA }, borders,
    shading: head ? { type: ShadingType.CLEAR, fill: "D9E2F3", color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ spacing: { line: 260, after: 0 }, children: runs(t, { size: 20, bold: head }) })],
  })) });
  return new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
    rows: [mk(header, true), ...rows.map((r) => mk(r, false))] });
}

// figura com legenda no padrão ABNT (título acima, fonte abaixo)
function makeFig() {
  let n = 0;
  return (file, titulo) => {
    n += 1;
    const buf = fs.readFileSync(file);
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    const width = Math.min(IMG_W, w);
    return [
      new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 160, after: 60 },
        children: [new TextRun({ text: `Figura ${n} – ${titulo}`, size: 20 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 40 },
        children: [new ImageRun({ type: "png", data: buf, transformation: { width, height: Math.round(h * width / w) },
          altText: { title: `Figura ${n}`, description: titulo, name: path.basename(file) } })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
        children: [new TextRun({ text: "Fonte: saída do mongosh executado no cluster MongoDB Atlas (2026).", size: 20 })] }),
    ];
  };
}
// todas as partes de uma print (q4_1.png, q4_2.png...)
function figs(fig, dir, prefix, titulo) {
  const re = new RegExp(`^${prefix}(_\\d+)?\\.png$`);
  const files = fs.readdirSync(dir).filter((f) => re.test(f))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true })).map((f) => path.join(dir, f));
  if (!files.length) throw new Error(`nenhuma print para ${prefix}`);
  return files.flatMap((f, i) => fig(f, files.length > 1 ? `${titulo} (parte ${i + 1} de ${files.length})` : titulo));
}

const footer = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
  children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })] })] });

// recorta o script da linha que casa `ini` até antes da próxima que casa `fim`
// (inclui/exclui as linhas "// -----" que emolduram os títulos)
function trecho(src, ini, fim) {
  const L = src.split("\n");
  let a = L.findIndex((l) => ini.test(l));
  if (a < 0) throw new Error("trecho não encontrado: " + ini);
  if (a > 0 && /^\/\/ -{10,}/.test(L[a - 1])) a -= 1;
  let b = fim ? L.findIndex((l, i) => i > a + 1 && fim.test(l)) : L.length;
  if (b < 0) throw new Error("fim não encontrado: " + fim);
  if (fim && /^\/\/ -{10,}/.test(L[b - 1])) b -= 1;
  return L.slice(a, b).join("\n").replace(/\n+$/, "");
}

const save = async (doc, nome) => {
  const out = path.join(DOCS, nome);
  fs.writeFileSync(out, await Packer.toBuffer(doc));
  console.log("gerado:", out);
};

// ================================================================ EXERCÍCIO
async function exercicio() {
  const src = read("exercicio.mongodb.js");
  const dir = path.join(DOCS, "prints", "exercicio");
  const fig = makeFig();
  const q = (n) => trecho(src, new RegExp(`^// Questão ${n}:`), n < 5 ? new RegExp(`^// Questão ${n + 1}:`) : null);
  const L = src.split("\n");
  const cab = L.slice(0, L.findIndex((l) => /^\/\/ Questão 1:/.test(l)) - 1).join("\n").replace(/\n+$/, "");

  const resposta = (n, enunciado, explic, figTitulo, extra = []) => [
    h2(`Questão ${n}`),
    p(enunciado),
    h3(n >= 4 ? "Comando(s) integrais do MongoDB usados para resolver essa questão"
      : "Comando(s) do MongoDB usados para resolver essa questão"),
    code(n === 1 ? cab + "\n\n" + q(1) : q(n), `exercicio.mongodb.js – Questão ${n}`),
    ...explic.map((t) => p(t, { spacing: { before: 160, after: 120 } })),
    ...extra,
    h3("Saída do programa"),
    ...figs(fig, dir, `q${n}`, figTitulo),
  ];

  const children = [
    center("**UNIVERSIDADE TUIUTI DO PARANÁ – UTP**", { size: 26 }),
    center("Programação em Banco de Dados – 2026/2"),
    center("**EXERCÍCIO PRÁTICO 2 – MongoDB / NoSQL**", { size: 28, spacing: { before: 200, after: 200 } }),
    p("**Aluno:** Lucas Toterol Rodrigues", { align: AlignmentType.LEFT }),
    p("**Ambiente de execução:** cluster MongoDB Atlas (nuvem), acessado pelo VS Code com a extensão MongoDB for VS Code (Playground). Banco de dados utilizado: `utp_pbd`.", { align: AlignmentType.LEFT }),
    p("**Arquivo fonte:** `exercicio.mongodb.js`. Ele executa todas as questões em sequência e pode ser rodado novamente, pois apaga e recria as coleções.", { align: AlignmentType.LEFT }),

    ...resposta(1,
      "Criar a coleção STOCKS com os dados (Symbol, Name, Date, Open, High, Low, Close, Volume) conforme as informações do enunciado (20 ações, pregão de 17/11/2025).",
      ["A coleção é apagada com `drop()` para que o script possa ser executado mais de uma vez sem duplicar dados, e os 20 documentos são inseridos com `insertMany()`. Os valores numéricos foram gravados como número (e não como texto) e a data como `ISODate`, o que permite cálculos e ordenações nas questões seguintes. Ao final, o script confere a quantidade de documentos (`countDocuments`) e exibe os três primeiros."],
      "Questão 1: criação da coleção STOCKS"),
    ...resposta(2,
      "Criar a coleção WALLET com os 13 documentos do enunciado (client, symbol, quantity, price).",
      ["Mesma estratégia da questão 1: `drop()` seguido de `insertMany()` com os documentos exatamente como no enunciado, inclusive o preço 288.35 do AAPL do cliente 3, conforme fornecido. O script exibe a contagem e todos os documentos inseridos."],
      "Questão 2: criação da coleção WALLET"),
    ...resposta(3,
      "Criar uma consulta que retorne o valor total da carteira por cliente (coleção WALLET), considerando quantity * price.",
      ["Foi usado o `aggregate()` com `$group`, agrupando por `client` e somando (`$sum`) o produto `$multiply: [quantity, price]` de cada documento. Em seguida, o `$project` renomeia o campo e arredonda o valor para duas casas (`$round`), e o `$sort` ordena por cliente."],
      "Questão 3: valor total da carteira por cliente",
      [table(["Cliente", "Valor total da carteira"],
        [["1", "24.652,60"], ["2", "18.980,87"], ["3", "96.837,25"], ["4", "15.797,00"], ["5", "17.324,00"]],
        [3000, 6071])]),
    ...resposta(4,
      "Criar uma consulta que retorne dados das coleções WALLET e STOCKS utilizando o conceito de Aggregate/Lookup (similar ao JOIN do SQL).",
      ["O `$lookup` liga cada documento de WALLET (campo `symbol`) ao documento de STOCKS com o mesmo `Symbol`, guardando o resultado no array `acao`. O `$unwind` desfaz esse array e funciona como um INNER JOIN: só ficam os registros que encontraram correspondência. O `$project` monta a saída com dados das duas coleções: nome da empresa e preço de fechamento (STOCKS), junto com cliente, quantidade e preço de compra (WALLET), além do valor atual da posição (`quantity * Close`).",
        "Equivalente em SQL: `SELECT w.client, w.symbol, s.Name, w.quantity, w.price, s.Close FROM WALLET w INNER JOIN STOCKS s ON s.Symbol = w.symbol`."],
      "Questão 4: junção WALLET × STOCKS com $lookup"),
    ...resposta(5,
      "Criar uma consulta que utilize o conceito de PIPELINE do banco de dados NoSQL (utilizando uma das coleções das questões 1 ou 2).",
      ["O pipeline de agregação processa os documentos de STOCKS em estágios encadeados, em que a saída de um estágio é a entrada do próximo:"],
      "Questão 5: pipeline de agregação sobre STOCKS",
      [bullet("`$match`: filtra as ações com volume negociado acima de 5 milhões;"),
        bullet("`$addFields`: calcula a variação percentual do dia ((Close − Open) / Open × 100) e a amplitude (High − Low);"),
        bullet("`$sort`: ordena da maior para a menor variação;"),
        bullet("`$limit`: mantém apenas as cinco primeiras;"),
        bullet("`$project`: escolhe os campos exibidos e arredonda os valores calculados."),
        p("Resultado: entre as ações mais negociadas, as cinco de maior alta no dia foram TSLA (+5,18%), AVGO (+1,77%), CSCO (+1,65%), ORCL (+1,43%) e PLTR (+1,41%).", { spacing: { before: 120 } })]),

    h2("Entrega"),
    bullet("**Exercício preenchido:** este documento, com o nome do aluno e as respostas das questões;"),
    bullet("**Arquivo fonte:** `exercicio.mongodb.js`;"),
    bullet("**Saída do programa:** prints acima e texto completo em `exercicio_saida.txt`."),
  ];

  const doc = new Document({ creator: "Lucas Toterol Rodrigues", title: "Exercício Prático 2 – MongoDB", styles, numbering,
    sections: [{ properties: { page: PAGE }, footers: { default: footer() }, children }] });
  await save(doc, "Exercicio_Pratico_2_Lucas_Toterol_Rodrigues.docx");
}

// ================================================================ TRABALHO 2
async function trabalho2() {
  const src = read("02_criacao.mongodb.js");
  const dir = path.join(DOCS, "prints", "trabalho2");
  const fig = makeFig();
  const equipe = ["Caio Federico Esquivel Lovera Arze", "Douglas Clayton Da Silva", "Fernando Bach", "Lucas Toterol Rodrigues"];
  const L = src.split("\n");
  const cab = L.slice(0, L.findIndex((l) => /^\/\/ 1\. BANCO/.test(l)) - 1).join("\n").replace(/\n+$/, "");

  // [nº no script, título, explicação]
  const consultas = [
    ["4.1", "Dados de coleta com endereços",
      "Parte da coleção Coleta e faz cinco `$lookup`: a Doação e a Necessidade (pelas duas partes do `_id` composto) e três vezes Usuarios, para trazer o Doador (endereço de retirada), o Recebedor (endereço de entrega) e o Coletor (nome e telefone para contato via WhatsApp). Cada `$unwind` transforma o array do lookup em objeto, e o `$project` organiza a saída nos blocos Retirada e Entrega."],
    ["4.2", "Dados de necessidade de doação incluindo endereços",
      "Une NecessidadeDoacao ao Recebedor (Usuarios) e ao TipoDoacao, exibindo descrição, quantidade, tipo, telefone, endereço completo e coordenadas do local onde a doação deve ser entregue."],
    ["4.3", "Dados de doação incluindo endereços",
      "Une Doacao ao Doador (Usuarios) e ao TipoDoacao, exibindo o que está sendo oferecido e o endereço e as coordenadas de onde a doação deve ser retirada."],
    ["4.4", "Total doado × total necessário por tipo de doação",
      "Para cada tipo de doação, soma as quantidades oferecidas e as necessárias, mostrando onde há falta (Roupas: 20 doadas para 23 necessárias) ou sobra (Mantimento: 37 doados para 30 necessários)."],
    ["4.5", "Coletas pendentes de entrega",
      "Lista as coletas já retiradas no doador, mas ainda não entregues ao recebedor (`DataEntrega: null`)."],
    ["4.6", "Necessidades ainda sem coleta",
      "Faz `$lookup` de NecessidadeDoacao para Coleta e filtra (`$match` com `$size: 0`) as necessidades que ainda não têm coleta vinculada, ou seja, que ainda aguardam doador e coletor."],
    ["4.7", "Número de coletas por coletor",
      "Agrupa as coletas por coletor (`$group` com `$sum`), busca o nome em Usuarios e ordena do coletor mais ativo para o menos ativo."],
  ];
  const re = (n) => new RegExp(`^// ${n.replace(".", "\\.")} `);
  const consultaBlocos = consultas.flatMap(([n, t, explic], i) => [
    h2(`5.${i + 1} ${t}${i >= 3 ? " (extra)" : ""}`),
    p(explic),
    code(trecho(src, re(n), i + 1 < consultas.length ? re(consultas[i + 1][0]) : null),
      `02_criacao.mongodb.js – consulta ${n}`),
    ...figs(fig, dir, `c${i + 1}`, `Consulta ${n}: ${t.toLowerCase()}`),
  ]);

  const children = [
    // ---------- capa
    center("**UNIVERSIDADE TUIUTI DO PARANÁ**"),
    center("FACULDADE DE CIÊNCIAS EXATAS E DE TECNOLOGIA"),
    center("Curso Superior de Tecnologia em Análise de Sistemas"),
    espaco(1200),
    ...equipe.map((n) => center(n.toUpperCase(), { spacing: { after: 40 } })),
    espaco(1600),
    center("**CRIAÇÃO DE BASE DE DADOS NO-SQL: APLICAÇÃO DE COLETA DE DOAÇÕES HUMANITÁRIAS**", { size: 28 }),
    center("PI Programação em Banco de Dados – Trabalho 2", { spacing: { before: 200 } }),
    espaco(2400),
    center("CURITIBA"),
    center("2026"),
    brk(),
    // ---------- sumário
    center("**SUMÁRIO**", { size: 26 }),
    new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-2" }),
    brk(),

    h1("1 Introdução"),
    p("Este trabalho apresenta os scripts de criação de um banco de dados NoSQL (MongoDB) para uma aplicação de coleta de doações de mantimentos, água, remédios, roupas e outros itens, com o objetivo de incentivar a ajuda humanitária. O sistema permite (1) informar necessidades de doação, (2) oferecer doações, (3) registrar a coleta (retirada e entrega) das doações e (4) consultar os dados do sistema."),
    p("O sistema possui três papéis de usuário:"),
    bullet("**Doador:** oferece mantimentos, água, remédios, roupas etc.;"),
    bullet("**Recebedor:** tem necessidade de receber doação;"),
    bullet("**Coletor:** voluntário que busca a doação no endereço do doador e a entrega no endereço do recebedor."),
    p("Conforme o enunciado, doações e necessidades são sempre feitas no endereço do próprio usuário, e as tratativas acontecem via WhatsApp. Por isso, endereço e telefone ficam no cadastro do usuário e são trazidos pelas consultas.", { spacing: { before: 120 } }),

    h1("2 Modelagem das coleções"),
    p("As entidades sugeridas no enunciado foram mapeadas para cinco coleções. O campo `_id` de cada coleção cumpre o papel da chave primária (PK) do diagrama, e os campos Identificador* fazem as referências entre coleções, resolvidas nas consultas com `$lookup`."),
    table(["Coleção", "Campos", "Observações"], [
      ["Usuarios", "_id, Nome, Coordenadas {Latitude, Longitude}, Endereco {Rua, Complemento, CEP, Cidade, Estado, Telefone}, Email, Phone, Tipo", "Validação `$jsonSchema`: campos obrigatórios e Tipo restrito a Doador, Coletor ou Recebedor."],
      ["TipoDoacao", "_id, Descricao", "Mantimento, Água, Remédio, Roupas."],
      ["NecessidadeDoacao", "_id, IdentificadorUsuario, Data, Descricao, IdentificadorTipoDoacao, Quantidade", "Registrada por um Recebedor."],
      ["Doacao", "_id, IdentificadorUsuario, Data, Descricao, IdentificadorTipoDoacao, Quantidade", "Oferecida por um Doador."],
      ["Coleta", "_id {IdentificadorNecessidade, IdentificadorDoacao}, IdentificadorUsuario, DataColeta, DataEntrega", "A PK composta é representada pelo `_id` composto. IdentificadorUsuario é o Coletor; DataEntrega nula indica coleta ainda não entregue."],
    ], [2000, 4071, 3000]),
    p("Os relacionamentos seguem o diagrama do enunciado: um usuário pode ter várias necessidades e várias doações; cada necessidade e cada doação têm um tipo; e cada coleta liga uma necessidade a uma doação e é realizada por um coletor.", { spacing: { before: 160 } }),

    h1("3 Execução do script"),
    p("Todo o trabalho está em um único arquivo, `02_criacao.mongodb.js`, que cria o banco, as coleções e os documentos e executa as consultas. Ele pode ser executado de duas formas:"),
    bullet("**VS Code:** abrir o arquivo com a extensão MongoDB for VS Code conectada ao servidor e executar o Playground; os resultados aparecem no painel Output > Playground output;"),
    bullet("**Terminal:** `mongosh \"<string de conexão>\" --file 02_criacao.mongodb.js`."),
    p("O script pode ser executado mais de uma vez: antes de criar as coleções, ele as remove (`drop()`), evitando dados duplicados. Cada consulta imprime um título e o resultado com `printjson()`, para que todas as saídas apareçam na execução. O script foi executado com sucesso em um cluster MongoDB Atlas, e as figuras da seção 5 são a saída dessa execução.", { spacing: { before: 120 } }),

    h1("4 Script de criação"),
    h2("4.1 Cabeçalho e integrantes"),
    code(cab, "02_criacao.mongodb.js – cabeçalho"),
    h2("4.2 Criação do banco de dados"),
    code(trecho(src, /^\/\/ 1\. BANCO/, /^\/\/ 2\. COLE/), "02_criacao.mongodb.js – banco de dados"),
    h2("4.3 Criação das coleções"),
    code(trecho(src, /^\/\/ 2\. COLE/, /^\/\/ 3\. DOCUMENTOS/), "02_criacao.mongodb.js – coleções"),
    h2("4.4 Inserção dos documentos"),
    p("Os dados de exemplo são consistentes entre si: necessidades são feitas por Recebedores, doações por Doadores e coletas por Coletores, e cada coleta liga uma necessidade e uma doação do mesmo tipo."),
    table(["Coleção", "Documentos", "Conteúdo"], [
      ["TipoDoacao", "4", "Mantimento, Água, Remédio, Roupas"],
      ["Usuarios", "9", "3 Doadores (1 a 3), 3 Recebedores (4 a 6) e 3 Coletores (7 a 9), todos em Curitiba/PR"],
      ["NecessidadeDoacao", "6", "Necessidades dos recebedores; a nº 6 ainda não tem coleta"],
      ["Doacao", "5", "Doações oferecidas pelos doadores"],
      ["Coleta", "5", "4 entregues e 1 retirada aguardando entrega"],
    ], [2400, 1500, 5171]),
    espaco(200),
    code(trecho(src, /^\/\/ 3\. DOCUMENTOS/, /^\/\/ 4\. CONSULTAS/), "02_criacao.mongodb.js – documentos"),

    h1("5 Consultas"),
    p("As consultas 5.1 a 5.3 atendem aos itens obrigatórios do enunciado (coleta, necessidade e doação com endereços). As consultas 5.4 a 5.7 são extras que a equipe considerou úteis para a operação do sistema. No script, elas estão na seção 4 (CONSULTAS), numeradas de 4.1 a 4.7."),
    ...consultaBlocos,

    h1("6 Considerações finais"),
    p("O script cria o banco `DoacoesHumanitarias` e as cinco coleções sugeridas, com validação de esquema em Usuarios e chave composta em Coleta. Ele também popula as coleções com dados consistentes e executa as consultas pedidas (coletas com endereços de retirada e entrega, necessidades e doações com endereços), além de consultas extras sobre saldo por tipo de doação, coletas pendentes, necessidades sem atendimento e produtividade dos coletores. Toda a execução foi validada em um cluster MongoDB Atlas."),
    h2("Arquivos entregues"),
    bullet("`02_criacao.mongodb.js`: script completo (banco, coleções, documentos e consultas);"),
    bullet("`02_criacao_saida.txt`: saída completa da execução;"),
    bullet("este documento, com os integrantes da equipe e a documentação."),
  ];

  const doc = new Document({ creator: equipe.join(", "), title: "Trabalho 2 – Base NoSQL de Doações Humanitárias",
    styles, numbering, features: { updateFields: true },
    sections: [{ properties: { page: PAGE }, footers: { default: footer() }, children }] });
  await save(doc, "Trabalho_2_NoSQL_Doacoes_Humanitarias.docx");
}

(async () => {
  fs.mkdirSync(DOCS, { recursive: true });
  await exercicio();
  await trabalho2();
})().catch((e) => { console.error(e); process.exit(1); });
