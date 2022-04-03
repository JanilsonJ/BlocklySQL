if (!localStorage['progressoEstudos'])
    localStorage.setItem('progressoEstudos', JSON.stringify([1, 1]));
    
// Redirecionamento de pagina
for (let exercicio = 1; exercicio < 3; exercicio++) {
    for (let questao = 1; questao < 6; questao++) {
        document.getElementById(`${exercicio}${questao}`).addEventListener("click", () => {
            window.location.href = `./estudos/execicios${exercicio}/parte${questao}/parte${questao}.html`;
        })
    }
}

verificarProgressos();

function verificarProgressos() {
    for (let i = 1, j; i < 3; i++) { //Passa pelos exercicios
        let QuestaoAtual = JSON.parse(localStorage.getItem('progressoEstudos'))[i-1]; //Pega a fase atual do exercicio 1 e 2 dependendo do i
           
        for (j = 1; j < 6; j++) {
            var exercicio = document.getElementById(`${i}${j}`);

            if (j < QuestaoAtual){
                exercicio.style.setProperty('background-color', '#2e914f');
                exercicio.classList.add('cartao-botao-hover');
            }else if (j == QuestaoAtual){
                exercicio.style.setProperty('background-color', '#dabc36');
                exercicio.classList.add('cartao-botao-hover');
            }else{
                exercicio.style.setProperty('cursor', 'unset');
                exercicio.setAttribute("disabled", "disabled");
            }
        }
        
        if (j == 6)
            document.getElementById(`exercicio${i}-completo`).innerHTML = 'task_alt'
    }
}



