<h1 align="center">Test Cnab</h1>

<p align="center">Ler Cnab</p>

### Features

- [x] Buscar no Cnab através do nome da empresa.
- [x] Pesquisar através do CLI o arquivo cnab.
- [x] Cria um novo arquivo JSON com o nome da empresa e o endereço.

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Back End

```bash
# Clone este repositório
$ git clone https://github.com/GuilhermeSSilva/testCnab

# Acesse a pasta do projeto no terminal/cmd
$ cd testCnab

# Instale as dependências
$ npm install

# Execute o arquivo da aplicação
$ node cnabRows.js [-p "Caminho do arquivo aqui, com /" -f "Número do índice do inicio da linha" -t "Número do índice do final da linha" -s "Letra referente ao segmento a ser buscado, opções (q, r, p)" -n "Nome da empresa aqui"]
# O código deverá demonstrar um retorno no prompt, caso a funcionalidade de busca via nome da companhia seja utilizada deve criar um novo arquivo JSON com os valores de nome da empresa e endereço.
```
