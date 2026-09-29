(function () {
  /* ==========================================================================
     1. CONTAGEM REGRESSIVA
     ========================================================================== */
  var alvo = new Date("2026-10-04T08:00:00-03:00").getTime();

  function tick() {
    var ms = alvo - Date.now();
    if (ms <= 0) {
      document.getElementById("cd-d").textContent = "0";
      document.getElementById("cd-h").textContent = "0";
      document.getElementById("cd-m").textContent = "0";
      document.getElementById("cd-label").textContent =
        "O 1º turno já começou. Eventual 2º turno: 25 de outubro de 2026.";
      return;
    }
    document.getElementById("cd-d").textContent = Math.floor(ms / 864e5);
    document.getElementById("cd-h").textContent = String(
      Math.floor(ms / 36e5) % 24
    ).padStart(2, "0");
    document.getElementById("cd-m").textContent = String(
      Math.floor(ms / 6e4) % 60
    ).padStart(2, "0");
  }

  tick();
  setInterval(tick, 30000);

  /* ==========================================================================
     2. URNA ELETRÔNICA SIMULADORA
     ========================================================================== */
  var ds = [document.getElementById("d1"), document.getElementById("d2")];
  var val = "";
  var ver = document.getElementById("verdict");

  function paint() {
    ds[0].textContent = val[0] || "";
    ds[1].textContent = val[1] || "";
    ds[0].classList.toggle("blink", val.length === 0);
    ds[1].classList.toggle("blink", val.length === 1);
  }

  function say(t, b) {
    ver.innerHTML = "<b>" + t + "</b>" + b;
  }

  document.querySelectorAll(".keys button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (val.length < 2) {
        val += b.dataset.k;
        paint();
      }
    });
  });

  document.getElementById("k-corrige").addEventListener("click", function () {
    val = "";
    paint();
    say("Sua idade", "Digite de novo e aperte CONFIRMA.");
  });

  document.getElementById("k-branco").addEventListener("click", function () {
    val = "";
    paint();
    say(
      "Voto em branco",
      "Na eleição de verdade, votar em branco é uma opção válida — mas não escolhe ninguém. Aqui, digite sua idade."
    );
  });

  document.getElementById("k-confirma").addEventListener("click", function () {
    if (!val) {
      say("Faltou a idade", "Digite dois números antes de confirmar.");
      return;
    }
    var n = parseInt(val, 10);
    if (n < 15) {
      say(
        "Ainda não",
        "O título pode ser tirado a partir dos 15 anos. Enquanto isso, acompanhe e converse sobre as eleições."
      );
    } else if (n === 15) {
      say(
        "Tire o título",
        "Aos 15 você já pode se alistar. Se completar 16 até o dia da eleição, pode votar."
      );
    } else if (n < 18) {
      say(
        "Facultativo",
        "Seu voto não é obrigatório — mas conta igual ao de qualquer eleitor. Tirou o título, pode votar."
      );
    } else if (n <= 70) {
      say(
        "Obrigatório",
        "Para alfabetizados de 18 a 70 anos. Se não puder votar, justifique a ausência."
      );
    } else {
      say("Facultativo", "Acima de 70 anos o voto é facultativo. Seu voto continua valendo.");
    }
    val = "";
    ds.forEach(function (d) {
      d.classList.remove("blink");
    });
  });

  document.addEventListener("keydown", function (e) {
    var r = document.querySelector(".urna").getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (
      /^\d$/.test(e.key) &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "SELECT"
    ) {
      if (val.length < 2) {
        val += e.key;
        paint();
      }
    }
  });

  /* ==========================================================================
     3. QUIZ / CHECAGEM DE FATOS
     ========================================================================== */
  var Q = [
    {
      who: "Flávio Bolsonaro",
      role: "candidato à Presidência",
      c: "Mais de 32 milhões de eleitores não votaram no 2º turno de 2022.",
      v: "fato",
      e: "Segundo o TSE, 32.200.558 eleitores não compareceram ao 2º turno — 20,59% do eleitorado apto. Mas a abstenção não permite concluir em quem essas pessoas votariam.",
      s: "TSE, resultados 2022"
    },
    {
      who: "Ronaldo Caiado",
      role: "candidato à Presidência",
      c: "Trinta e oito milhões de brasileiros não foram votar em 2022.",
      v: "meio",
      e: "A base é verdadeira, mas o número foi exagerado: cerca de 32,7 milhões faltaram no 1º turno e 32,2 milhões no 2º — uns 5 milhões abaixo do citado.",
      s: "TSE, resultados 2022"
    },
    {
      who: "Ronaldo Caiado",
      role: "candidato à Presidência",
      c: "O STF concedeu anistia a Lula.",
      v: "fake",
      e: "Em 2021 o STF anulou as condenações da Lava Jato porque a 13ª Vara de Curitiba não tinha competência. Anistia é perdão por lei, atribuição do Congresso. Não houve anistia.",
      s: "STF, decisões de março e abril de 2021"
    },
    {
      who: "Lula",
      role: "candidato à Presidência",
      c: "O PIB só voltou a crescer mais de 2% quando eu voltei à Presidência.",
      v: "fake",
      e: "O Brasil já havia crescido mais de 2% antes do terceiro mandato: 3,02% em 2022. Depois vieram 3,24% (2023), 3,42% (2024) e 2,29% (2025).",
      s: "IBGE, Contas Nacionais"
    },
    {
      who: "Lula",
      role: "candidato à Presidência",
      c: "Herdei em janeiro de 2023 um déficit primário de 2,8% do PIB.",
      v: "fake",
      e: "O Governo Central fechou 2022 com superávit primário de R$ 46,4 bilhões, cerca de 0,5% do PIB. O déficit de cerca de 2,1% do PIB veio em 2023.",
      s: "Tesouro Nacional, Resultado do Tesouro"
    },
    {
      who: "Lula",
      role: "candidato à Presidência",
      c: "O Brasil tem, depois da China, a maior reserva de terras raras.",
      v: "fato",
      e: "O Brasil tem cerca de 11 milhões de toneladas em reservas, atrás só da China (44 milhões). Mas produz pouco: cerca de 2 mil toneladas em 2025.",
      s: "USGS, Mineral Commodity Summaries 2026"
    },
    {
      who: "Romeu Zema",
      role: "candidato à Presidência",
      c: "Cerca de 40 milhões de brasileiros trabalham na informalidade.",
      v: "fato",
      e: "Fato por arredondamento: a informalidade era de 37,4% dos ocupados no 2º tri de 2026, cerca de 38,54 milhões de pessoas.",
      s: "IBGE, PNAD Contínua"
    },
    {
      who: "Ronaldo Caiado",
      role: "candidato à Presidência",
      c: "Cerca de 82% das famílias brasileiras estão endividadas.",
      v: "fato",
      e: "Pesquisa da CNC de julho de 2026 apontou 82%, o maior da série. Atenção: endividada (tem cartão, parcela, financiamento) não é o mesmo que inadimplente.",
      s: "CNC, julho de 2026"
    },
    {
      who: "Ronaldo Caiado",
      role: "candidato à Presidência",
      c: "Goiás tem a menor taxa de evasão escolar do Brasil.",
      v: "fake",
      e: "Goiás tem taxas baixas, mas não as menores: no ensino médio estadual ficou em 8º (1%), atrás de Mato Grosso (0,2%) e Paraná (0,3%), entre outros.",
      s: "Inep, taxas de rendimento"
    },
    {
      who: "Boato sobre Hertz Dias",
      role: "candidato do PSTU à Presidência",
      c: "Hertz Dias quer extinguir o STF.",
      v: "fake",
      e: "O programa de Hertz critica o Judiciário, mas não propõe extinguir o STF. Essa proposta é do programa de Rui Costa Pimenta (PCO). O boato troca candidatos.",
      s: "Planos de governo registrados no TSE"
    },
    {
      who: "Wilson Grassi",
      role: "candidato do Democrata à Presidência",
      c: "Wilson Grassi propôs o programa “Meu Botox, Minha Vida”.",
      v: "fato",
      e: "Não é montagem: ele defendeu em entrevistas a aplicação de toxina botulínica em mulheres de baixa renda com recursos públicos — sem estudo de custos apresentado.",
      s: "Congresso em Foco; Metrópoles"
    },
    {
      who: "Boato sobre Max Maciel",
      role: "candidato à reeleição no DF",
      c: "Max Maciel é candidato a deputado estadual.",
      v: "fake",
      e: "No Distrito Federal não existe deputado estadual. Max Maciel (PSOL) concorre a deputado distrital, cargo que já exerce na Câmara Legislativa desde 2023.",
      s: "TSE; CLDF"
    },
    {
      who: "Boato sobre Cris Britto",
      role: "candidata no DF",
      c: "Cris Britto nunca ocupou cargo no governo federal.",
      v: "fake",
      e: "Cristiane Britto foi ministra de Estado em 2022, fato documentado por fontes oficiais e jornalísticas. A candidatura dela aparece como deferida.",
      s: "TSE; registros oficiais"
    },
    {
      who: "Samara Martins",
      role: "candidata da UP à Presidência",
      c: "Samara Martins já foi candidata a vice-presidente.",
      v: "fato",
      e: "Em 2022 ela foi vice na chapa de Leonardo Péricles (UP), com 53.519 votos. Também disputou vaga de vereadora em Natal em 2020.",
      s: "TSE, resultados 2022"
    },
    {
      who: "Renan Santos",
      role: "candidato à Presidência",
      c: "A direita jovem é masculina e a esquerda jovem é feminina.",
      v: "meio",
      e: "Um estudo da FES achou 20% das mulheres jovens e 16% dos homens jovens identificados com a esquerda, mas outras séries (Lapop, Latinobarómetro) veem diferença dentro da margem de erro.",
      s: "Fundação Friedrich Ebert; Lapop"
    }
  ];

  var L = { fato: "Fato", fake: "Fake", meio: "Não é bem assim" };
  var i = 0;
  var ans = new Array(Q.length).fill(null);

  var $ = function (id) {
    return document.getElementById(id);
  };

  var dots = $("qdots");
  if (dots) {
    Q.forEach(function () {
      dots.appendChild(document.createElement("i"));
    });
  }

  function render() {
    var q = Q[i];
    var a = ans[i];

    if ($("qwho")) $("qwho").innerHTML = "<b>" + q.who + "</b><span>· " + q.role + "</span><span>· " + (i + 1) + " de " + Q.length + "</span>";
    if ($("qclaim")) $("qclaim").textContent = q.c;

    document.querySelectorAll("#qchoices button").forEach(function (b) {
      b.disabled = a !== null;
      b.classList.toggle("picked", a !== null && b.dataset.v === q.v);
      b.style.opacity = a !== null && b.dataset.v !== q.v && b.dataset.v !== a ? ".45" : "";
    });

    if ($("qreveal")) $("qreveal").hidden = a === null;

    if (a !== null) {
      if ($("qverdict")) $("qverdict").innerHTML = '<span class="pill ' + q.v + '">' + L[q.v] + "</span>";
      if ($("qres")) $("qres").textContent = a === q.v ? "Você acertou." : "Não foi dessa vez — você marcou “" + L[a] + "”.";
      if ($("qexp")) $("qexp").textContent = q.e;
      if ($("qsrc")) $("qsrc").textContent = "Fonte: " + q.s;
    }

    if ($("qprev")) $("qprev").disabled = i === 0;
    if ($("qnext")) $("qnext").textContent = i === Q.length - 1 ? "Recomeçar" : "Próxima";

    if (dots) {
      Array.prototype.forEach.call(dots.children, function (d, k) {
        d.className = (ans[k] === null ? "" : ans[k] === Q[k].v ? "ok" : "no") + (k === i ? " cur" : "");
      });
    }

    var done = ans.filter(function (x) { return x !== null; }).length;
    var ok = ans.filter(function (x, k) { return x === Q[k].v; }).length;

    if ($("qscore")) $("qscore").textContent = ok + "/" + done;
    if ($("qmsg")) {
      $("qmsg").textContent =
        done === 0
          ? "Responda para ver seu resultado."
          : done < Q.length
          ? Q.length - done + " frases restantes."
          : ok >= 12
          ? "Olho de checador. Agora passe adiante — só o que for fato."
          : ok >= 8
          ? "Bom faro. Desconfie das frases absolutas."
          : "Vale reler as dicas de checagem abaixo.";
    }
  }

  document.querySelectorAll("#qchoices button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (ans[i] === null) {
        ans[i] = b.dataset.v;
        render();
      }
    });
  });

  if ($("qnext")) {
    $("qnext").addEventListener("click", function () {
      if (i === Q.length - 1) {
        ans.fill(null);
        i = 0;
      } else {
        i++;
      }
      render();
    });
  }

  if ($("qprev")) {
    $("qprev").addEventListener("click", function () {
      if (i > 0) {
        i--;
        render();
      }
    });
  }

  render();

  /* ==========================================================================
     4. GRÁFICO SVG (EDUCAÇÃO/SAÚDE)
     ========================================================================== */
  (function () {
    var svg = $("edu-chart");
    if (!svg) return;

    var NS = "http://www.w3.org/2000/svg";
    var data = [
      ["2022", 5.2, 4.9],
      ["2023", 4.93, 4.72],
      ["2024", 5.1, 5.03]
    ];
    var x0 = 48, y0 = 220, h = 180, max = 6, gw = 180, bw = 56;

    function el(t, a, txt) {
      var e = document.createElementNS(NS, t);
      for (var k in a) e.setAttribute(k, a[k]);
      if (txt != null) e.textContent = txt;
      svg.appendChild(e);
      return e;
    }

    [0, 2, 4, 6].forEach(function (v) {
      var y = y0 - (v / max) * h;
      el("line", { x1: x0, x2: 620, y1: y, y2: y, stroke: "var(--line)", "stroke-width": 1 });
      el("text", { x: x0 - 10, y: y + 4, "text-anchor": "end", "font-size": 12, fill: "var(--muted)" }, v + "%");
    });

    data.forEach(function (d, k) {
      var gx = x0 + 30 + k * gw;
      [
        [d[1], "var(--ink)"],
        [d[2], "var(--orange)"]
      ].forEach(function (p, j) {
        var bh = (p[0] / max) * h;
        var x = gx + j * (bw + 8);
        el("rect", { x: x, y: y0 - bh, width: bw, height: bh, fill: p[1], rx: 2 });
        el("text",
          {
            x: x + bw / 2,
            y: y0 - bh - 7,
            "text-anchor": "middle",
            "font-size": 13,
            "font-weight": 700,
            fill: "var(--ink)"
          },
          p[0].toFixed(2).replace(".", ",").replace(/,?0+$/, "").replace(/^(\d),(\d)$/, "$1,$2")
        );
      });
      el("text", { x: gx + bw + 4, y: y0 + 22, "text-anchor": "middle", "font-size": 13, "font-weight": 600, fill: "var(--ink)" }, d[0]);
    });
  })();

  /* ==========================================================================
     5. HISTÓRICO / LINHA DO TEMPO
     ========================================================================== */
  var H = [
    ["1998", "Fernando Henrique Cardoso", "PSDB · reeleito no 1º turno", "Joaquim Roriz", "PMDB · 2º turno", "Luiz Estevão", "PMDB · cassado pelo Senado em 2000"],
    ["2002", "Lula", "PT · venceu José Serra no 2º turno", "Joaquim Roriz", "PMDB · reeleito no 2º turno", "Cristovam Buarque e Paulo Octávio", "674.086 e 547.969 votos"],
    ["2006", "Lula", "PT · reeleito, mais de 58 milhões de votos", "José Roberto Arruda", "PFL · 1º turno, 50,38%", "Joaquim Roriz", "PMDB · 51,83% dos válidos"],
    ["2010", "Dilma Rousseff", "PT · 56,05%, primeira mulher presidente", "Agnelo Queiroz", "PT · 66,10% no 2º turno", "Cristovam Buarque e Rodrigo Rollemberg", "PDT e PSB"],
    ["2014", "Dilma Rousseff", "PT · reeleita", "Rodrigo Rollemberg", "PSB", "Reguffe", "vaga única"],
    ["2018", "Jair Bolsonaro", "PSL · 55,13% no 2º turno", "Ibaneis Rocha", "MDB · 69,79% no 2º turno", "Leila do Vôlei e Izalci Lucas", "PSB e PSDB"],
    ["2022", "Lula", "PT · 50,90% no 2º turno", "Ibaneis Rocha", "MDB · reeleito no 1º turno, ~50,3%", "Damares Alves", "Republicanos · ~45% dos válidos"]
  ];

  var tl = $("timeline");
  if (tl) {
    H.forEach(function (r) {
      var d = document.createElement("div");
      d.className = "tl";
      d.innerHTML =
        '<div class="y">' + r[0] + "</div>" +
        '<div class="c"><small>Presidente</small><b>' + r[1] + "</b><span>" + r[2] + "</span></div>" +
        '<div class="c"><small>Governador do DF</small><b>' + r[3] + "</b><span>" + r[4] + "</span></div>" +
        '<div class="c sen"><small>Senado pelo DF</small><b>' + r[5] + "</b><span>" + r[6] + "</span></div>";
      tl.appendChild(d);
    });

    var now = document.createElement("div");
    now.className = "tl now";
    now.innerHTML =
      '<div class="y">2026</div>' +
      '<div class="c"><small>Presidente</small><b>13 candidaturas</b><span>Lula (PT) segue em exercício até o fim do mandato</span></div>' +
      '<div class="c"><small>Governador do DF</small><b>11 candidaturas</b><span>algumas ainda aguardam julgamento</span></div>' +
      '<div class="c sen"><small>Senado pelo DF</small><b>2 vagas em disputa</b><span>atuais: Damares Alves, Leila do Vôlei e Izalci Lucas</span></div>';
    tl.appendChild(now);
  }

  /* ==========================================================================
     6. MAPA DA CÂMARA / RAIO-X
     ========================================================================== */
  var UFN = {
    AC: "Acre", AL: "Alagoas", AM: "Amazonas", AP: "Amapá", BA: "Bahia", CE: "Ceará",
    DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
    MG: "Minas Gerais", MS: "Mato Grosso do Sul", MT: "Mato Grosso", PA: "Pará",
    PB: "Paraíba", PE: "Pernambuco", PI: "Piauí", PR: "Paraná", RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte", RO: "Rondônia", RR: "Roraima", RS: "Rio Grande do Sul",
    SC: "Santa Catarina", SE: "Sergipe", SP: "São Paulo", TO: "Tocantins"
  };
})();