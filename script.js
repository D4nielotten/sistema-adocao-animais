let animais = JSON.parse(localStorage.getItem("animais")) || [];

function salvar(){
localStorage.setItem("animais", JSON.stringify(animais));
}

function mostrarAnimais(){

let lista = document.getElementById("listaAnimais");
lista.innerHTML = "";

animais.forEach(function(animal, index){

let card = `
<div class="animal ${animal.especie}">
<img src="${animal.foto}">
<h3>${animal.nome}</h3>
<p>Porte: ${animal.porte}</p>

<button onclick="removerAnimal(${index})">Excluir</button>
</div>
`;

lista.innerHTML += card;

});

}

document.getElementById("formAnimal").addEventListener("submit", function(e){

e.preventDefault();

let nome = document.getElementById("nome").value;
let especie = document.getElementById("especie").value;
let porte = document.getElementById("porte").value;

let arquivo = document.getElementById("foto").files[0];

if(!arquivo){
alert("Selecione uma foto do animal");
return;
}

let leitor = new FileReader();

leitor.onload = function(event){

let foto = event.target.result;

animais.push({
nome:nome,
especie:especie,
porte:porte,
foto:foto
});

salvar();
mostrarAnimais();

};

leitor.readAsDataURL(arquivo);

});

function removerAnimal(index){

animais.splice(index,1);
salvar();
mostrarAnimais();

}

mostrarAnimais();