document.addEventListener('DOMContentLoaded', function () {
    var botaoCalcular = document.getElementById('botaoCalcular');
    botaoCalcular.addEventListener('click', function () {
        calcularSistemaLinear();
    });

    var botaoLimpar = document.getElementById('botaoLimpar');
    botaoLimpar.addEventListener('click', function () {
      limparCampos();
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

function limparCampos() {
    var inputs = document.querySelectorAll("input[type='number']");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
    }
}

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
      
        var matrizLDiv = document.getElementById("matriz-l");
        matrizLDiv.innerHTML = "";
      
        var matrizLTitulo = document.createElement("h2");
        matrizLTitulo.textContent = "Matriz L:";
        matrizLDiv.appendChild(matrizLTitulo);
      
        var matrizLTabela = document.createElement("table");
        matrizLTabela.classList.add("matrix-table");
      
        for (var i = 0; i < resultado.matrizL.length; i++) {
          var linha = document.createElement("tr");
      
          for (var j = 0; j < resultado.matrizL[i].length; j++) {
            var valor = resultado.matrizL[i][j];
            var coluna = document.createElement("td");
            coluna.textContent = isNaN(valor) ? "" : valor.toFixed(5);
            linha.appendChild(coluna);
          }
      
          matrizLTabela.appendChild(linha);
        }
      
        matrizLDiv.appendChild(matrizLTabela);
      
        var matrizUDiv = document.getElementById("matriz-u");
        matrizUDiv.innerHTML = "";
      
        var matrizUTitulo = document.createElement("h2");
        matrizUTitulo.textContent = "Matriz U:";
        matrizUDiv.appendChild(matrizUTitulo);
      
        var matrizUTabela = document.createElement("table");
        matrizUTabela.classList.add("matrix-table");
      
        for (var i = 0; i < resultado.matrizU.length; i++) {
          var linha = document.createElement("tr");
      
          for (var j = 0; j < resultado.matrizU[i].length; j++) {
            var valor = resultado.matrizU[i][j];
            var coluna = document.createElement("td");
            coluna.textContent = isNaN(valor) ? "" : valor.toFixed(5);
            linha.appendChild(coluna);
          }
      
          matrizUTabela.appendChild(linha);
        }
      
        matrizUDiv.appendChild(matrizUTabela);
        
        var matrizPDiv = document.getElementById("matriz-p");
        matrizPDiv.innerHTML = "";
        
        var matrizPTitulo = document.createElement("h2");
        matrizPTitulo.textContent = "Matriz de Permutação:";
        matrizPDiv.appendChild(matrizPTitulo);
        
        var matrizPTabela = document.createElement("table");
        matrizPTabela.classList.add("matrix-table");
        
        for (var i = 0; i < resultado.matrizP.length; i++) {
          var linha = document.createElement("tr");
        
          for (var j = 0; j < resultado.matrizP[i].length; j++) {
            var valor = resultado.matrizP[i][j];
            var coluna = document.createElement("td");
            coluna.textContent = isNaN(valor) ? "" : valor.toFixed(5);
            linha.appendChild(coluna);
          }
        
          matrizPTabela.appendChild(linha);
        }
        
        matrizPDiv.appendChild(matrizPTabela);
        
        for (var i = 0; i < resultado.etapas.length; i++) {
          var etapa = resultado.etapas[i];
          var etapaDiv = document.createElement("div");
          etapaDiv.classList.add("etapa");
        
          var titulo = document.createElement("h2");
          titulo.textContent = "Etapa " + i;
          etapaDiv.appendChild(titulo);
        
          var tabela = document.createElement("table");
          tabela.classList.add("matrix-table");
        
          for (var j = 0; j < etapa.length; j++) {
            var linha = document.createElement("tr");
        
            for (var k = 0; k < etapa[j].length; k++) {
              var valor = etapa[j][k];
              var coluna = document.createElement("td");
              coluna.textContent = isNaN(valor) ? "" : valor.toFixed(5);
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
          titulo.textContent = "Iteração " + etapa.iteracao;
          etapaDiv.appendChild(titulo);
    
          var xnIteracaoTexto = document.createElement("p");
          xnIteracaoTexto.textContent = "Soluções: " + etapa.xnIteracao;
          etapaDiv.appendChild(xnIteracaoTexto);
    
          var criterioParadaTexto = document.createElement("p");
          criterioParadaTexto.textContent = "Critério de Parada: " + etapa.criterioParada.toFixed(5);
          etapaDiv.appendChild(criterioParadaTexto);
    
          etapasDiv.appendChild(etapaDiv);
        }

        var solucoesDiv = document.getElementById("solucoes");
        solucoesDiv.innerHTML = "";

        var solucoesTexto = document.createElement("p");
        solucoesTexto.textContent += "A aproximação será: ";
        solucoesTexto.textContent += resultado.solucoes.map(function (solucao, index) {
            return " x" + (index + 1) + " = " + solucao.toFixed(5);
        }).join(",");

        solucoesDiv.appendChild(solucoesTexto);
    }
}

function eliminacaoDeGauss(coeficientes) {
    var etapas = [];
    var n = coeficientes.length;
  
    etapas.push(JSON.parse(JSON.stringify(coeficientes)));
  
    // Inicializar matrizes L, U e P
    var matrizL = [];
    var matrizU = [];
    var matrizP = [];
    var colunas = []; // Nomes das colunas
  
    for (var i = 0; i < n; i++) {
      var linhaL = [];
      var linhaU = [];
      var linhaP = [];
      for (var j = 0; j < n; j++) {
        linhaU.push(coeficientes[i][j]); // Cópia direta da matriz de coeficientes para U
  
        if (i === j) {
          linhaL.push(1);
          linhaP.push(1);
        } else {
          linhaL.push(0);
          linhaP.push(0);
        }
      }
      linhaU.push(coeficientes[i][n]); // Última coluna 'b'
      colunas.push('x' + (i + 1)); // Nome da coluna 'xi'
      colunas.push('b');
  
      matrizL.push(linhaL);
      matrizU.push(linhaU);
      matrizP.push(linhaP);
    }
  
    for (var k = 0; k < n - 1; k++) {
      for (var i = k + 1; i < n; i++) {
        var multiplicador = matrizU[i][k] / matrizU[k][k];
        matrizL[i][k] = multiplicador;
        matrizU[i][k] = 0;
  
        for (var j = k + 1; j < n; j++) {
          matrizU[i][j] -= multiplicador * matrizU[k][j];
        }
      }
  
      var etapa = JSON.parse(JSON.stringify(matrizU));
      etapas.push(etapa);
    }
  
    var solucoes = [];
    solucoes[n - 1] = matrizU[n - 1][n] / matrizU[n - 1][n - 1];
  
    for (var i = n - 2; i >= 0; i--) {
      var soma = 0;
  
      for (var j = i + 1; j < n; j++) {
        soma += matrizU[i][j] * solucoes[j];
      }
  
      solucoes[i] = (matrizU[i][n] - soma) / matrizU[i][i];
    }
  
    matrizU.forEach(function (linhaU) {
      linhaU.pop(); // Remove a última coluna da matriz U
    });
  
    colunas.pop(); // Remove o nome da última coluna 'b'
  
    return {
      etapas: etapas,
      solucoes: solucoes,
      matrizL: matrizL,
      matrizU: matrizU,
      matrizP: matrizP,
      colunas: colunas
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
  
      var xnIteracao = solucoes.map(function (solucao, index) {
        return "x" + (index + 1) + " = " + solucao.toFixed(5);
      }).join(", ");
  
      var diferenca = subtrairVetores(solucoes, iteracaoAnterior);
      var criterioParada = normaMaxima(diferenca);
  
      etapas.push({
        iteracao: iteracao + 1,
        xnIteracao: xnIteracao,
        criterioParada: criterioParada
      });
  
      if (criterioParada <= precisao) {
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