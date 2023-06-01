document.addEventListener('DOMContentLoaded', function() {

    var botaoCalcular = document.getElementById('botaoCalcular');
    botaoCalcular.addEventListener('click', function() {
        calcularSistemaLinear();
    });

        var numeroEquacoesInput = document.getElementById("numero-equacoes");
        numeroEquacoesInput.addEventListener("change", function () {
            var numeroEquacoes = parseInt(numeroEquacoesInput.value);
            var coeficientesDiv = document.getElementById("coeficientes");
            coeficientesDiv.innerHTML = "";

            for (var i = 1; i <= numeroEquacoes; i++) {
                var linhaDiv = document.createElement("div");

                for (var j = 1; j <= numeroEquacoes; j++) {
                    var input = document.createElement("input");
                    input.type = "number";
                    input.id = "a-" + i + "-" + j;
                    linhaDiv.appendChild(input);
                }

                var bInput = document.createElement("input");
                bInput.type = "number";
                bInput.id = "b-" + i;
                linhaDiv.appendChild(bInput);

                coeficientesDiv.appendChild(linhaDiv);
            }
        });

        function calcularSistemaLinear() {
            var opcao = document.getElementById("opcao").value;
            var n = parseInt(document.getElementById("numero-equacoes").value);
            var matrizA = [];
            var vetorB = [];

            for (var i = 1; i <= n; i++) {
                var linha = [];
                for (var j = 1; j <= n; j++) {
                    linha.push(parseFloat(document.getElementById("a-" + i + "-" + j).value));
                }
                matrizA.push(linha);
                vetorB.push(parseFloat(document.getElementById("b-" + i).value));
            }

            var x;

            if (opcao === "1") {
                x = eliminacaoGauss(matrizA, vetorB);
            } else if (opcao === "2") {
                x = gaussSeidel(matrizA, vetorB);
            } else {
                alert("Opção inválida.");
                return;
            }

            exibirSolucao(x);
        }

        function eliminacaoGauss(A, b) {
            var n = A.length;

            // Criar uma cópia da matriz A e vetor b
            var matrizA = [];
            var vetorB = [];
            for (var i = 0; i < n; i++) {
                matrizA.push(A[i].slice());
                vetorB.push(b[i]);
            }

            // Fase de eliminação
            for (var k = 0; k < n - 1; k++) {
                for (var i = k + 1; i < n; i++) {
                    var fator = matrizA[i][k] / matrizA[k][k];
                    for (var j = k + 1; j < n; j++) {
                        matrizA[i][j] -= fator * matrizA[k][j];
                    }
                    vetorB[i] -= fator * vetorB[k];
                }
            }

            // Fase de retrosubstituição
            var x = new Array(n);
            x[n - 1] = vetorB[n - 1] / matrizA[n - 1][n - 1];
            for (var i = n - 2; i >= 0; i--) {
                var soma = 0;
                for (var j = i + 1; j < n; j++) {
                    soma += matrizA[i][j] * x[j];
                }
                x[i] = (vetorB[i] - soma) / matrizA[i][i];
            }

            return x;
        }

        function gaussSeidel(A, b) {
            var n = A.length;
            var x = new Array(n).fill(0);
            var maxIteracoes = 1000;
            var tolerancia = 0.0001;

            for (var iteracao = 0; iteracao < maxIteracoes; iteracao++) {
                var erroMaximo = 0;

                for (var i = 0; i < n; i++) {
                    var soma1 = 0;
                    for (var j = 0; j < i; j++) {
                        soma1 += A[i][j] * x[j];
                    }

                    var soma2 = 0;
                    for (var j = i + 1; j < n; j++) {
                        soma2 += A[i][j] * x[j];
                    }

                    var novoValor = (b[i] - soma1 - soma2) / A[i][i];
                    var erro = Math.abs(novoValor - x[i]);
                    if (erro > erroMaximo) {
                        erroMaximo = erro;
                    }

                    x[i] = novoValor;
                }

                if (erroMaximo < tolerancia) {
                    break;
                }
            }

            return x;
        }


        function exibirSolucao(solucao) {
            var solucoesDiv = document.getElementById("solucoes");
            solucoesDiv.innerHTML = "";

            for (var i = 0; i < solucao.length; i++) {
                var p = document.createElement("p");
                p.innerHTML = "x" + (i + 1) + " = " + solucao[i];
                solucoesDiv.appendChild(p);
            }
        }


});

