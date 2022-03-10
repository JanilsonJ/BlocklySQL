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

var codigoInicialWebSQL = `var db = openDatabase('ExerciciosBanco', '1.0', 'Web SQL', 65536);

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
    var sql = "CREATE TABLE IF NOT EXISTS pessoa (  id_pessoa INTEGER NOT NULL,nome VARCHAR(30) NOT NULL,cpf VARCHAR(30) UNIQUE,idade INTEGER,telefone VARCHAR(30), PRIMARY KEY (id_pessoa));";
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

`;

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
        block.removeInput('orderby', true)
        block.removeInput('conditions', true)
    }

    var code = Blockly.Lua.workspaceToCode(this.workspace);

    code = aplicarCor(code)
    document.getElementById("Codigo").innerHTML = code;

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

function verificarResposta() {
    var timestamp = new Date();
    var data = timestamp.toJSON().slice(0, 10);
    var hora = timestamp.getHours();
    var min = timestamp.getMinutes();
    var seg = timestamp.getSeconds();

    variaveis[count] = `"${data} ${hora}:${min}:${seg}"`;

    var respostas = [
        {
            "Id_pessoa": "2",
            "Nome": "Mariana Gabrielly Ribeiro",
            "Cpf": "746.328.138-85",
            "Idade": "27",
            "Telefone": "(86) 3645-6679",
            "Id_pedido": "1",
            "Id_comprador": "2",
            "Valor_compra": "76.8",
            "Data_compra": "2021-09-28 21:3:25"
        },
        {
            "Id_pessoa": "1",
            "Nome": "Anderson Joaquim Lima",
            "Cpf": "109.419.057-80",
            "Idade": "32",
            "Telefone": "(63) 2924-7115",
            "Id_pedido": "2",
            "Id_comprador": "1",
            "Valor_compra": "124.9",
            "Data_compra": "2021-08-25 16:4:49"
        },
        {
            "Id_pessoa": "2",
            "Nome": "Mariana Gabrielly Ribeiro",
            "Cpf": "746.328.138-85",
            "Idade": "27",
            "Telefone": "(86) 3645-6679",
            "Id_pedido": "3",
            "Id_comprador": "2",
            "Valor_compra": "95",
            "Data_compra": "2021-09-29 16:1:20"
        },
        {
            "Id_pessoa": "3",
            "Nome": "Eduardo Manuel Barbosa",
            "Cpf": "230.083.525-88",
            "Idade": "16",
            "Telefone": "(68) 3983-5955",
            "Id_pedido": "4",
            "Id_comprador": "3",
            "Valor_compra": "49.9",
            "Data_compra": "2021-09-05 14:5:31"
        }
    ]

    try {
        var tabela = tableToObj(document.getElementById('tabelaSelect2'));
    } catch(e) {
        //console.log(e)
    }
    
    if (isContainedIn(respostas, tabela) && isContainedIn(tabela, respostas)) {
        document.getElementById('respostaCorreta').style.display = 'block'
        document.getElementById('respostaErrada').style.display = 'none'

        let prog = JSON.parse(localStorage.getItem('progressoEstudos'));
        if (prog[1] < 5)
            localStorage.setItem('progressoEstudos', JSON.stringify([prog[0], 5, prog[2], prog[3]]));

    } else {
        document.getElementById('respostaErrada').style.display = 'block'
        document.getElementById('respostaCorreta').style.display = 'none'
    }
}

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

