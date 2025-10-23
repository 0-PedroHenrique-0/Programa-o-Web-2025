// ===== CONFIGURAÇÃO INICIAL =====
const CHAVE_API = "7855de96";
const URL_BASE = "https://www.omdbapi.com/";
 
// ===== CONEXÃO COM O HTML =====
const campoBusca = document.getElementById("campo-busca");
const filtroAno = document.getElementById("filtro-ano");
const listaResultados = document.getElementById("lista-resultados");
const mensagemStatus = document.getElementById("mensagem-status");
 
// ===== VARIÁVEIS DE CONTROLE =====
let termoBusca = "";
let anoFiltro = "";
let paginaAtual = 1;
 
// ===== FUNÇÃO DO BOTÃO "BUSCAR" =====
function buscarFilmes() {
    termoBusca = campoBusca.value.trim();
    anoFiltro = filtroAno.value.trim();
    paginaAtual = 1;
    pesquisarFilmes();
}
 
// ===== FUNÇÃO DO BOTÃO "PRÓXIMA PÁGINA" =====
function proximaPagina() {
    paginaAtual++;
    pesquisarFilmes();
}
 
// ===== FUNÇÃO DO BOTÃO "ANTERIOR" =====
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        pesquisarFilmes();
    }
}
 
// ===== FUNÇÃO PRINCIPAL DE PESQUISA =====
async function pesquisarFilmes() {
    // Valida se pelo menos um campo está preenchido
    if (!termoBusca && !anoFiltro) {
        mensagemStatus.textContent = "Digite o nome de um filme OU um ano para pesquisar.";
        listaResultados.innerHTML = "";
        return;
    }
 
    // Mostra mensagem de carregando
    mensagemStatus.textContent = "🔄 Buscando filmes, aguarde...";
    listaResultados.innerHTML = "";
 
    try {
        // SOLUÇÃO PROFISSIONAL: Se busca apenas por ano, usa um termo genérico
        let termoParaBusca = termoBusca;
       
        if (!termoBusca && anoFiltro) {
            // Usa termos genéricos que retornam muitos resultados
            termoParaBusca = "movie"; // termo genérico que funciona bem
        }
 
        // Monta a URL base
        let url = `${URL_BASE}?apikey=${CHAVE_API}&s=${encodeURIComponent(termoParaBusca)}&page=${paginaAtual}`;
       
        // Adiciona o parâmetro de ano (se estiver preenchido)
        if (anoFiltro) {
            url += `&y=${anoFiltro}`;
        }
       
        // Filtra apenas filmes
        url += `&type=movie`;
 
        console.log("URL da requisição:", url); // Para debug
 
        // Faz a chamada na API
        const resposta = await fetch(url);
        const dados = await resposta.json();
 
        // Verifica se encontrou algo
        if (dados.Response === "False") {
            let mensagemErro = "Nenhum resultado encontrado.";
           
            if (termoBusca && anoFiltro) {
                mensagemErro = `Nenhum resultado encontrado para "${termoBusca}" no ano ${anoFiltro}.`;
            } else if (termoBusca) {
                mensagemErro = `Nenhum resultado encontrado para "${termoBusca}".`;
            } else if (anoFiltro) {
                mensagemErro = `Nenhum filme encontrado para o ano ${anoFiltro}. Tente outro ano.`;
            }
           
            mensagemStatus.textContent = mensagemErro;
            listaResultados.innerHTML = "";
            return;
        }
 
        // Mostra os filmes na tela
        exibirFilmes(dados.Search);
       
        // Mensagem de status mais informativa
        let mensagemStatusFinal = `Página ${paginaAtual}`;
       
        if (termoBusca && anoFiltro) {
            mensagemStatusFinal += ` — "${termoBusca}" no ano ${anoFiltro}`;
        } else if (termoBusca) {
            mensagemStatusFinal += ` — "${termoBusca}"`;
        } else if (anoFiltro) {
            mensagemStatusFinal += ` — Filmes de ${anoFiltro}`;
        }
       
        if (dados.totalResults) {
            mensagemStatusFinal += ` (${dados.totalResults} resultados encontrados)`;
        }
       
        mensagemStatus.textContent = mensagemStatusFinal;
 
    } catch (erro) {
        console.error("Erro na requisição:", erro);
        mensagemStatus.textContent = "❌ Erro ao buscar dados. Verifique sua conexão com a internet.";
    }
}
 
// ===== FUNÇÃO PARA MOSTRAR FILMES =====
function exibirFilmes(filmes) {
    listaResultados.innerHTML = ""; // limpa os resultados anteriores
 
    // Verifica se há filmes para exibir
    if (!filmes || filmes.length === 0) {
        listaResultados.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }
 
    filmes.forEach(filme => {
        // Cria o container do card
        const div = document.createElement("div");
        div.classList.add("card");
 
        // Se não houver pôster, usa uma imagem padrão
        const poster = filme.Poster !== "N/A"
            ? filme.Poster
            : "https://via.placeholder.com/300x450/333/fff?text=Sem+Poster";
 
        // Monta o HTML do card
        div.innerHTML = `
            <img src="${poster}" alt="Pôster do filme ${filme.Title}" loading="lazy">
            <h3>${filme.Title}</h3>
            <p><strong>Ano:</strong> ${filme.Year}</p>
            <p><strong>Tipo:</strong> ${filme.Type}</p>
        `;
 
        // Adiciona o card dentro da lista
        listaResultados.appendChild(div);
    });
}
 
// ===== BÔNUS: Permitir busca pressionando Enter =====
campoBusca.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarFilmes();
    }
});
 
filtroAno.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarFilmes();
    }
});
 
// ===== BÔNUS: Limpar filtros =====
function limparFiltros() {
    campoBusca.value = "";
    filtroAno.value = "";
    listaResultados.innerHTML = "";
    mensagemStatus.textContent = "Campos limpos. Digite um nome ou ano para buscar.";
    paginaAtual = 1;
}
 
// ===== BÔNUS: Buscar filmes populares por década (EXEMPLO DE USO) =====
function buscarPorDecada(decada) {
    campoBusca.value = "";
    filtroAno.value = decada;
    buscarFilmes();
}