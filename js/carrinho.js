
// Refatoração avançada: código mais robusto, limpo e DRY

document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    inicializarEventosCarrinho();
    inicializarEventosTabela(corpoTabela);
    atualizarCarrinhoETabela();
});

// Inicializa eventos dos botões de adicionar ao carrinho
function inicializarEventosCarrinho() {
    document.querySelectorAll(".adicionar-ao-carrinho").forEach(botao => {
        botao.addEventListener('click', handleAdicionarAoCarrinho);
    });
}

// Handler para adicionar produto ao carrinho
function handleAdicionarAoCarrinho(evento) {
    const elementoProduto = evento.target.closest(".produto");
    if (!elementoProduto) return;
    const produto = extrairDadosProduto(elementoProduto);
    if (!produto) return;
    let carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(p => p.id === produto.id);
    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push(produto);
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Extrai dados do produto do DOM, retorna objeto ou null se faltar info
function extrairDadosProduto(elementoProduto) {
    // Refatoração: função utilitária para evitar repetição
    if (!elementoProduto) return null;
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome")?.textContent;
    const produtoImagem = elementoProduto.querySelector("img")?.getAttribute("src");
    const precoTexto = elementoProduto.querySelector(".preco")?.textContent;
    if (!produtoId || !produtoNome || !produtoImagem || !precoTexto) return null;
    const produtoPreco = parseFloat(
        precoTexto.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
    );
    if (isNaN(produtoPreco)) return null;
    return {
        id: produtoId,
        nome: produtoNome,
        imagem: produtoImagem,
        preco: produtoPreco,
        quantidade: 1
    };
}

// Inicializa eventos da tabela do carrinho (remover/alterar quantidade)
function inicializarEventosTabela(corpoTabela) {
    if (!corpoTabela) return;
    corpoTabela.addEventListener("click", evento => {
        if (evento.target.classList.contains("btn-remover")) {
            removerProdutoDoCarrinho(evento.target.dataset.id);
        }
    });
    corpoTabela.addEventListener("input", evento => {
        if (evento.target.classList.contains("input-quantidade")) {
            const novaQuantidade = parseInt(evento.target.value);
            if (isNaN(novaQuantidade) || novaQuantidade < 1) return;
            atualizarQuantidadeProduto(evento.target.dataset.id, novaQuantidade);
        }
    });
}

// Atualiza a quantidade de um produto no carrinho
function atualizarQuantidadeProduto(id, novaQuantidade) {
    let produtos = obterProdutosDoCarrinho();
    const produto = produtos.find(produto => produto.id === id);
    if (produto && novaQuantidade > 0) {
        produto.quantidade = novaQuantidade;
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
}

// Salva o carrinho no localStorage
function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Obtém o carrinho do localStorage
function obterProdutosDoCarrinho() {
    try {
        const produtos = localStorage.getItem("carrinho");
        return produtos ? JSON.parse(produtos) : [];
    } catch {
        return [];
    }
}

// Atualiza o contador de itens do carrinho
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Uso de reduce para somar quantidades
    const total = produtos.reduce((soma, produto) => soma + produto.quantidade, 0);
    const contador = document.getElementById("contador-carrinho");
    if (contador) contador.textContent = total;
}

// Renderiza a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    if (!corpoTabela) return;
    corpoTabela.innerHTML = "";
    produtos.forEach(produto => {
        corpoTabela.appendChild(criarLinhaProduto(produto));
    });
}

// Cria elemento <tr> para um produto do carrinho
function criarLinhaProduto(produto) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}"></td>
        <td>${produto.nome}</td>
        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
        <td class="td-quantidade"><input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"></td>
        <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
        <td><button class="btn-remover" data-id="${produto.id}"></button></td>
    `;
    return tr;
}

// Remove produto do carrinho
function removerProdutoDoCarrinho(id) {
    let produtos = obterProdutosDoCarrinho();
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(produtosAtualizados);
    atualizarCarrinhoETabela();
}

// Atualiza o valor total do carrinho
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Uso de reduce para somar valores
    const valorTotal = produtos.reduce((total, produto) => total + (Number(produto.preco) * produto.quantidade), 0);
    const totalEl = document.querySelector("#total-carrinho");
    if (totalEl) {
        totalEl.textContent = `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }
}

// Atualiza todas as partes do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

/*
Melhorias desta refatoração:
1. Função utilitária extrairDadosProduto: evita duplicidade e torna robusto contra campos ausentes.
2. Early return em funções para evitar aninhamento desnecessário.
3. Checagem de existência de elementos DOM antes de manipular.
4. Função criarLinhaProduto separada: facilita manutenção e testes.
5. Uso de try/catch ao ler localStorage: evita erros caso o storage esteja corrompido.
6. Comentários detalhados explicando cada melhoria e decisão.
7. Código mais DRY e seguro para produção.
*/


// Refatoração: Modularização e comentários explicativos

// Utiliza delegação de eventos para melhor performance e menos listeners
document.addEventListener('DOMContentLoaded', () => {
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    // Adiciona eventos do carrinho
    inicializarEventosCarrinho();
    // Adiciona eventos de remover e alterar quantidade
    inicializarEventosTabela(corpoTabela);
    // Atualiza o carrinho ao carregar a página
    atualizarCarrinhoETabela();
});

// Modularização: Função para inicializar eventos dos botões de adicionar ao carrinho
function inicializarEventosCarrinho() {
    const botoesAdicionarAoCarrinho = document.querySelectorAll(".adicionar-ao-carrinho");
    botoesAdicionarAoCarrinho.forEach(botao => {
        botao.addEventListener('click', handleAdicionarAoCarrinho);
    });
}

// Handler separado para clareza e reuso
function handleAdicionarAoCarrinho(evento) {
    const elementoProduto = evento.target.closest(".produto");
    if (!elementoProduto) return;
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector(".nome").textContent;
    const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
    const produtoPreco = parseFloat(
        elementoProduto.querySelector(".preco").textContent
            .replace("R$ ", "")
            .replace(".", "")
            .replace(",", ".")
    );

    let carrinho = obterProdutosDoCarrinho();
    const existeProduto = carrinho.find(produto => produto.id === produtoId);

    if (existeProduto) {
        existeProduto.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            imagem: produtoImagem,
            preco: produtoPreco,
            quantidade: 1
        });
    }
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Modularização: Função para inicializar eventos da tabela do carrinho
function inicializarEventosTabela(corpoTabela) {
    // Remover produto
    corpoTabela.addEventListener("click", evento => {
        if (evento.target.classList.contains("btn-remover")) {
            removerProdutoDoCarrinho(evento.target.dataset.id);
        }
    });
    // Alterar quantidade
    corpoTabela.addEventListener("input", evento => {
        if (evento.target.classList.contains("input-quantidade")) {
            atualizarQuantidadeProduto(evento.target.dataset.id, parseInt(evento.target.value));
        }
    });
}

// Função para atualizar a quantidade de um produto
function atualizarQuantidadeProduto(id, novaQuantidade) {
    let produtos = obterProdutosDoCarrinho();
    const produto = produtos.find(produto => produto.id === id);
    if (produto && novaQuantidade > 0) {
        produto.quantidade = novaQuantidade;
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
}

// Salva o carrinho no localStorage
function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Obtém o carrinho do localStorage
function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// Atualiza o contador de itens do carrinho
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Refatoração: uso de reduce para somar quantidades
    const total = produtos.reduce((soma, produto) => soma + produto.quantidade, 0);
    document.getElementById("contador-carrinho").textContent = total;
}

// Renderiza a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content table tbody");
    corpoTabela.innerHTML = "";
    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="td-produto"><img src="${produto.imagem}" alt="${produto.nome}"></td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade"><input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"></td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td><button class="btn-remover" data-id="${produto.id}"></button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}

// Remove produto do carrinho
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(produtosAtualizados);
    atualizarCarrinhoETabela();
}

// Atualiza o valor total do carrinho
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Refatoração: uso de reduce para somar valores
    const valorTotal = produtos.reduce((total, produto) => total + (Number(produto.preco) * produto.quantidade), 0);
    document.querySelector("#total-carrinho").textContent =
        `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

// Atualiza todas as partes do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

/*
Melhorias realizadas:
1. Modularização: Quebra do código em funções menores e reutilizáveis, facilitando manutenção e testes.
2. Delegação de eventos: Eventos de remover e alterar quantidade são delegados ao tbody, reduzindo listeners e melhorando performance.
3. Uso de reduce: Para somar quantidades e valores, tornando o código mais limpo e funcional.
4. Comentários explicativos: Cada bloco/função tem comentários sobre seu propósito e melhorias.
5. Handler separado: Função handleAdicionarAoCarrinho separada para clareza e reuso.
6. DOMContentLoaded: Garante que os elementos existem antes de adicionar eventos.
*/