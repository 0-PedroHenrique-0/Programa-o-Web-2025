function loginSenac(){
    let usuario = document.getElementById('txtUsuario').value;
    let senha = document.getElementById('txtSenha').value;
    let mensagem = document.getElementById('mensagem');
 
    if(usuario == 'admin' && senha == 'admin123'){
        mensagem.style.color = "green";
        mensagem.innerText = "Login correto";
        setTimeout(()=> {
            window.location.href = 'https://www.google.com.br'
        },1)
    }
    else {
        mensagem.style.color = "red";
        mensagem.innerText = "Usuário ou senha inválidos";
    }
}