const bar = document.querySelector('.container .sidebar'),
mensRes = document.querySelector('.footer p'),
telaLogin = document.querySelector(".tela-login"),
login = telaLogin.querySelector("input"),
text = document.querySelector('.caixa-mensagem');
let usuarios = [],
mensagens = [],
textMensagem = [],
stopAtUser,
nome = "",
destinatário = "Todos",
visibilidade = "Público",
type = "message",
novoUsuario = {
    name: nome
};

login.addEventListener('keyup', function(event) {
    if (event.code === 'Enter')
    {
        event.preventDefault();
        entrar()
    }
});

function entrar(){
    nome = login.value;
    novoUsuario = {
        name: nome
    }
    adicionarNovoUsuario();
}

function trocarNome() {
    telaLogin.querySelector("p").innerHTML = "Nome já em uso, favor escolher outro nome!!";
}

function nomeOk(){
    telaLogin.classList.add('hide-side-bar');
    setInterval(manterConexao, 5000);
    setInterval(atualizaMensagens, 3000);
}

function adicionarNovoUsuario(){
const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', novoUsuario);
    promessa.then(nomeOk);
    promessa.catch(trocarNome);
}

function atualizaUsuarios() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promessa.then(renderizaUsuarios) 
}
   
function renderizaUsuarios(listaDeUsuários) {
    const ul = document.querySelector(".user ul");
    usuarios = listaDeUsuários.data; 
    ul.innerHTML = ``;
    for (let i=0; i < usuarios.length; i++){
        ul.innerHTML = ul.innerHTML + `
            <li onclick="contact(this)">
                <p><img src="./img/usuaro.png" alt=""><span>${usuarios[i].name}</span></p>
                <ion-icon class="hide" name="checkmark-sharp"></ion-icon>
            </li>

        `
    }
}

text.addEventListener('keyup', function(event) {
    if (event.code === 'Enter')
    {
        event.preventDefault();
        enviarMensagem()
    }
});

function enviarMensagem(){
    if (visibilidade === "Reservadamente" && destinatário !== "Todos"){
        type = "private_message";
    }else {
        type = "message";
    }
    const textMensagem = {
		from: novoUsuario.name,
		to:  destinatário,
		text: text.value,
		type: type 
	}

    if(textMensagem.text !== ""){
        axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', textMensagem);
    }
    text.value = "";
}

function manterConexao(){
	axios.post('https://mock-api.driven.com.br/api/v6/uol/status', novoUsuario);
}

function atualizaMensagens(){
    mensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    mensagens.then(renderizaMensagens);
}

  

function renderizaMensagens(listaMensagens) {
    const ul = document.querySelector('.mensagens');
    mensagens = listaMensagens.data;
    ul.innerHTML = '';
    for (let i = 0; i < mensagens.length; i++) {
    	if (mensagens[i].type === "status"){
	        ul.innerHTML = ul.innerHTML + `
	            <li class="back-cinza">
	                <p>(${mensagens[i].time})  <strong> ${mensagens[i].from}</strong> ${mensagens[i].text}</p>
	            </li>
	        `
        }else if (mensagens[i].type === "message" && mensagens[i].to === "Todos"){
	        ul.innerHTML = ul.innerHTML + `
	            <li class="back-branco">
	                <p>(${mensagens[i].time})  <strong> ${mensagens[i].from}</strong> para <strong> ${mensagens[i].to}:</strong> ${mensagens[i].text}</p>
	            </li>
	        `
        }else if ((mensagens[i].from == novoUsuario.name || mensagens[i].to === novoUsuario.name) && mensagens[i].type === "private_message"){//bonus 
            ul.innerHTML = ul.innerHTML + `
	            <li class="back-rosa">
	                <p>(${mensagens[i].time})  <strong> ${mensagens[i].from}</strong> reservadamente para <strong> ${mensagens[i].to}:</strong> ${mensagens[i].text}</p>
	            </li>
            `
        }else{
            ul.innerHTML = ul.innerHTML + `
                <li class="back-branco">
                    <p>(${mensagens[i].time})  <strong> ${mensagens[i].from}</strong> para <strong> ${mensagens[i].to}:</strong> ${mensagens[i].text}</p>
                </li>
            `
        }
    }
    ul.lastElementChild.scrollIntoView();
}

function showSideBar(){
    atualizaUsuarios();
    bar.classList.remove("hide-side-bar");
}

function hideSideBar(){
    bar.classList.add("hide-side-bar");
    if (visibilidade == "Reservadamente" && destinatário !=="Todos"){
       mensRes.innerHTML = `Enviando para ${destinatário} (reservadamente)`;
    }else{
        mensRes.innerHTML = "";
    }
}

function contact(c){
    const selecionado = document.querySelector('.user .selecionado');
    const user = c.querySelector("span");
    const icon = c.querySelector("ion-icon");
    if(selecionado && selecionado != c){
        selecionado.querySelector("ion-icon").classList.add("hide");
        selecionado.classList.remove("selecionado");
    } 
    destinatário = user.innerHTML;
    icon.classList.remove("hide");
    c.classList.add("selecionado");
}

function visible(v){
    const selecionado = document.querySelector('.visibilidade .selecionado');
    const visibility = v.querySelector("span");
    const icon = v.querySelector("ion-icon");
    if(selecionado && selecionado != v){
        selecionado.querySelector("ion-icon").classList.add("hide");
        selecionado.classList.remove("selecionado");
    }
    visibilidade = visibility.innerHTML;
    icon.classList.remove("hide");
    v.classList.add("selecionado");
}

