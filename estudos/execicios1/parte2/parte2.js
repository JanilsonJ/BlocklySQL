if (!localStorage['progressoEstudos'] || JSON.parse(localStorage.getItem('progressoEstudos'))[0] < 2){
    window.location.href = "../../estudo.html";
}

var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    collapse: true,
    scrollbars: true,
    zoom: {
        startScale: 0.7
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);
Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

function mirrorEvent() {
    if (workspace.getAllBlocks().length == 0)
        Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

    for (let bloco in workspace.getAllBlocks(true)) {
        if (workspace.getAllBlocks(true)[bloco].type == 'insert_var' || workspace.getAllBlocks(true)[bloco].type == 'insert_var_default')
            workspace.getAllBlocks(true)[bloco].movable_ = true
        else
            workspace.getAllBlocks(true)[bloco].movable_ = false

        workspace.getAllBlocks(true)[bloco].editable_ = false
        workspace.getAllBlocks(true)[bloco].deletable_ = false
    }

    var code = Blockly.Lua.workspaceToCode(workspace);

    code = aplicarCor(code)
    document.getElementById("Codigo").innerHTML = code;
}

document.getElementById(`botao_enviar-resposta`).addEventListener("click", verificarResposta)

function verificarResposta() {
    let resposta = `CREATE DATABASE IF NOT EXISTS database;
USE database;

CREATE TABLE pessoa (
      id INTEGER NOT NULL AUTO_INCREMENT,
      nome VARCHAR(30),
      idade INTEGER,
      cpf VARCHAR(30) UNIQUE,
      PRIMARY KEY (id)
);

INSERT INTO pessoa
VALUES (NULL, "Anderson Joaquim Lima", 26, "230.083.525-88");`

    let codigo = document.getElementById('Codigo').textContent;

    if (codigo.includes(resposta)) {
        document.querySelector('.background').style.setProperty('right', '0');
        
        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));

        if (prog[0] < 3) 
            localStorage.setItem('progressoEstudos', JSON.stringify([3,prog[1],prog[2],prog[3]]));

    } else {
        document.querySelector('.alerta-aviso').style.setProperty('right', '15px');
        
        setTimeout(function(){
            document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
        }, 3000);
    }
}

document.getElementById(`botao_proximo-exercicio`).addEventListener("click", () => {
    window.location.href = "../parte3/parte3.html";
})

document.getElementById(`fecharAviso`).addEventListener("click", () => {
    document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
})

document.getElementById(`fecharCartaoResposta`).addEventListener("click", () => {
    document.querySelector('.background').style.setProperty('right', '-100vw');
})