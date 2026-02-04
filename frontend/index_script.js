document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    // 1. VERIFICAÇÃO DE LOGIN: Personaliza o menu se o usuário estiver logado
    if (usuarioLogado) {
        // Substitui os botões de Entrar/Cadastrar pelo nome do usuário e botão Sair
        authLinks.innerHTML = `
            <span class="user-name" style="margin-right: 15px;">Olá, <strong>${usuarioLogado}</strong></span>
            <a href="#" id="btn-sair" style="color: #ff4d4d; text-decoration: none; font-weight: bold;">Sair</a>
        `;

        // Lógica para o botão Sair
        document.getElementById('btn-sair').addEventListener('click', (e) => {
            e.preventDefault();
            // Remove o nome do usuário da memória do navegador
            localStorage.removeItem('usuarioLogado'); 
            // Recarrega a página para voltar ao estado inicial (com botões Entrar/Cadastrar)
            window.location.reload(); 
        });
    }

    // 2. CARREGAMENTO DE CONTEÚDO (Próximas etapas do projeto)
    carregarLocais();
    carregarBuffets();
});

// Funções que vamos preencher em breve para buscar dados no Banco de Dados
async function carregarLocais() {
    console.log("Status: Aguardando lógica para buscar locais...");
}

async function carregarBuffets() {
    console.log("Status: Aguardando lógica para buscar buffets...");
}