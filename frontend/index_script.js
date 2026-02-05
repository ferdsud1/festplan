document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    // 1. VERIFICAÇÃO DE LOGIN
    if (usuarioLogado) {
        authLinks.innerHTML = `
            <span class="user-name" style="margin-right: 15px;">Olá, <strong>${usuarioLogado}</strong></span>
            <a href="#" id="btn-sair" style="color: #ff4d4d; text-decoration: none; font-weight: bold;">Sair</a>
        `;

        document.getElementById('btn-sair').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogado');
            window.location.reload();
        });
    }

    // 2. CARREGAMENTO INICIAL
    carregarLocais();
    carregarBuffets();
});

// --- FUNÇÕES DE LOCAIS ---

async function carregarLocais() {
    const container = document.getElementById('lista-locais');
    try {
        const response = await fetch('http://localhost:3000/locais');
        const locais = await response.json();
        container.innerHTML = "";

        locais.forEach(local => {
            container.innerHTML += `
                <div class="card-item">
                    <img src="https://via.placeholder.com/400x250" alt="Local">
                    <div class="card-info">
                        <h3>${local.nome_local}</h3>
                        <p class="endereco">📍 ${local.endereco}</p>
                        <div class="tags">
                            <span class="tag-vermelha">${local.capacidade_maxima} Convidados</span>
                        </div>
                        <p class="preco-label">A partir de</p>
                        <p class="preco-valor">R$ ${local.preco_base}</p>
                        <button class="btn-selecionar" onclick="abrirDetalhesLocal(${local.id_local})">Ver detalhes</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
}

async function abrirDetalhesLocal(id) {
    const modal = document.getElementById('modal-detalhes');
    const conteudo = document.getElementById('conteudo-detalhes');

    modal.style.display = "flex";
    conteudo.innerHTML = "Carregando detalhes...";

    try {
        const response = await fetch(`http://localhost:3000/locais/${id}`);
        const local = await response.json();

        conteudo.innerHTML = `
            <img src="https://via.placeholder.com/600x300" style="width:100%; border-radius:8px;">
            <h2 style="margin-top:20px;">${local.nome_local}</h2>
            <p><strong>Endereço:</strong> ${local.endereco}</p>
            <p><strong>Capacidade:</strong> até ${local.capacidade_maxima} pessoas</p>
            <hr>
            <h3>Agendar Evento</h3>
            <form id="form-reserva">
                <label>Data do Evento:</label>
                <input type="date" id="data_evento" required style="width:100%; padding:10px; margin: 10px 0;">
                
                <label>Quantidade de Convidados:</label>
                <input type="number" id="qtd_convidados" max="${local.capacidade_maxima}" placeholder="Máx: ${local.capacidade_maxima}" required style="width:100%; padding:10px; margin: 10px 0;">
                
                <p style="font-size: 20px;"><strong>Total: R$ <span id="valor_total">${local.preco_base}</span></strong></p>
                
                <button type="submit" class="btn-destaque" style="width:100%; padding:15px; background-color: #28a745; color: white; border: none; cursor: pointer; font-weight: bold;">Confirmar Agendamento</button>
            </form>
        `;

        // Lógica para enviar o agendamento
        document.getElementById('form-reserva').addEventListener('submit', async (e) => {
            e.preventDefault();
            await realizarAgendamento(local.id_local, local.preco_base);
        });

    } catch (err) {
        conteudo.innerHTML = "<p>Erro ao carregar detalhes.</p>";
    }
}

// --- FUNÇÕES DE BUFFETS ---

async function carregarBuffets() {
    const container = document.getElementById('lista-buffets');
    try {
        const response = await fetch('http://localhost:3000/buffets');
        const buffets = await response.json();
        container.innerHTML = "";

        buffets.forEach(buffet => {
            container.innerHTML += `
                <div class="card-item">
                    <img src="https://via.placeholder.com/400x250?text=Buffet" alt="Buffet">
                    <div class="card-info">
                        <h3>${buffet.nome_buffet}</h3>
                        <p class="descricao">${buffet.descricao}</p>
                        <div class="tags">
                            <span class="tag-azul">Serviço Completo</span>
                        </div>
                        <p class="preco-label">Preço por pessoa</p>
                        <p class="preco-valor">R$ ${buffet.preco_por_pessoa}</p>
                        <button class="btn-selecionar" onclick="abrirDetalhesBuffet(${buffet.id_buffet})">Ver detalhes</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        container.innerHTML = "<p>Erro ao carregar os buffets.</p>";
    }
}

async function abrirDetalhesBuffet(id) {
    const modal = document.getElementById('modal-detalhes');
    const conteudo = document.getElementById('conteudo-detalhes');

    modal.style.display = "flex";
    conteudo.innerHTML = "Carregando cardápio...";

    try {
        const response = await fetch(`http://localhost:3000/buffets/${id}`);
        const buffet = await response.json();

        conteudo.innerHTML = `
            <img src="https://via.placeholder.com/600x300?text=Cardápio" style="width:100%; border-radius:8px;">
            <h2 style="margin-top:20px;">${buffet.nome_buffet}</h2>
            <p><strong>O que está incluso:</strong> ${buffet.descricao}</p>
            <hr>
            <p style="font-size: 20px;"><strong>Investimento:</strong> R$ ${buffet.preco_por_pessoa} por pessoa</p>
            <button class="btn-destaque" style="width:100%; padding:15px; margin-top:15px;">Escolher este Buffet</button>
        `;
    } catch (err) {
        conteudo.innerHTML = "<p>Erro ao carregar detalhes do buffet.</p>";
    }
}

// --- UTILITÁRIOS DE MODAL ---

function fecharModal() {
    document.getElementById('modal-detalhes').style.display = "none";
}

async function realizarAgendamento(idLocal, precoBase) {
    const data = document.getElementById('data_evento').value;
    const convidados = document.getElementById('qtd_convidados').value;
    const usuario = localStorage.getItem('usuarioLogado');

    if (!usuario) {
        alert("Você precisa estar logado para reservar!");
        return;
    }

    const dadosReserva = {
        id_local: idLocal,
        data_evento: data,
        qtd_convidados: convidados,
        valor_total: precoBase, // Por enquanto usamos o base, depois podemos somar o buffet
        status_pagamento: 'Pendente'
    };

    try {
        const response = await fetch('http://localhost:3000/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReserva)
        });

        if (response.ok) {
            alert("Reserva solicitada com sucesso! Aguarde contato do proprietário.");
            fecharModal();
        }
    } catch (err) {
        alert("Erro ao processar reserva.");
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target == modal) {
        fecharModal();
    }
};