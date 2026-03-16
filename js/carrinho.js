const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(elementoProduto.querySelector(".preco").textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        const carrinho = obterProdutosDoCarrinho();

        const existeProduto = carrinho.find(produto => produto.id === produtoId);

        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarCarrinhoETabela();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// Passo 4 – Atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = total;
}


// Passo 5 – Renderizar a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = ""; // Limpa a tabela antes de renderizar os produtos

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto"><img src="${produto.imagem}"
            alt="${produto.nome}">
            </td><td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade"><input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"></td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td><button class="btn-remover" data-id="${produto.id}" ></button></td>`;

        corpoTabela.appendChild(tr);
    });
}


// Objetivo 2 - Remover produtos do carrinho
//Passo 1 – Selecionar o botão de deletar
const corpoTabela = document.querySelector("#modal-1-content table tbody");
//Passo 2 - adicionar evento de escuta no tbody
corpoTabela.addEventListener("click", evento => {
    if (evento.target.classList.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        //Passo 3 – Remover o produto do localStorage
        removerProdutoDoCarrinho(id);
    }
});
//Passo 1 – Escutar evento de escuta no input do tbody
corpoTabela.addEventListener("input", evento => {
    //Passo 2 – Atualizar o total do produto
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto){
            produto.quantidade = novaQuantidade;
        }
        //Objetivo 3 - Atualizar valores do carrinho de compras
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});


//Passo 4 – Atualizar o HTML da tabela
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    // Filtra os produtos, mantendo apenas aqueles que não possuem o ID passado por parametro
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho(produtosAtualizados);
    atualizarCarrinhoETabela();
}

//Passo 3 – Atualizar o valor total do carrinho
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let valorTotal = 0;

    produtos.forEach(produto => {
        valorTotal += Number(produto.preco) * produto.quantidade;
    });
    document.querySelector("#total-carrinho").textContent =
    `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}
atualizarCarrinhoETabela();