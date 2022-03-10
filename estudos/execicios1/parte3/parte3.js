if (!localStorage['progressoEstudos'] || JSON.parse(localStorage.getItem('progressoEstudos'))[0] < 3){
    window.location.href = "../../estudo.html";
}

var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    collapse: true,
    scrollbars: true,
    zoom: {
        startScale: 0.7,
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);
Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

function mirrorEvent() {
    if (workspace.getAllBlocks().length == 0)
        Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

    for (let bloco in workspace.getAllBlocks(true)) {
        if (workspace.getAllBlocks(true)[bloco].type == 'insert_var' || workspace.getAllBlocks(true)[bloco].type == 'insert_var_default') {
            workspace.getAllBlocks(true)[bloco].movable_ = true
        } else
            workspace.getAllBlocks(true)[bloco].movable_ = false

        workspace.getAllBlocks(true)[bloco].editable_ = false
        workspace.getAllBlocks(true)[bloco].deletable_ = false
    }

    var code = Blockly.Lua.workspaceToCode(workspace);

    code = aplicarCor(code)
    document.getElementById("Codigo").innerHTML = code;
}

function verificarResposta() {
    let resposta = `CREATE DATABASE IF NOT EXISTS database;
USE database;

CREATE TABLE pessoa (
      id INTEGER NOT NULL AUTO_INCREMENT,
      nome VARCHAR(30),
      idade INTEGER,
      sexo CHAR(1),
      cpf VARCHAR(30) UNIQUE,
      PRIMARY KEY (id)
);

INSERT INTO pessoa (id,nome,idade,sexo,cpf)
VALUES (NULL, "Anderson Joaquim Lima", 32, "M", "109.419.057-80");`

    let codigo = document.getElementById('Codigo').textContent;

    if (codigo.includes(resposta)) {
        document.getElementById('respostaCorreta').style.display = 'block'
        document.getElementById('respostaErrada').style.display = 'none'
        
        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));

        if (prog[0] < 4) 
            localStorage.setItem('progressoEstudos', JSON.stringify([4,prog[1],prog[2],prog[3]]));

    } else {
        document.getElementById('respostaErrada').style.display = 'block'
        document.getElementById('respostaCorreta').style.display = 'none'
    }
}