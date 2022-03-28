/*Aviso para caso de erro*/
document.querySelector('.alerta-copia').style.setProperty('right', '15px');
document.getElementById('alertaMensagemInfo').innerHTML = 'Em caso de erro aperte ctrl + shift + r para limpar o cache da página.';

setTimeout(function(){
    document.querySelector('.alerta-copia').style.setProperty('right', '-1000px');
}, 3000);
        

var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'),
    scrollbars: true,
    renderer: 'geras',
    collapse: true,
    horizontalLayout: false,
    trashcan: true,
    zoom: {
        controls: true,
        wheel: true,
        startScale: 0.6,
        maxScale: 3,
        minScale: 0.5,
        scaleSpeed: 1.2,
        pinch: true
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);

//Carrega a ultima workspace ou o bloco de conexção ao banco
try {
    if (localStorage.getItem('lastWorkspace').length > 61)
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(localStorage.getItem('lastWorkspace')), workspace);
    else
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom('<xml><block type="start_sql"><field name="db_name">db</field></block></xml>'), workspace);
} catch (err) {
    console.log(err);
}

function mirrorEvent() {
    let linguagem = document.getElementById("linguagens").value;

    switch (linguagem) {
        case "WebSQL":
            var code = Blockly.JavaScript.workspaceToCode(this.workspace);
            break;
        case "MySQL":
            var code = Blockly.Lua.workspaceToCode(this.workspace);
            break;
    }

    document.getElementById("codigo").innerHTML = aplicarColor(code);

    //Configuração SELECT JOIN
    try {
        var bloco_join = Blockly.mainWorkspace.getBlocksByType('select_join')[0];
        var nomeTabela = Blockly.mainWorkspace.getBlocksByType('select_from')[0].getFieldValue('table_name');
        bloco_join.setFieldValue(bloco_join.getFieldValue('table_name'), 'tabela1')
        bloco_join.setFieldValue(nomeTabela, 'tabela2')
    } catch (error) {}

    // Salva a workspace no armazenamento do browser
    localStorage.setItem('lastWorkspace', Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace)));
}

function testDB() {
    if (confirm('Deseja criar o banco de dados exemplo?')) {
        workspace.toolbox_.flyout_.hide();
        workspace.toolbox_.clearSelection()
        workspace.clear();
        Blockly.Xml.domToWorkspace(document.getElementById('testDB'), workspace);
    }
};

function saveWS() {
    if (confirm('Salva a workspace irá deletar o salvamento atual. Continuar?')) {
        workspace.toolbox_.flyout_.hide();
        workspace.toolbox_.clearSelection()
        var xml = Blockly.Xml.workspaceToDom(this.workspace);
        localStorage.setItem('savedWorkspace', Blockly.Xml.domToText(xml));
    }
};

function loadWS() {
    if (confirm('Carregar a workspace salva irá substutuir a workspace atual. Continuar?')) {
        workspace.toolbox_.flyout_.hide();
        workspace.toolbox_.clearSelection()
        workspace.clear();
        xml = Blockly.Xml.textToDom(localStorage.getItem('savedWorkspace'));
        Blockly.Xml.domToWorkspace(xml, workspace);
    }
};

function clearWS() {
    if (confirm('Limpar workspace?')) {
        workspace.toolbox_.flyout_.hide();
        workspace.toolbox_.clearSelection()
        workspace.clear();
    }
};

function runCode() {
    // Gera o código JavaScript e o executa.
    if (confirm("A aplicação executara o WebSQL como demostração. Deseja continuar?")) {
        closeAlerts();
        var code = Blockly.JavaScript.workspaceToCode(this.workspace);
        try {
            eval(code);
            document.getElementById('tabelaSelect').innerHTML = '';
        } catch (e) { console.log(e) }
    }
}

function copyCode() {
    var range = document.createRange();
    range.selectNode(document.getElementById("codigo"));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
    
    closeAlerts()
    
    // Configuração o alert
    document.querySelector('.alerta-copia').style.setProperty('right', '15px');
    document.getElementById('alertaMensagemInfo').innerHTML = 'Código ' + document.getElementById("linguagens").value + ' copiado para área de tranferência.';

    setTimeout(function(){
        document.querySelector('.alerta-copia').style.setProperty('right', '-1000px');
    }, 3000);
}

function closeAlerts() {
    document.querySelector('.alerta-sucesso').style.setProperty('right', '-1000px');
    document.querySelector('.alerta-copia').style.setProperty('right', '-1000px');
    document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
}

function mudarTema() {
    let codigo = document.getElementById("codigo").classList;
    let btn = document.querySelector('.botao__icone-tema');
    var tema = document.querySelector(':root'); //Muda a cor da Workspace

    if (codigo.contains('codigo-tema-escuro')){
        codigo.add('codigo-tema-claro');
        codigo.remove('codigo-tema-escuro');

        tema.style.setProperty('--backgorund-tema', 'rgb(230, 230, 230)'); //Muda a cor da Workspace
        
        btn.style.setProperty('color', 'rgb(75, 69, 69)'); //Muda a cor da área de código
        btn.innerHTML = 'dark_mode'
    } else{
        codigo.add('codigo-tema-escuro');
        codigo.remove('codigo-tema-claro');

        tema.style.setProperty('--backgorund-tema', 'rgb(25, 25, 25)'); //Muda a cor da Workspace

        btn.style.setProperty('color', 'rgb(218, 188, 18)'); //Muda a cor da área de código
        btn.innerHTML = 'light_mode'
    }
}

function aplicarColor(code){
    code = code.replace(/CREATE DATABASE/g, "<span class='color_create_db'>CREATE DATABASE</span>");
    code = code.replace(/USE/g, "<span class='color_create_db'>USE</span>");
    code = code.replace(/CREATE TABLE/g, "<span class='color_create_table'>CREATE TABLE</span>");
    code = code.replace(/INSERT INTO/g, "<span class='color_insert'>INSERT INTO</span>");
    code = code.replace(/DROP TABLE/g, "<span class='color_drop_table'>DROP TABLE</span>");
    code = code.replace(/UPDATE/g, "<span class='color_update'>UPDATE</span>");
    code = code.replace(/SELECT/g, "<span class='color_select'>SELECT</span>");
    code = code.replace(/ALTER TABLE/g, "<span class='color_alter_table'>ALTER TABLE</span>");

    code = code.replace(/INTEGER/g, "<span class='color_var'>INTEGER</span>");
    code = code.replace(/VARCHAR/g, "<span class='color_var'>VARCHAR</span>");
    code = code.replace(/CHAR/g, "<span class='color_var'>CHAR</span>");
    code = code.replace(/DATE,/g, "<span class='color_var'>DATE,</span>");
    code = code.replace(/CURRENT_TIMESTAMP/g, "<span class='color_var'>CURRENT_TIMESTAMP</span>");
    code = code.replace(/TIMESTAMP/g, "<span class='color_var'>TIMESTAMP</span>");
    code = code.replace(/PRIMARY KEY/g, "<span class='color_var'>PRIMARY KEY</span>");
    code = code.replace(/FOREIGN KEY/g, "<span class='color_var'>FOREIGN KEY</span>");
    code = code.replace(/REFERENCES/g, "<span class='color_var'>REFERENCES</span>");
    code = code.replace(/UNIQUE/g, "<span class='color_var'>UNIQUE</span>");
    code = code.replace(/AUTO_INCREMENT/g, "<span class='color_var'>AUTO_INCREMENT</span>");
    
    code = code.replace(/ASC/g, "<span class='color_var'>ASC</span>");
    code = code.replace(/DESC/g, "<span class='color_var'>DESC</span>");
    code = code.replace(/AND/g, "<span class='color_var'>AND</span>");
    code = code.replace(/ON/g, "<span class='color_var'>ON</span>");
    code = code.replace(/ADD/g, "<span class='color_var'>ADD</span>");
    code = code.replace(/DROP COLUMN/g, "<span class='color_var'>DROP COLUMN</span>");

    code = code.replace(/DISTINCT/g, "<span class='color_var'>DISTINCT</span>");
    code = code.replace(/SET/g, "<span class='color_var'>SET</span>");
    code = code.replace(/VALUES/g, "<span class='color_var'>VALUES</span>");
    
    code = code.replace(/FROM/g, "<span class='color_select'>FROM</span>");
    code = code.replace(/WHERE/g, "<span class='color_select'>WHERE</span>");
    code = code.replace(/ORDER BY/g, "<span class='color_select'>ORDER BY</span>");
    code = code.replace(/JOIN/g, "<span class='color_select'>JOIN</span>");
    code = code.replace(/INNER/g, "<span class='color_select'>INNER</span>");
    code = code.replace(/LEFT/g, "<span class='color_select'>LEFT</span>");
    code = code.replace(/RIGHT/g, "<span class='color_select'>RIGHT</span>");
    code = code.replace(/FULL/g, "<span class='color_select'>FULL</span>");

    code = code.replace(/%/g, "<span style='color: rgb(197, 147, 97)'>%</span>");
    code = code.replace(/"/g, "<span style='color: rgb(197, 147, 97)'>" + '"' + "</span>");
    
    code = code.replace(/ > /g, "<span style='color: rgb(203, 107, 26)'> > </span>");
    code = code.replace(/ >= /g, "<span style='color: rgb(203, 107, 26)'> >= </span>");
    code = code.replace(/ < /g, "<span style='color: rgb(203, 107, 26)'> < </span>");
    code = code.replace(/ <= /g, "<span style='color: rgb(203, 107, 26)'> <= </span>");
    code = code.replace(/ = /g, "<span style='color: rgb(203, 107, 26)'> = </span>");
    code = code.replace(/LIKE/g, "<span style='color: rgb(203, 107, 26)'>LIKE</span>");
    code = code.replace(/BETWEEN/g, "<span style='color: rgb(203, 107, 26)'>BETWEEN</span>");
    code = code.replace(/ IN /g, "<span style='color: rgb(203, 107, 26)'> IN </span>");

    code = code.replace(/NOT/g, "<span style='color: rgb(192, 53, 53)'>NOT</span>");
    code = code.replace(/NULL|null|"null"/g, "<span style='color: rgb(203, 107, 26)'>NULL</span>");

    return code;
}