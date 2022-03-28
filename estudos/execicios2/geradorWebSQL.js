Blockly.JavaScript['start_sql'] = function(block) {
    var db_name = block.getFieldValue('db_name');
    // TODO: Assemble JavaScript into code variable.
    var code = `var db = openDatabase('${db_name}', '1.0', 'Web SQL', 65536);\n`;
    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.JavaScript['create_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var option = block.getFieldValue('option');
    var table_var = Blockly.JavaScript.statementToCode(block, 'table_var');
    // TODO: Assemble JavaScript into code variable.

    // Organiza o PRIMARY KEY
    if (table_var.includes("PRIMARY KEY")) {
        let array = table_var.split("PRIMARY KEY")
        table_var = array[0] + 'PRIMARY KEY (';
        for (let i = 1; i < array.length; i++) {
            while (array[i].includes(' '))
                array[i] = array[i].replace(' ', '');

            table_var += array[i].replace('\n', '').replace('(', '').replace(')', '');
        }
    }

    var code = `CREATE TABLE${option} ${table_name} (${table_var}`;
    if(code.includes('PRIMARY KEY'))
        code = code.slice(0, -1) + `));`;
    else
        code = code.slice(0, -1) + `);`;
        
    code = code.replace(` AUTO_INCREMENT`, '')
    
    var code = ` 
db.transaction(function (transaction) {
    var sql = "${code}";
    transaction.executeSql(sql, [], function () {
        //console.log('Tabela ${table_name} criada com Successo!');
    }, function (transaction, err) {
    })
})\n`;

    return code;
};

Blockly.JavaScript['table_var'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var type = block.getFieldValue('type');
    var opcao = block.getFieldValue('opcao');

    if (type != 'INTEGER' && opcao.includes('AUTO_INCREMENT'))
        var code = `${var_name} ${type},`;
    else
        var code = `${var_name} ${type}${opcao},`;

    return code;
};

Blockly.JavaScript['table_var_fk'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var table_name = block.getFieldValue('table_name');
    var var_name_reference = block.getFieldValue('var_name_reference');
    var code = ` FOREIGN KEY (${var_name}) REFERENCES ${table_name}(${var_name_reference}),`;
    return code;
};

Blockly.JavaScript['table_var_pk'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var code = ` PRIMARY KEY (${var_name}),`;
    return code;
};

/******************************************************************************************************************************************************************** */

var count = 0; //contador para a geração de variáveis ao inserir dados
var variaveis = []; 
Blockly.JavaScript['insert_table'] = function(block) {
    count = 0;
    variaveis = [];

    var table_name = block.getFieldValue('table_name');
    var vars = block.getFieldValue('vars');
    var table_var = Blockly.JavaScript.statementToCode(block, 'insert_var');

    if (vars != '')
        var vars = `(${vars})`;
        
    variaveis = variaveis.reverse();

    var interrogations = "";
    for (let i=0; i < count; i++){
        if (variaveis[i] == 'NULL')
            interrogations +=  variaveis[i] + ",";
        else 
            interrogations += "?,";   
    }

    variaveis = variaveis.toString();
    variaveis = variaveis.replace(/NULL,/g, "");
    variaveis = variaveis.replace(/,NULL/g, "");
    variaveis = variaveis.replace(/NULL/g, "");

    // TODO: Assemble JavaScript into code variable.
    var code = `
db.transaction(function (transaction) {
    var sql = "INSERT INTO ${table_name}${vars} VALUES (${interrogations.slice(0,-1)});";
    transaction.executeSql(sql, [${variaveis}], function () {
        //console.log('Dados inseridos com Successo!');
    }, function (transaction, err) {
    })
})\n`;
    return code;
};

Blockly.JavaScript['insert_start'] = function (block) {
    var value_insert_var = Blockly.JavaScript.valueToCode(block, 'insert_var', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = value_insert_var
    return code;
};

Blockly.JavaScript['insert_var'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var insert_var = Blockly.JavaScript.valueToCode(block, 'insert_var', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    
    if (isNumber(var_input))
        variaveis[count] = var_input; 
    else
        variaveis[count] = `"${var_input}"`; 

    insert_var = insert_var.replace('(', ', ')
    insert_var = insert_var.slice(0, -2)
    
    var code = `\n  let var${count} = `;
    code += var_input + insert_var;

    count++;

    // TODO: Change ORDER_NONE to the correct strength.

    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['insert_var_default'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var insert_var = Blockly.JavaScript.valueToCode(block, 'insert_var', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.

    insert_var = insert_var.replace('(', ', ')
    insert_var = insert_var.slice(0, -2)

    if (var_input == 'NULL')
        variaveis[count] = var_input;
    else {
        var timestamp = new Date();
        var data = timestamp.toJSON().slice(0, 10);
        var hora = timestamp.getHours();
        var min = timestamp.getMinutes();
        var seg = timestamp.getSeconds();

        variaveis[count] = `"${data} ${hora}:${min}:${seg}"`;
    }
        
    count++;

    var code = var_input + insert_var;

    return [code, Blockly.JavaScript.ORDER_NONE];
};

/********************************************************************************************************************************************************************/

Blockly.JavaScript['select'] = function(block) {
    var option = block.getFieldValue('option');
    var select_var = Blockly.JavaScript.valueToCode(block, 'vars', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    var table_name = Blockly.JavaScript.valueToCode(block, 'from', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    var join_type = block.getFieldValue('join_type');
    var join = Blockly.JavaScript.valueToCode(block, 'join', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    var where = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    var orderby = Blockly.JavaScript.valueToCode(block, 'orderby', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -3);
    
    if (select_var.includes('*'))
        select_var = '*'

    var code = ` SELECT${option} ${select_var} FROM ${table_name}`;

    if (join != '')
        code += ` ${join_type} ${join.replace(/= /g, `= ${table_name}.`)}`;

    if (where != '')
        code += ` WHERE ${where}`;

    if (orderby != '')
        code += ` ORDER BY ${orderby};`;
        
    // TODO: Assemble JavaScript into code variable.
    var code = `
db.transaction(function (transaction) {
    var sql = "${code}";
    transaction.executeSql(sql, [], function (tx, results) {
        if(results.rows.length > 0)
            printResults(results);
    }, function (transaction, err) {
    })
});\n

db.transaction(function (transaction) {
    var sql = "${code.split(' ORDER BY')[0]}";
    transaction.executeSql(sql, [], function (tx, results) {
        if(results.rows.length > 0)
            printResults2(results);
    }, function (transaction, err) {
    })
});\n`;
    return code;
};

function printResults(results){
    headers = Object.keys(results.rows.item(0));
    values = Object.values(results.rows);
    
    let table = document.getElementById('tabelaSelect');
    table.innerHTML = "";

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var cells = 0;
    headers.forEach(headerText => {
        let cell = row.insertCell(cells)

        headerText = headerText.charAt(0).toUpperCase() + headerText.slice(1);
        cell.innerHTML = headerText

        cells += 1;
    });

    values.forEach(val => {
        rowCount = table.rows.length;
        row = table.insertRow(rowCount);

        cells = 0;
        Object.values(val).forEach(text => {
            let cell = row.insertCell(cells);
            cell.innerHTML = text;
            cells += 1;
        })
    });
}

function printResults2(results){
    headers = Object.keys(results.rows.item(0));
    values = Object.values(results.rows);
    
    let table = document.getElementById('tabelaSelect2');
    table.innerHTML = "";

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var cells = 0;
    headers.forEach(headerText => {
        let cell = row.insertCell(cells)

        headerText = headerText.charAt(0).toUpperCase() + headerText.slice(1);
        cell.innerHTML = headerText

        cells += 1;
    });

    values.forEach(val => {
        rowCount = table.rows.length;
        row = table.insertRow(rowCount);

        cells = 0;
        Object.values(val).forEach(text => {
            let cell = row.insertCell(cells);
            cell.innerHTML = text;
            cells += 1;
        })
    });
}

Blockly.JavaScript['select_add'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = '';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_var'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var vars = Blockly.JavaScript.valueToCode(block, 'vars', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    vars = vars.replace('(', ', ')
    vars = vars.slice(0, -1)

    var code = var_input + vars;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_from'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var from = Blockly.JavaScript.valueToCode(block, 'from', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    from = from.replace('(', ', ')
    from = from.slice(0, -1)

    var code = table_name + from;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_join'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var table_var = block.getFieldValue('table_var');
    var table_join_var = block.getFieldValue('table_join_var');
    var join = Blockly.JavaScript.valueToCode(block, 'join', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble JavaScript into code variable.

    var code = `${table_name} ON ${table_name}.${table_var} = ${table_join_var}` + join;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_join_op'] = function (block) {
    var join_type = block.getFieldValue('join_type');
    var table_name = block.getFieldValue('table_name');
    var table_var = block.getFieldValue('table_var');
    var table_join_var = block.getFieldValue('table_join_var');
    var join = Blockly.JavaScript.valueToCode(block, 'join', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble JavaScript into code variable.

    if (join_type.includes('RIGHT') && !join_type.includes('FULL'))
        var code = join;
    else
        var code = ` ${join_type} ${table_name} ON ${table_name}.${table_var} = ${table_join_var}` + join;
    
        // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_where'] = function (block) {
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var value = block.getFieldValue('value');
    var conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);

    if (op == "LIKE")
        value = '%' + value + '%';

    if (value.includes('NULL') || value.includes('null'))
        var code = `${variavel} ${op} NULL ${conditions}`;
    else if (isNumber(value) && value != '')
        var code = `${variavel} ${op} ${value} ${conditions}`;
    else
        var code = `${variavel} ${op} '${value}' ${conditions}`;

    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_where_op'] = function (block) {
    var action = block.getFieldValue('action');
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var value = block.getFieldValue('value');
    var conditions = Blockly.JavaScript.valueToCode(block, 'conditions', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);

    if (op == "LIKE")
        value = '%' + value + '%';

    if (value.includes('NULL') || value.includes('null'))
        var code = `${action} ${variavel} ${op} NULL ${conditions}`;
    else if (isNumber(value) && value != '')
        var code = `${action} ${variavel} ${op} ${value} ${conditions}`;
    else
        var code = `${action} ${variavel} ${op} "${value}" ${conditions}`;

    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['select_orderby'] = function (block) {
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var orderby = Blockly.JavaScript.valueToCode(block, 'orderby', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble JavaScript into code variable.
    var code = `${variavel}${op}, ${orderby}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

/********************************************************************************************************************************************************************/

Blockly.JavaScript['update_table'] = function(block) {
    var table_name = block.getFieldValue('table_name');
    var update_var = Blockly.JavaScript.statementToCode(block, 'update_var');
    var column_name = block.getFieldValue('column_name');
    var type = block.getFieldValue('type');
    var value = block.getFieldValue('value');
    
    var updates = update_var.split(" ");
    var names = "";
    var values = [];

    var count = 0;
    updates.forEach(update => {
        if (update != "") {
            if (count % 2 == 0)
                names += update + " = ?, ";
            else {
                if (Number(update) > -Infinity && Number(update) < Infinity)
                    values.push(update);
                else
                    values.push(`'${update}'`);
            }
            count += 1;
        }
    });
        
    if (type == 'LIKE')
    value = `%${value}%`;
    
    if (Number(value) > -Infinity && Number(value) < Infinity)
        value = value;
    else
        value = `'${value}'`;

        // TODO: Assemble JavaScript into code variable.
    var code = `\n
db.transaction(function (transaction) {
    var sql = "UPDATE ${table_name} SET ${names} id = id WHERE ${column_name} ${type} ?;";
    transaction.executeSql(sql, [${values},${value}], function () {
    }, function (transaction, err) {
    })
});`;
    return code;
};

Blockly.JavaScript['update_var'] = function(block) {
    var var_name = block.getFieldValue('var_name');
    var value = block.getFieldValue('value');
    // TODO: Assemble JavaScript into code variable.
    var code = `${var_name} ${value} `;

    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.JavaScript['alter_table'] = function(block) {
    var table_name = block.getFieldValue('table_name');
    var operation = block.getFieldValue('operation');
    var column_name = block.getFieldValue('column_name');
    var column_type = block.getFieldValue('type');

    // TODO: Assemble Lua into code variable.
    if (operation != 'ADD')
        var code = `ALTER TABLE ${table_name} ${operation} ${column_name};`
    else 
        var code = `ALTER TABLE ${table_name} ${operation} ${column_name} ${column_type};`
    
    var code = `\ndb.transaction(function (transaction) {
    var sql = "${code}";
    transaction.executeSql(sql, [], function () {
        //console.log("Coluna ${column_name} modificada na tabela ${table_name}");
    }, function (transaction, err) {
    })
});\n`;

    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.JavaScript['delete_from_table'] = function(block) {
    var table_name = block.getFieldValue('table_name');
    var var_name = block.getFieldValue('var_name');
    var type = block.getFieldValue('type');
    var value = block.getFieldValue('value');

    if (type == "LIKE")
        value = '%' + value + '%';

    if (isNumber(value) && value != '')
        value = `${value}`;
    else
        value = `"${value}"`;
        
    var sql = `DELETE FROM ${table_name} WHERE ${var_name} ${type} ?`;
    
    // TODO: Assemble JavaScript into code variable.
    var code = `
db.transaction(function (transaction) {
    var sql = '${sql}';
    transaction.executeSql(sql, [${value}], function () {
        //console.log('${value} excluído com Successo!');
    }, function (transaction, err) {
    })
});`;
    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.JavaScript['drop_table'] = function(block) {
    var table_name = block.getFieldValue('name_table');
    var option = block.getFieldValue('option');
    // TODO: Assemble JavaScript into code variable.
    var code = `
db.transaction(function (transaction) {
    var sql = "DROP TABLE${option} ${table_name};";
    transaction.executeSql(sql, [], function () {
        //console.log('Tabela ${table_name} excluída com Successo!');
    }, function (transaction, err) {
    })
});
    `;
    return code;
};

/******************************************************************************************************************************************************************** */
var time;
function printErr(err){
    window.clearTimeout(time); // Resetar o tempo do popup de aviso
    
    document.getElementById('alerta').style.display = 'none'
    
    // Pegar apenas a mensagem de erro e não todo o objeto
    err = err.message
    
    // Remover parenteses
    err = err.replace(/[\])}[{(]/g, '');

    // Mensagem de erro na compartibilidade de dados
    err = err.replace('could not execute statement 20 datatype mismatch', 
            'Não foi possível inserir dados, incompatibilidade de tipo');
    
    // Mensagem de erro de restrição
    err = err.replace('could not execute statement due to a constraint failure 19', 
            'Não foi possível executar a instrução devido a restrição');
    err = err.replace(' constraint failed', '');
    
    // Mensagens de comandos não suportados
    err = err.replace('could not prepare statement 1 RIGHT and FULL OUTER JOINs are not currently supported', 
            'Não foi possível preparar a instrução. Os comandos RIGHT JOIN e FULL JOIN não são atualmente suportados');
    
    // Mensagem de coluna duplicada
    err = err.replace('could not prepare statement 1 duplicate column name:', 
            'Não foi possível preparar a declaração. Duplicação da coluna:');
            
    // Mensagem de erro na quantiadae de valores inseridos em uma tabela
    err = err.replace('could not prepare statement 1 table', 'Não foi possível inserir os dados. A tabela');
    err = err.replace('has no column named', 'não possuí a coluna ');

    // Mensagem de erro na quantiadae de valores inseridos em uma tabela
    err = err.replace('could not prepare statement 1 table', 'Não foi possível inserir os dados. A tabela');
    err = err.replace('has', 'possuí');
    err = err.replace('columns but', 'colunas mas');
    err = err.replace('values were supplied', 'valores foram fornecidos');
     
    // Mensagem de tabela não encontrada
    err = err.replace('could not prepare statement 1 no such table:', 
            'Não foi possível preparar a declaração. Não existe a tabela:');
     
    // Mensagem de coluna não encontrada
    err = err.replace('could not prepare statement 1 no such column:', 
            'Não foi possível preparar a declaração. Não existe a coluna:');
            
    // Mensagem de erro de syntaxe
    err = err.replace('could not prepare statement 1 near ', 'Não foi possível preparar a declaração proxímo de ');
    err = err.replace(': syntax error', ', erro na sintaxe');

    // Mensagem de erro na quantiadae de valores inseridos em uma tabela
    err = err.replace('could not prepare statement 1', 'Não foi possível preparar a declaração. Foi dado');
    err = err.replace('values for', 'valor(es) para');
    err = err.replace('columns', 'coluna(s)');

    document.querySelector('.alerta-aviso').style.setProperty('right', '15px');
    document.getElementById('alertaMensagemAviso').innerHTML = err + '.';

    time = setTimeout(function(){
        document.querySelector('.alerta-aviso').style.setProperty('right', '-1000px');
    }, 6000);
}