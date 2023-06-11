document.addEventListener('DOMContentLoaded', function () {
    var botaoCalcular = document.getElementById('botaoCalcular');
    botaoCalcular.addEventListener('click', function () {
        calcularSistemaLinear();
    });

    var numeroEquacoesInput = document.getElementById("numero-equacoes");
    numeroEquacoesInput.addEventListener("change", function () {
        var numeroEquacoes = parseInt(numeroEquacoesInput.value);

        if (numeroEquacoes <= 1) {
            alert("A ordem da matriz deve ser maior que 1.");
            return;
          }
          
        var coeficientesDiv = document.getElementById("coeficientes");
        coeficientesDiv.innerHTML = "";

        for (var i = 1; i <= numeroEquacoes; i++) {
            var linhaDiv = document.createElement("div");

            for (var j = 1; j <= numeroEquacoes + 1; j++) {
                var input = document.createElement("input");
                input.type = "number";
                input.id = "equacao-" + i + "-coeficiente-" + j;
                linhaDiv.appendChild(input);
            }

            coeficientesDiv.appendChild(linhaDiv);
        }

        var gaussSeidelInputs = document.getElementById("gauss-seidel-inputs");
        if (gaussSeidelInputs.style.display === "block") {
            gerarInputsChuteInicial(numeroEquacoes);
        }
    });

    var opcaoSelect = document.getElementById("opcao");
    opcaoSelect.addEventListener("change", function () {
        var gaussSeidelInputs = document.getElementById("gauss-seidel-inputs");

        if (opcaoSelect.value === "2") {
            gaussSeidelInputs.style.display = "block";
            var numeroEquacoes = parseInt(numeroEquacoesInput.value);
            gerarInputsChuteInicial(numeroEquacoes);
        } else {
            gaussSeidelInputs.style.display = "none";
        }
    });
});

function gerarInputsChuteInicial(numeroEquacoes) {
    var chuteInicialDiv = document.getElementById("chute-inicial");
    chuteInicialDiv.innerHTML = "";

    for (var i = 1; i <= numeroEquacoes; i++) {
        var input = document.createElement("input");
        input.type = "number";
        input.id = "chute-" + i;
        chuteInicialDiv.appendChild(input);
    }
}

function calcularSistemaLinear() {
    var opcao = document.getElementById("opcao").value;
    var numeroEquacoes = parseInt(document.getElementById("numero-equacoes").value);
    var coeficientes = [];

    for (var i = 1; i <= numeroEquacoes; i++) {
        var linha = [];

        for (var j = 1; j <= numeroEquacoes + 1; j++) {
            var input = document.getElementById("equacao-" + i + "-coeficiente-" + j);
            linha.push(parseFloat(input.value));
        }

        coeficientes.push(linha);
    }

    if (opcao === "1") {
        var etapasDiv = document.getElementById("etapas");
        etapasDiv.innerHTML = "";

        var resultado = eliminacaoDeGauss(coeficientes);

        for (var i = 0; i < resultado.etapas.length; i++) {
            var etapa = resultado.etapas[i];
            var etapaDiv = document.createElement("div");
            etapaDiv.classList.add("etapa");

            var titulo = document.createElement("h2");
            titulo.textContent = "Etapa " + (i + 1);
            etapaDiv.appendChild(titulo);

            var tabela = document.createElement("table");
            tabela.classList.add("matrix-table");

            for (var j = 0; j < etapa.length; j++) {
                var linha = document.createElement("tr");

                for (var k = 0; k < etapa[j].length; k++) {
                    var valor = etapa[j][k];
                    var coluna = document.createElement("td");
                    coluna.textContent = isNaN(valor) ? '' : valor.toFixed(5);
                    linha.appendChild(coluna);
                }

                tabela.appendChild(linha);
            }

            etapaDiv.appendChild(tabela);
            etapasDiv.appendChild(etapaDiv);
        }

        var solucoesDiv = document.getElementById("solucoes");
        solucoesDiv.innerHTML = "";

        var solucoesTexto = document.createElement("p");
        var solucoesArray = resultado.solucoes.map(function (solucao, index) {
            return "x" + (index + 1) + " = " + solucao.toFixed(5);
        });
        solucoesTexto.textContent = "Soluções: " + solucoesArray.join(", ");
        solucoesDiv.appendChild(solucoesTexto);
    } else if (opcao === "2") {
        var chuteInicial = [];

        for (var i = 1; i <= numeroEquacoes; i++) {
            var input = document.getElementById("chute-" + i);
            chuteInicial.push(parseFloat(input.value));
        }

        var precisao = parseFloat(document.getElementById("precisao").value);
        var iteracoesMaximas = parseInt(document.getElementById("iteracoes-maximas").value);

        var etapasDiv = document.getElementById("etapas");
        etapasDiv.innerHTML = "";

        var resultado = gaussSeidel(coeficientes, chuteInicial, precisao, iteracoesMaximas);

        for (var i = 0; i < resultado.etapas.length; i++) {
            var etapa = resultado.etapas[i];
            var etapaDiv = document.createElement("div");
            etapaDiv.classList.add("etapa");

            var titulo = document.createElement("h2");
            titulo.textContent = "Iteração " + (i + 1);
            etapaDiv.appendChild(titulo);

            var tabela = document.createElement("table");
            tabela.classList.add("matrix-table");

            for (var j = 0; j < etapa.length; j++) {
                var linha = document.createElement("tr");

                for (var k = 0; k < etapa[j].length; k++) {
                    var valor = etapa[j][k];
                    var coluna = document.createElement("td");
                    coluna.textContent = valor.toFixed(5);
                    linha.appendChild(coluna);
                }

                tabela.appendChild(linha);
            }

            etapaDiv.appendChild(tabela);
            etapasDiv.appendChild(etapaDiv);
        }

        var solucoesDiv = document.getElementById("solucoes");
        solucoesDiv.innerHTML = "";

        var solucoesTexto = document.createElement("p");
        solucoesTexto.textContent = "Soluções: " + resultado.solucoes.map(function (solucao) {
            return solucao.toFixed(5);
        }).join(", ");
        solucoesDiv.appendChild(solucoesTexto);
    }
}

function eliminacaoDeGauss(coeficientes) {
    var etapas = [];
    var n = coeficientes.length;

    etapas.push(JSON.parse(JSON.stringify(coeficientes))); 

    for (var k = 0; k < n - 1; k++) {
        for (var i = k + 1; i < n; i++) {
            var multiplicador = coeficientes[i][k] / coeficientes[k][k];

            for (var j = k; j < n + 1; j++) {
                coeficientes[i][j] -= multiplicador * coeficientes[k][j];
            }
        }

        var etapa = JSON.parse(JSON.stringify(coeficientes));
        etapas.push(etapa);

        if (etapa[k + 1][k] !== 0) {
            var colunaZero = [];

            for (var i = 0; i < n + 1; i++) {
                colunaZero.push(0);
            }

            colunaZero[k] = 1;
            etapa.splice(k + 1, 0, colunaZero);
            etapas.push(etapa); 
        }
    }

    var solucoes = [];
    solucoes[n - 1] = coeficientes[n - 1][n] / coeficientes[n - 1][n - 1];

    for (var i = n - 2; i >= 0; i--) {
        var soma = 0;

        for (var j = i + 1; j < n; j++) {
            soma += coeficientes[i][j] * solucoes[j];
        }

        solucoes[i] = (coeficientes[i][n] - soma) / coeficientes[i][i];
    }

    return {
        etapas: etapas,
        solucoes: solucoes
    };
}




function gaussSeidel(coeficientes, chuteInicial, precisao, iteracoesMaximas) {
    var etapas = [];
    var n = coeficientes.length;
    var solucoes = chuteInicial.slice();

    for (var iteracao = 0; iteracao < iteracoesMaximas; iteracao++) {
        var iteracaoAnterior = solucoes.slice();

        for (var i = 0; i < n; i++) {
            var soma = 0;

            for (var j = 0; j < n; j++) {
                if (j !== i) {
                    soma += coeficientes[i][j] * solucoes[j];
                }
            }

            solucoes[i] = (coeficientes[i][n] - soma) / coeficientes[i][i];
        }

        etapas.push(iteracaoAnterior.map(function (valor, index) {
            return [valor, solucoes[index]];
        }));

        var normaDiferenca = normaMaxima(subtrairVetores(solucoes, iteracaoAnterior));

        if (normaDiferenca <= precisao) {
            break;
        }
    }

    return {
        etapas: etapas,
        solucoes: solucoes
    };
}

function subtrairVetores(vetor1, vetor2) {
    var resultado = [];

    for (var i = 0; i < vetor1.length; i++) {
        resultado.push(vetor1[i] - vetor2[i]);
    }

    return resultado;
}

function normaMaxima(vetor) {
    var maximo = Math.abs(vetor[0]);

    for (var i = 1; i < vetor.length; i++) {
        var valorAbsoluto = Math.abs(vetor[i]);

        if (valorAbsoluto > maximo) {
            maximo = valorAbsoluto;
        }
    }

    return maximo;
}