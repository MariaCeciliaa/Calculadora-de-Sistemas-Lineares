from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

def eliminacao_gauss(A, b):
    n = len(A)
    for i in range(n):
        if A[i][i] == 0:
            raise ValueError("Divisão por zero encontrada. Impossível resolver o sistema.")
        
        for j in range(i+1, n):
            ratio = A[j][i] / A[i][i]
            
            for k in range(n):
                A[j][k] = A[j][k] - ratio * A[i][k]
                
            b[j] = b[j] - ratio * b[i]
    
    x = np.zeros(n)
    x[n-1] = b[n-1] / A[n-1][n-1]
    
    for i in range(n-2, -1, -1):
        sum_ = b[i]
        
        for j in range(i+1, n):
            sum_ -= A[i][j] * x[j]
            
        x[i] = sum_ / A[i][i]
    
    return x

def gauss_seidel(A, b, max_iterations=100, tolerance=1e-5):
    n = len(A)
    x = np.zeros(n)
    x_prev = np.zeros(n)
    
    for iteration in range(max_iterations):
        for i in range(n):
            sum_ = b[i]
            
            for j in range(n):
                if j != i:
                    sum_ -= A[i][j] * x[j]
            
            x[i] = sum_ / A[i][i]
        
        if np.linalg.norm(x - x_prev) < tolerance:
            return x
        
        x_prev = np.copy(x)
    
    raise ValueError("O método de Gauss-Seidel não convergiu após o número máximo de iterações.")

@app.route("/", methods=["GET", "POST"])
def calcular_sistema_linear():
    if request.method == "GET":
        return render_template("calculadora.html")
    elif request.method == "POST":
        data = request.get_json()
        opcao = int(data["opcao"])
        matrizA = np.array(data["matrizA"])
        vetorB = np.array(data["vetorB"])

        if opcao == 1:
            x = eliminacao_gauss(matrizA, vetorB)
        elif opcao == 2:
            x = gauss_seidel(matrizA, vetorB)
        else:
            return jsonify({"error": "Opção inválida."})

        return jsonify({"x": x.tolist()})

if __name__ == "__main__":
    app.run()
