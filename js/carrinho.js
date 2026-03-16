const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');
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
        atualizarContadorCarrinho();
        renderizarTabelaDoCarrinho();
        
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

atualizarContadorCarrinho();

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
            <td class="td-quantidade"><input type="number" value="${produto.quantidade}" min="1"></td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td><button class="btn-remover" data-id="${produto.id}" ></button></td>`;

        corpoTabela.appendChild(tr);
    });
}

renderizarTabelaDoCarrinho();

// Objetivo 2 - Remover produtos do carrinho
//Passo 1 – Selecionar o botão de deletar
const corpoTabela = document.querySelector("#modal-1-content table tbody");
corpoTabela.addEventListener("click", evento => {
    if (evento.target.classList.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        removerProdutoDoCarrinho(id);
    }
})

function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    // Filtra os produtos, mantendo apenas aqueles que não possuem o ID passado por parametro
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho(produtosAtualizados);
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
}