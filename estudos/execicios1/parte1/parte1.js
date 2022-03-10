var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    //renderer: 'thrasos',
    collapse: true,
    scrollbars: true,
    zoom: {
        startScale: 0.9
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);
Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

function mirrorEvent() {
    if (this.workspace.getAllBlocks().length == 0)
        Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);

    for (let i = 0; i < this.workspace.getAllBlocks(true).length; i++) {
        this.workspace.getAllBlocks(true)[i].movable_ = true
        this.workspace.getAllBlocks(true)[i].editable_ = false
        this.workspace.getAllBlocks(true)[i].deletable_ = false
    }

    var code = Blockly.Lua.workspaceToCode(this.workspace);

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
      PRIMARY KEY (id)
);

INSERT INTO pessoa
VALUES (NULL, "Anderson Joaquim Lima", 32);`

    let codigo = document.getElementById('Codigo').textContent;

    if (codigo.includes(resposta)) {
        document.getElementById('respostaCorreta').style.display = 'block'
        document.getElementById('respostaErrada').style.display = 'none'
        
        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));

        if (prog[0] < 2) 
            localStorage.setItem('progressoEstudos', JSON.stringify([2,prog[1],prog[2],prog[3]]));

    } else {
        document.getElementById('respostaErrada').style.display = 'block'
        document.getElementById('respostaCorreta').style.display = 'none'
    }
}
