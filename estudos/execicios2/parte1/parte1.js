var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    collapse: true,
    trashcan: true,
    zoom: {
        startScale: 0.9
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);

var codigoInicialWebSQL = `var db = openDatabase('ExerciciosBanco', '1.0', 'Web SQL', 65536);

db.transaction(function (transaction) {
    var sql = "DROP TABLE IF EXISTS pessoa;";
    transaction.executeSql(sql, [], function () {
        //console.log('Tabela pessoa excluída com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
});

db.transaction(function (transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS pessoa (  id INTEGER NOT NULL,nome VARCHAR(30) NOT NULL,cpf VARCHAR(30) UNIQUE,idade INTEGER,telefone VARCHAR(30), PRIMARY KEY (id));";
    transaction.executeSql(sql, [], function () {
        //console.log('Tabela pessoa criada com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Anderson Joaquim Lima","109.419.057-80",32,"(63) 2924-7115"], function () {
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Mariana Gabrielly Ribeiro","746.328.138-85",27,"(86) 3645-6679"], function () {
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Eduardo Manuel Barbosa","230.083.525-88",16,"(68) 3983-5955"], function () {
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

`;

function mirrorEvent(event) {

    if (this.workspace.getAllBlocks().length == 0){
        Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);
        
        var block = this.workspace.getBlocksByType('select')[0];

        //Remove campos desnecessarios 
        block.setMovable(false)
        
        //Remove campos desnecessarios 
        block.removeInput('join', true)
        block.removeInput('conditions', true)
        block.removeInput('orderby', true)
    }

    var code = Blockly.Lua.workspaceToCode(this.workspace);
    
    code = aplicarCor(code)
    document.getElementById("Codigo").innerHTML = code;

    //Verifica se alguma ação relevante foi realizada
    if ((event.type == Blockly.Events.BLOCK_CHANGE && (event.element == 'field' || event.element == 'disabled')) ||
        (event.type == Blockly.Events.BLOCK_MOVE && !event.oldParentId && event.newParentId) ||
        event.type == Blockly.Events.BLOCK_CREATE || event.type == Blockly.Events.BLOCK_DELETE) {

        try {
            code = codigoInicialWebSQL + Blockly.JavaScript.workspaceToCode(this.workspace);
            eval(code);
            document.getElementById('tabelaSelect').innerHTML = '';
            document.getElementById('tabelaSelect2').innerHTML = '';
        } catch (e) {
            //console.log(e) 
        }
    }
}

document.getElementById(`botao_enviar-resposta`).addEventListener("click", verificarResposta)

function verificarResposta() {
    var respostas = [
        {
            Id: "1",
            Nome: "Anderson Joaquim Lima",
            Cpf: "109.419.057-80",
            Idade: "32",
            Telefone: "(63) 2924-7115"
        },
        {
            Id: "2",
            Nome: "Mariana Gabrielly Ribeiro",
            Cpf: "746.328.138-85",
            Idade: "27",
            Telefone: "(86) 3645-6679"
        },
        {
            Id: "3",
            Nome: "Eduardo Manuel Barbosa",
            Cpf: "230.083.525-88",
            Idade: "16",
            Telefone: "(68) 3983-5955"
        }
    ]

    try {
        var tabela = tableToObj(document.getElementById('tabelaSelect2'));
    } catch(e) {}

    if (isContainedIn(respostas, tabela)) {
        document.querySelector('.background').style.setProperty('right', '0');

        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));
        if (prog[1] < 2)
            localStorage.setItem('progressoEstudos', JSON.stringify([prog[0], 2, prog[2], prog[3]]));

    } else {
        document.querySelector('.alerta-aviso').style.setProperty('right', '15px');
        
        setTimeout(function(){
            document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
        }, 3000);
    }
}

document.getElementById(`botao_proximo-exercicio`).addEventListener("click", () => {
    window.location.href = "../parte2/parte2.html";
})

document.getElementById(`fecharAviso`).addEventListener("click", () => {
    document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
})

document.getElementById(`fecharCartaoResposta`).addEventListener("click", () => {
    document.querySelector('.background').style.setProperty('right', '-100vw');
})

document.querySelector('.background').addEventListener("click", () => {
    document.querySelector('.background').style.setProperty('right', '-100vw');
})

function isContainedIn(a, b) {
    if (typeof a != typeof b)
        return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        // assuming same order at least
        for (var i=0, j=0, la=a.length, lb=b.length; i<la && j<lb;j++)
            if (isContainedIn(a[i], b[j]))
                i++;
        return i==la;
    } else if (Object(a) === a) {
        for (var p in a)
            if (!(p in b && isContainedIn(a[p], b[p])))
                return false;
        return true;
    } else
        return a === b;
}

function tableToObj(table) {
    var rows = table.rows;
    var propCells = rows[0].cells;
    var propNames = [];
    var results = [];
    var obj, cells;

    for (var i = 0, iLen = propCells.length; i < iLen; i++) {
        propNames.push(propCells[i].textContent || propCells[i].innerText);
    }

    for (var j = 1, jLen = rows.length; j < jLen; j++) {
        cells = rows[j].cells;
        obj = {};

        for (var k = 0; k < iLen; k++) {
            obj[propNames[k]] = cells[k].textContent || cells[k].innerText;
        }
        results.push(obj)
    }
    return results;
}