document.addEventListener('DOMContentLoaded', function () {
    var botaoCalcular = document.getElementById('botaoCalcular');
    botaoCalcular.addEventListener('click', function () {
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
    

    function gaussSeidel(matriz, chuteInicial, precisao, iteracoesMaximas) {
        var n = matriz.length;
        var x = chuteInicial.slice();
        var xAnterior = chuteInicial.slice();
        var iteracao = 0;
        var convergiu = false;
      
        while (!convergiu && iteracao < iteracoesMaximas) {
          for (var i = 0; i < n; i++) {
            var soma = 0;
            for (var j = 0; j < n; j++) {
              if (j !== i) {
                soma += matriz[i][j] * x[j];
              }
            }
            x[i] = (matriz[i][n] - soma) / matriz[i][i];
          }
      
          convergiu = true;
          for (var k = 0; k < n; k++) {
            if (Math.abs((x[k] - xAnterior[k]) / x[k]) > precisao) {
              convergiu = false;
              break;
            }
          }
      
          xAnterior = x.slice();
          iteracao++;
        }
      
        return {
          solucao: x,
          convergiu: convergiu,
          iteracoes: iteracao
        };
      }


      function calcularSistemaLinear() {
        var opcao = parseInt(document.getElementById("opcao").value);
        var numeroEquacoes = parseInt(document.getElementById("numero-equacoes").value);
        var matriz = [];
        for (var i = 1; i <= numeroEquacoes; i++) {
          var linha = [];
          for (var j = 1; j <= numeroEquacoes; j++) {
            var input = document.getElementById("a-" + i + "-" + j);
            linha.push(parseFloat(input.value));
          }
          var bInput = document.getElementById("b-" + i);
          linha.push(parseFloat(bInput.value));
          matriz.push(linha);
        }
      
        var etapasDiv = document.getElementById("etapas");
        etapasDiv.innerHTML = "";
      
        if (opcao === 1) {
          var solucoesDiv = document.getElementById("solucoes");
          solucoesDiv.innerHTML = "";
      
          var etapas = eliminacaoGauss(matriz);
      
          for (var i = 0; i < etapas[0].length; i++) {
            var etapa = etapas[0][i];
            var etapaDiv = document.createElement("div");
            etapaDiv.classList.add("etapa");
      
            var h2 = document.createElement("h2");
            h2.textContent = "Etapa " + (i + 1);
            etapaDiv.appendChild(h2);
      
            var table = document.createElement("table");
            table.classList.add("matrix-table");
      
            for (var j = 0; j < etapa.length; j++) {
              var row = document.createElement("tr");
              for (var k = 0; k < etapa[j].length; k++) {
                var cell = document.createElement("td");
                cell.textContent = etapa[j][k];
                row.appendChild(cell);
              }
              table.appendChild(row);
            }
      
            etapaDiv.appendChild(table);
            etapasDiv.appendChild(etapaDiv);
          }
      
          exibirSolucao(etapas[1]);
        } else if (opcao === 2) {
          var chuteInicial = [];
          for (var i = 1; i <= numeroEquacoes; i++) {
            var input = document.getElementById("x-" + i);
            chuteInicial.push(parseFloat(input.value));
          }
          var precisao = parseFloat(document.getElementById("precisao").value);
          var iteracoesMaximas = parseInt(document.getElementById("iteracoes-maximas").value);
      
          var resultado = gaussSeidel(matriz, chuteInicial, precisao, iteracoesMaximas);
      
          var solucoesDiv = document.getElementById("solucoes");
          solucoesDiv.innerHTML = "";
      
          var h2 = document.createElement("h2");
          h2.textContent = "Solução";
          solucoesDiv.appendChild(h2);
      
          if (resultado.convergiu) {
            for (var i = 0; i < resultado.solucao.length; i++) {
              var p = document.createElement("p");
              p.textContent = "x" + (i + 1) + " = " + resultado.solucao[i].toFixed(4);
              solucoesDiv.appendChild(p);
            }
      
            var convergiuP = document.createElement("p");
            convergiuP.textContent = "O método convergiu em " + resultado.iteracoes + " iterações.";
            solucoesDiv.appendChild(convergiuP);
          } else {
            var p = document.createElement("p");
            p.textContent = "O método não convergiu com os parâmetros especificados.";
            solucoesDiv.appendChild(p);
          }
        }
      }
  
      function eliminacaoGauss(matriz) {
        var etapas = [];
        etapas.push(matriz.map(function (linha) {
          return linha.slice();
        }));
      
        var n = matriz.length;
      
        for (var k = 0; k < n - 1; k++) {
          for (var i = k + 1; i < n; i++) {
            var multiplicador = matriz[i][k] / matriz[k][k];
            for (var j = k; j < n + 1; j++) {
              matriz[i][j] -= multiplicador * matriz[k][j];
            }
          }
          etapas.push(matriz.map(function (linha) {
            return linha.slice();
          }));
        }
      
        var solucao = [];
      
        for (var i = n - 1; i >= 0; i--) {
          var soma = 0;
          for (var j = i + 1; j < n; j++) {
            soma += matriz[i][j] * solucao[j];
          }
          solucao[i] = (matriz[i][n] - soma) / matriz[i][i];
        }
      
        return [etapas, solucao];
      }
  
  
      function exibirSolucao(solucao) {
        var solucoesDiv = document.getElementById("solucoes");
        solucoesDiv.innerHTML = "";
      
        var h2 = document.createElement("h2");
        h2.textContent = "Solução";
        solucoesDiv.appendChild(h2);
      
        for (var i = 0; i < solucao.length; i++) {
          var p = document.createElement("p");
          p.textContent = "x" + (i + 1) + " = " + solucao[i].toFixed(4);
          solucoesDiv.appendChild(p);
        }
      }
  });