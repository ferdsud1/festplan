document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const campoMensagem = document.getElementById('mensagem-login');

    // Limpa a mensagem de erro anterior antes de tentar novamente
    campoMensagem.innerText = "";

    try {
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await response.json();

        if (response.ok) {
            // SUCESSO: Salva o nome e redireciona direto (SEM ALERT)
            localStorage.setItem('usuarioLogado', dados.usuario);
            window.location.href = "index.html";
        } else {
            // ERRO: Mostra o texto na tela
            campoMensagem.innerText = "❌ " + (dados.erro || "E-mail ou senha incorretos.");
            campoMensagem.style.color = "red";
        }
    } catch (error) {
        campoMensagem.innerText = "❌ Erro ao conectar com o servidor.";
        campoMensagem.style.color = "red";
    }
});