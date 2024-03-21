
const opemModal = document.getElementById("opem-modal");
const modal = document.querySelector("dialog");
const cancelModal = document.getElementById("cancelar-bnt");

// Dom dos inputs 
const tbody = document.querySelector("tbody");
const descInput = document.getElementById("desc-input");
const ValorInput = document.getElementById("desc-inpu-numbert");
const dataInput = document.getElementById("date");
const salvar = document.getElementById("salvar-bnt"); 

//  Dom dos cards
const entradas = document.getElementById("icomes");
const saidas = document.getElementById("expenses");
const total = document.getElementById("total-number");

let items = [];

opemModal.onclick = function(){
    modal.showModal();
};

cancelModal.onclick = function(){
    modal.close();
};   
salvar.onclick = function(){
    modal.close();
}; 

// pegga o item numa posiçao , para nao excluir mais de um item , atualisa o banco, carrega em tela as aiuteraçoes
function deleteItem(index){
    items.splice(index, 1);
    setItensBD();
    loadItens();
};


function insertItem(item) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.descInput}</td>
      <td>${item.ValorInput}</td>
      <td>${item.dataInput}</td>
      <td class="columnAction">
        <button id="minus" onclick="deleteItem(${items.indexOf(item)})"><i  id="buttonIcons" class="fa fa-minus-circle" aria-hidden="true"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
}

// carrega as iformaçoes do banco , limpa o tbody para nao aver duplicaçao de itens, foriche em cada item passand o item e seu index
function loadItens() {
    items = getItensBD();
    tbody.innerHTML= "";
    items.forEach((item , index) => {
        insertItem(item , index);
    });
    
    getTotal();
}

function getTotal() {
    let totalSaidas = 0;

    // percorre por todods os itens da minha lista ,covertendo os valoers em numericos , verifica se o valor e negativo somndo a variavel de saidas 
    items.forEach(item => {
        const amoutExpenses = parseFloat(item.ValorInput.replace(',', '.')); 0// Convertendo para número e substituindo vírgula por ponto
        if (amoutExpenses < 0) {
            totalSaidas += amoutExpenses;
        }
    });

    saidas.textContent = `R$ ${totalSaidas.toFixed(2)}`;

    let totalEntradas = 0;

    items.forEach(item =>{
        const amoutIcomes = parseFloat(item.ValorInput.replace(',','.'));
        if(amoutIcomes >0) {
            totalEntradas += amoutIcomes;
        }
    })

    entradas.textContent = `R$ ${totalEntradas.toFixed(2)}`;

    let TotalEntra = totalSaidas + totalEntradas;

    total.textContent = `R$ ${TotalEntra.toFixed(2)}`;
  
}
// pegando os intens que estao no banco , no meu local storege , se nao array vazio
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () => localStorage.setItem("db_items", JSON.stringify(items));
// inserino no banco as informaçoes da minha variavel itens


loadItens();    

salvar.addEventListener("click", function(event) {
    event.preventDefault(); // Para evitar o comportamento padrão de enviar formulários
    if( descInput.value === "" || ValorInput.value === "" || dataInput.value === "" ) {
        alert("Preencha todos os campos corretamente!");
        return; // Retorna para evitar a execução do código abaixo caso algum campo esteja vazio
    }
    
    // armazena os valores dos campos de entrdas parar facilitar o acesso e a reutilizaçao
    const descInputValue = descInput.value;
    const valorInputValue = ValorInput.value;
    const dataInputValue = dataInput.value;


    //  objeto que armazena os valores dos campos de entrada com as chaves correspondentes 
    const newItem = {
        descInput: descInputValue,
        ValorInput: valorInputValue,
        dataInput: dataInputValue
    };

    items.push(newItem);
    setItensBD();
    loadItens();
});
