var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    //renderer: 'thrasos',
    collapse: true,
    trashcan: true,
    zoom: {
        startScale: 0.7
    }
});
workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener(this.mirrorEvent);

//Criando o banco para o exercicio
eval(`var db = openDatabase('ExerciciosBanco', '1.0', 'Web SQL', 65536);

db.transaction(function (transaction) {
    var sql = "DROP TABLE IF EXISTS pedido;";
    transaction.executeSql(sql, [], function () {
        //printSuccess();
        //console.log('Tabela pedido excluída com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
});

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
        //printSuccess();
        //console.log('Tabela pessoa criada com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Anderson Joaquim Lima","109.419.057-80",32,"(63) 2924-7115"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Mariana Gabrielly Ribeiro","746.328.138-85",27,"(86) 3645-6679"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pessoa VALUES (NULL,?,?,?,?);";
    transaction.executeSql(sql, ["Eduardo Manuel Barbosa","230.083.525-88",16,"(68) 3983-5955"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS pedido (  id_pedido INTEGER NOT NULL,id_comprador INTEGER,valor_compra FLOAT,data_compra TIMESTAMP, FOREIGN KEY (id_comprador) REFERENCES pessoa(id), PRIMARY KEY (id_pedido));";
    transaction.executeSql(sql, [], function () {
        //printSuccess();
        //console.log('Tabela pedido criada com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pedido VALUES (NULL,?,?,?);";
    transaction.executeSql(sql, [2,76.80,"2021-09-28 21:3:25"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pedido VALUES (NULL,?,?,?);";
    transaction.executeSql(sql, [1,124.90,"2021-08-25 16:4:49"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pedido VALUES (NULL,?,?,?);";
    transaction.executeSql(sql, [2,95,"2021-09-29 16:1:20"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

db.transaction(function (transaction) {
    var sql = "INSERT INTO pedido VALUES (NULL,?,?,?);";
    transaction.executeSql(sql, [3,49.90,"2021-09-05 14:5:31"], function () {
        //printSuccess();
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
        //printErr(err);
    })
})

`);

function mirrorEvent(event) {
    //Configuração SELECT JOIN
    try {
        var bloco_join = Blockly.mainWorkspace.getBlocksByType('select_join')[0];
        var nomeTabela = Blockly.mainWorkspace.getBlocksByType('select_from')[0].getFieldValue('table_name');
        bloco_join.setFieldValue(bloco_join.getFieldValue('table_name'), 'tabela1')
        bloco_join.setFieldValue(nomeTabela, 'tabela2')
    } catch (error) {}

    if (this.workspace.getAllBlocks().length == 0){
        Blockly.Xml.domToWorkspace(document.getElementById('xml1'), workspace);
        
        var block = this.workspace.getBlocksByType('select')[0];

        //Remove campos desnecessarios 
        block.setMovable(false)
        
        //Remove campos desnecessarios 
        block.removeInput('conditions', true)
    }

    var code = Blockly.Lua.workspaceToCode(this.workspace);

    code = aplicarCor(code)
    document.getElementById("Codigo").innerHTML = code;

    if ((event.type == Blockly.Events.BLOCK_CHANGE && (event.element == 'field' || event.element == 'disabled')) ||
        (event.type == Blockly.Events.BLOCK_MOVE && !event.oldParentId && event.newParentId) ||
        event.type == Blockly.Events.BLOCK_CREATE || event.type == Blockly.Events.BLOCK_DELETE) {

        try {
            code = `var db = openDatabase('ExerciciosBanco', '1.0', 'Web SQL', 65536);` + Blockly.JavaScript.workspaceToCode(this.workspace);
            eval(code);
            document.getElementById('tabelaSelect').innerHTML = '';
        } catch (e) {
            //console.log(e) 
        }
    }
}

document.getElementById(`botao_enviar-resposta`).addEventListener("click", verificarResposta)

function verificarResposta() {
    var respostas = [
        {
            "Id_pedido": "2",
            "Nome": "Anderson Joaquim Lima",
            "Telefone": "(63) 2924-7115",
            "Data_compra": "2021-08-25 16:4:49",
            "Valor_compra": "124.9"
        },
        {
            "Id_pedido": "3",
            "Nome": "Mariana Gabrielly Ribeiro",
            "Telefone": "(86) 3645-6679",
            "Data_compra": "2021-09-29 16:1:20",
            "Valor_compra": "95"
        },
        {
            "Id_pedido": "1",
            "Nome": "Mariana Gabrielly Ribeiro",
            "Telefone": "(86) 3645-6679",
            "Data_compra": "2021-09-28 21:3:25",
            "Valor_compra": "76.8"
        },
        {
            "Id_pedido": "4",
            "Nome": "Eduardo Manuel Barbosa",
            "Telefone": "(68) 3983-5955",
            "Data_compra": "2021-09-05 14:5:31",
            "Valor_compra": "49.9"
        }
    ]

    try {
        var tabela = tableToObj(document.getElementById('tabelaSelect'));
    } catch(e) {
        //console.log(e)
    }
    
    if (isContainedIn(respostas, tabela) && isContainedIn(tabela, respostas)) {
        document.querySelector('.background').style.setProperty('right', '0');

        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));
        if (prog[1] < 6)
            localStorage.setItem('progressoEstudos', JSON.stringify([prog[0], 6, prog[2], prog[3]]));

    } else {
        document.querySelector('.alerta-aviso').style.setProperty('right', '15px');
        
        setTimeout(function(){
            document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
        }, 3000);
    }
}

document.getElementById(`botao_proximo-exercicio`).addEventListener("click", () => {
    window.location.href = "../../../estudo.html";
})

document.getElementById(`fecharAviso`).addEventListener("click", () => {
    document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
})

document.getElementById(`fecharCartaoResposta`).addEventListener("click", () => {
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
    var obj, row, cells;

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

