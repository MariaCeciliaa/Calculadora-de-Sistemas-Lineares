from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

#def eliminacao_gauss(A, b):
    # Lógica da eliminação de Gauss

#def gauss_seidel(A, b):
    # Lógica do método de Gauss-Seidel

# @app.route("/", methods=["GET", "POST"])
# def calcular_sistema_linear():
#     if request.method == "GET":
#         return render_template("calculadora.html")
#     elif request.method == "POST":
#         data = request.get_json()
#         opcao = int(data["opcao"])
#         matrizA = np.array(data["matrizA"])
#         vetorB = np.array(data["vetorB"])

#         if opcao == 1:
#             x = eliminacao_gauss(matrizA, vetorB)
#         elif opcao == 2:
#             x = gauss_seidel(matrizA, vetorB)
#         else:
#             return jsonify({"error": "Opção inválida."})

#         return jsonify({"x": x.tolist()})

# if __name__ == "__main__":
#     app.run()
