var products = [];

function showForm() {
    var formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'block';
}

function hideForm() {
    var formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'none';
    limparCampos();
}

function adicionarProduto() {
    var codigoInput = document.getElementById('codigo');
    var descricaoInput = document.getElementById('descricao');
    var quantidadeInput = document.getElementById('quantidade');
    var validadeInput = document.getElementById('validade');
    var localidadeInput = document.getElementById('localidade');

    var produto = {
        codigo: codigoInput.value,
        descricao: descricaoInput.value,
        quantidade: parseInt(quantidadeInput.value),
        validade: validadeInput.value,
        localidade: localidadeInput.value,
        tratado: false
    };

    products.push(produto);
    products.sort(compareByValidade); // Ordena os produtos pelo prazo de validade
    exibirProdutos();
    salvarProdutosNoLocalStorage(); // Salva os produtos no Local Storage

    limparCampos(); // Limpa os campos do formulário
}

function compareByValidade(a, b) {
    var validadeA = new Date(a.validade);
    var validadeB = new Date(b.validade);

    return validadeA - validadeB;
}

function exibirProdutos() {
    var tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    for (var i = 0; i < products.length; i++) {
        var product = products[i];

        var newRow = tableBody.insertRow();

        newRow.innerHTML = `
            <td>${product.codigo}</td>
            <td>${product.descricao}</td>
            <td>${product.quantidade}</td>
            <td>${product.validade}</td>
            <td>${product.localidade}</td>
            <td>${calcularDiasRestantes(product.validade)}</td>
            <td>${product.tratado ? 'Tratado' : 'Não Tratado'}</td>
            <td class="actions">
                <button class="tratar-button" onclick="tratarProduto(${i})">${product.tratado ? 'Desfazer' : 'Tratar'}</button>
                <button class="excluir-button" onclick="excluirProduto(${i})">Excluir</button>
            </td>
        `;

        // Adiciona a classe de acordo com os dias restantes
        var diasRestantes = calcularDiasRestantes(product.validade);
        if (diasRestantes < 0) {
            newRow.classList.add('expired');
        } else if (diasRestantes <= 30) {
            newRow.classList.add('warning');
        } else if (diasRestantes <= 60) {
            newRow.classList.add('attention');
        }
    }
}

function calcularDiasRestantes(validade) {
    var dataAtual = new Date();
    var dataValidade = new Date(validade);
    var diffTime = dataValidade.getTime() - dataAtual.getTime();
    var diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays;
}

function tratarProduto(index) {
    var product = products[index];
    product.tratado = !product.tratado;
    exibirProdutos();
    salvarProdutosNoLocalStorage(); // Salva os produtos atualizados no Local Storage
}

function excluirProduto(index) {
    products.splice(index, 1);
    exibirProdutos();
    salvarProdutosNoLocalStorage(); // Salva os produtos atualizados no Local Storage
}

function limparCampos() {
    var codigoInput = document.getElementById('codigo');
    var descricaoInput = document.getElementById('descricao');
    var quantidadeInput = document.getElementById('quantidade');
    var validadeInput = document.getElementById('validade');
    var localidadeInput = document.getElementById('localidade');

    codigoInput.value = '';
    descricaoInput.value = '';
    quantidadeInput.value = '';
    validadeInput.value = '';
    localidadeInput.value = '';
}

function salvarProdutosNoLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function carregarProdutosDoLocalStorage() {
    var savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Exibir produtos ao carregar a página
window.addEventListener('load', function () {
    carregarProdutosDoLocalStorage(); // Carrega os produtos do Local Storage
    exibirProdutos();
});