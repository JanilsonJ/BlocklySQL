if (!localStorage['progressoEstudos'])
    localStorage.setItem('progressoEstudos', JSON.stringify([1, 1]));

verificarProgressos();

function verificarProgressos() {

    for (let i = 1, j; i < 3; i++) {
        let faseAtual = JSON.parse(localStorage.getItem('progressoEstudos'))[i - 1];
        
        if(faseAtual == 6)
            document.getElementById(i).classList.add('text-warning')
           
        for (j = 1; j < faseAtual; j++) {
            var exercicio = document.getElementById(i + "." + j).classList;
            exercicio.remove('disabled');
            exercicio.remove('btn-primary');
            exercicio.add('btn-success');
        }
        if (faseAtual < 6) {
            exercicio = document.getElementById(i + "." + j).classList;
            exercicio.remove('disabled');
            exercicio.add('btn-primary');
            exercicio.remove('btn-secondary');
        }
    }
}