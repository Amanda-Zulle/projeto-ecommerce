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
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}
