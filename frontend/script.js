document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const mensagemElemento = document.getElementById('mensagem');
    
    // Limpa qualquer mensagem de erro anterior
    mensagemElemento.innerText = "";

    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value
    };

    try {
        const response = await fetch('http://localhost:3000/usuarios/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            // SUCESSO: Vai direto para o login, sem interromper com alert
            window.location.href = "login.html"; 
        } else {
            // ERRO: Mostra o texto na tela
            const erroDados = await response.json();
            mensagemElemento.innerText = "❌ " + (erroDados.erro || "Erro ao cadastrar. Verifique os dados.");
            mensagemElemento.style.color = "red";
        }
    } catch (error) {
        mensagemElemento.innerText = "❌ Servidor offline. Tente novamente mais tarde.";
        mensagemElemento.style.color = "red";
    }
});