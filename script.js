class Produto {

    constructor(codigo, nome, categoria, preco, estoque, imagem) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.imagem = imagem;
    }

    estaDisponivel() {
        return this.estoque > 0;
    }
}


class Carrinho {

    constructor() {
        this.itens = [];
    }

    adicionar(produto) {

        if (!produto.estaDisponivel()) {
            alert("Este produto está indisponível.");
            return;
        }

        let encontrado = false;

        for (let i = 0; i < this.itens.length; i++) {

            if (this.itens[i].produto.codigo === produto.codigo) {

                encontrado = true;

                if (this.itens[i].quantidade < produto.estoque) {
                    this.itens[i].quantidade++;
                } else {
                    alert("Estoque insuficiente.");
                }

                break;
            }
        }

        if (!encontrado) {

            this.itens.push({
                produto: produto,
                quantidade: 1
            });
        }

        atualizarCarrinho();
    }

    remover(codigo) {

        this.itens = this.itens.filter(
            item => item.produto.codigo !== codigo
        );

        atualizarCarrinho();
    }

    aumentar(codigo) {

        for (let i = 0; i < this.itens.length; i++) {

            if (this.itens[i].produto.codigo === codigo) {

                if (
                    this.itens[i].quantidade <
                    this.itens[i].produto.estoque
                ) {

                    this.itens[i].quantidade++;

                } else {

                    alert("Limite de estoque atingido.");
                }

                break;
            }
        }

        atualizarCarrinho();
    }

    diminuir(codigo) {

        for (let i = 0; i < this.itens.length; i++) {

            if (this.itens[i].produto.codigo === codigo) {

                this.itens[i].quantidade--;

                if (this.itens[i].quantidade <= 0) {
                    this.remover(codigo);
                    return;
                }

                break;
            }
        }

        atualizarCarrinho();
    }

    quantidadeTotal() {

        let quantidade = 0;

        for (let i = 0; i < this.itens.length; i++) {
            quantidade += this.itens[i].quantidade;
        }

        return quantidade;
    }

    subtotal() {

        let valor = 0;

        for (let i = 0; i < this.itens.length; i++) {

            valor +=
                this.itens[i].produto.preco *
                this.itens[i].quantidade;
        }

        return valor;
    }

    calcularDesconto() {

        let valorSubtotal = this.subtotal();

        if (valorSubtotal >= 300) {
            return valorSubtotal * 0.10;
        }

        return 0;
    }

    total() {

        return this.subtotal() - this.calcularDesconto();
    }

    limpar() {

        this.itens = [];

        atualizarCarrinho();
    }
}


const produtos = [

    new Produto(
    1,
    "Kit L'Oréal Professionnel, Shampoo e Condicionador 1,5L",
    "Cabelo",
    399.90,
    3,
    "imagens/shampooecondicionador.jpeg"
),

new Produto(
    2,
    "Perfume Ameerati 100ml",
    "Perfume",
    160.0,
    2,
    "imagens/ameerati.jpeg"
),

new Produto(
    3,
    "La Voie Eau Parfum 100ml Maison Alhambra",
    "Perfume",
    190.00,
    0,
    "imagens/lavoie.jpeg"
),

new Produto(
    4,
    "Kit Body Splash e hidratante Victoria's Secret Vevelt Petals",
    "Body Splash",
    160.00,
    5,
    "imagens/body-splash-vevelt.jpeg"
),

new Produto(
    5,
    "Kit Body Splash e hidratante Victoria's Secret Bare Vanilla",
    "Body Splash",
    160.00,
    6,
    "imagens/body-splash-vanilla.jpeg"
),

new Produto(
    6,
    "Perfume Calvin Klein 100ml",
    "Perfume",
    290.00,
    3,
    "imagens/calvin-klein.jpeg"
),

new Produto(
    7,
    "Creme Facial de colágeno medicube",
    "Skincare",
    160.90,
    5,
    "imagens/medicube.jpeg"
),
new Produto(
    8,
    "Kit Sebastian Professional Penetraitt Shampoo e Condicionador 1L",
    "Cabelo",
    430.00,
    5,
    "imagens/sebastian.jpeg"
)
];


const carrinho = new Carrinho();

var lojaAtiva = true;

function verificarLoja() {

    if (!lojaAtiva) {
        alert("A loja está fechada no momento.");
        return false;
    }

    return true;
}

function alternarLoja() {

    lojaAtiva = !lojaAtiva;

    const botao = document.getElementById("botaoLoja");

    botao.textContent = lojaAtiva
        ? "Fechar loja (simular)"
        : "Abrir loja (simular)";

    pesquisar();
}


function formatarPreco(valor) {

    return valor.toFixed(2).replace('.', ',');
}


function exibirProdutos(lista) {

    const container = document.getElementById("produtos");

    container.innerHTML = "";

    if (lista.length === 0) {

        container.innerHTML = `
            <div class="sem-produto">
                Nenhum produto encontrado.
            </div>
        `;

        return;
    }

    for (let i = 0; i < lista.length; i++) {

        const produto = lista[i];

       const itemCarrinho = carrinho.itens.find(
    item => item.produto.codigo === produto.codigo
);

const quantidadeNoCarrinho = itemCarrinho
    ? itemCarrinho.quantidade
    : 0;

const estoqueDisponivel =
    produto.estoque - quantidadeNoCarrinho;

const disponivel = estoqueDisponivel > 0 && lojaAtiva;

        container.innerHTML += `

            <div class="card">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >

                <div class="card-body">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p class="categoria-produto">
                        ${produto.categoria}
                    </p>

                    <p class="preco">
                        R$ ${formatarPreco(produto.preco)}
                    </p>

                    <p class="${
                        disponivel
                        ? "disponivel"
                        : "indisponivel"
                    }">

                        ${
                            disponivel
                            ? "Disponível: " + estoqueDisponivel + " unidades"
                            : "Indisponível"
                        }

                    </p>

                    <button
                        class="btn"
                        ${
                            !disponivel
                            ? "disabled"
                            : ""
                        }
                        onclick="adicionarProduto(${produto.codigo})"
                    >
                        ${
                            disponivel
                            ? "Adicionar ao Carrinho"
                            : "Indisponível"
                        }
                    </button>

                </div>

            </div>

        `;
    }
}


function adicionarProduto(codigo) {

    if (!verificarLoja()) {
        return;
    }

    const produto = produtos.find(
        produto => produto.codigo === codigo
    );

    if (produto) {
        carrinho.adicionar(produto);
    }
}


function atualizarCarrinho() {

    const container =
        document.getElementById("itensCarrinho");

    container.innerHTML = "";

    if (carrinho.itens.length === 0) {

        container.innerHTML = `
            <p>
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        for (let i = 0; i < carrinho.itens.length; i++) {

            const item = carrinho.itens[i];

            const subtotalItem =
                item.produto.preco *
                item.quantidade;

            container.innerHTML += `

                <div class="itemCarrinho">

                    <strong>
                        ${item.produto.nome}
                    </strong>

                    <br>

                    Preço unitário:
                    R$ ${formatarPreco(item.produto.preco)}

                    <br>

                    Quantidade:
                    ${item.quantidade}

                    <br>

                    Subtotal:
                    R$ ${formatarPreco(subtotalItem)}

                    <br>

                    <button
                        onclick="carrinho.aumentar(${item.produto.codigo})"
                    >
                        +
                    </button>

                    <button
                        onclick="carrinho.diminuir(${item.produto.codigo})"
                    >
                        -
                    </button>

                    <button
                        onclick="carrinho.remover(${item.produto.codigo})"
                    >
                        Remover
                    </button>

                </div>

            `;
        }
    }

    const quantidade =
        carrinho.quantidadeTotal();

    const valorSubtotal =
        carrinho.subtotal();

    const valorDesconto =
        carrinho.calcularDesconto();

    const valorTotal =
        carrinho.total();

    document.getElementById("totalItens")
        .textContent = quantidade;

    document.getElementById("subtotal")
        .textContent = formatarPreco(valorSubtotal);

    document.getElementById("desconto")
        .textContent = formatarPreco(valorDesconto);

    document.getElementById("total")
        .textContent = formatarPreco(valorTotal);
    pesquisar();    
}


function finalizarCompra() {

    if (carrinho.itens.length === 0) {

        alert(
            "Não é possível finalizar uma compra com o carrinho vazio."
        );

        return;
    }

    let resumo = "Resumo da Compra\n\n";

    let i = 0;

    while (i < carrinho.itens.length) {

        const item = carrinho.itens[i];

        resumo +=
            item.produto.nome +
            " - " +
            item.quantidade +
            " unidade(s)\n";

        i++;
    }

    resumo +=
        "\nSubtotal: R$ " +
        formatarPreco(carrinho.subtotal());

    resumo +=
        "\nDesconto: R$ " +
        formatarPreco(carrinho.calcularDesconto());

    resumo +=
        "\nTotal: R$ " +
        formatarPreco(carrinho.total());

    alert(resumo);
    const confirmou = confirm("Confirmar a compra?");

    if (!confirmou) {
        alert("Compra cancelada.");
        return;
    }

    alert("Compra concluída com sucesso!");

    carrinho.limpar();
}

const pesquisar = () => {

    const texto =
        document.getElementById("pesquisa")
            .value
            .toLowerCase();

    const categoria =
        document.getElementById("categoria")
            .value;

    const filtrados =
        produtos.filter(produto => {

            const nomeCorresponde =
                produto.nome
                    .toLowerCase()
                    .includes(texto);

            const categoriaCorresponde =
                categoria === "Todos" ||
                produto.categoria === categoria;

            return nomeCorresponde &&
                categoriaCorresponde;
        });

    exibirProdutos(filtrados);
};


document
    .getElementById("pesquisa")
    .addEventListener("input", pesquisar);


document
    .getElementById("categoria")
    .addEventListener("change", pesquisar);


exibirProdutos(produtos);

atualizarCarrinho();