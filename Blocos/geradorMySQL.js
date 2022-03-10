Blockly.Lua['start_sql'] = function (block) {
    var db_name = block.getFieldValue('db_name');
    var code = `CREATE DATABASE IF NOT EXISTS ${db_name};\nUSE ${db_name};\n`;
    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.Lua['create_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var option = block.getFieldValue('option');
    var table_var = Blockly.Lua.statementToCode(block, 'table_var');

    // Organizar semântica PRIMARY KEY
    if (table_var.includes("PRIMARY KEY")) {
        let array = table_var.split("PRIMARY KEY")
        table_var = array[0] + 'PRIMARY KEY (';
        for (let i = 1; i < array.length; i++) {
            while (array[i].includes(' '))
                array[i] = array[i].replace(' ', '');

            table_var += array[i].replace('\n', '').replace('(', '').replace(')', '');
        }
    }

    var code = `\nCREATE TABLE${option} ${table_name} (${table_var}`;
    if(code.includes('PRIMARY KEY'))
        code = code.slice(0, -1) + `)\n);\n`;
    else
        code = code.slice(0, -1) + `\n);\n`;
    
    return code;
};

Blockly.Lua['table_var'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var type = block.getFieldValue('type');
    var opcao = block.getFieldValue('opcao');

    if (type != 'INTEGER' && opcao.includes('AUTO_INCREMENT'))
        var code = `\n    ${var_name} ${type},`;
    else
        var code = `\n    ${var_name} ${type}${opcao},`;

    return code;
};

Blockly.Lua['table_var_fk'] = function (block) {
    var var_name = bSlock.getFieldValue('var_name');
    var table_name = block.getFieldValue('table_name');
    var var_name_reference = block.getFieldValue('var_name_reference');
    var code = `\n    FOREIGN KEY (${var_name}) REFERENCES ${table_name}(${var_name_reference}),`;
    return code;
};

Blockly.Lua['table_var_pk'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var code = `\n    PRIMARY KEY (${var_name}),`;
    return code;
};

/******************************************************************************************************************************************************************** */

Blockly.Lua['insert_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var vars = block.getFieldValue('vars');
    var table_var = Blockly.Lua.statementToCode(block, 'insert_var');
    // TODO: Assemble Lua into code variable.

    if (vars != '')
        var code = `\nINSERT INTO ${table_name} (${vars})\nVALUES${table_var.replace(' ', '')};\n`;
    else
        var code = `\nINSERT INTO ${table_name}\nVALUES${table_var.replace(' ', '')};\n`;

    return code;
};

Blockly.Lua['insert_start'] = function (block) {
    var value_insert_var = Blockly.Lua.valueToCode(block, 'insert_var', Blockly.Lua.ORDER_ATOMIC);
    // TODO: Assemble Lua into code variable.
    var code = value_insert_var
    return code;
};

Blockly.Lua['insert_var'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var insert_var = Blockly.Lua.valueToCode(block, 'insert_var', Blockly.Lua.ORDER_ATOMIC);
    // TODO: Assemble Lua into code variable.

    insert_var = insert_var.replace('(', ', ')
    insert_var = insert_var.slice(0, -1)

    if (isNumber(var_input))
        var code = var_input + insert_var;
    else if (isDate(var_input))
        var code = `STR_TO_DATE( "${var_input}", '%d/%m/%Y')` + insert_var;
    else
        var code = `"${var_input}"` + insert_var;

    // TODO: Change ORDER_NONE to the correct strength.

    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['insert_var_default'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var insert_var = Blockly.Lua.valueToCode(block, 'insert_var', Blockly.Lua.ORDER_ATOMIC);
    // TODO: Assemble Lua into code variable.

    insert_var = insert_var.replace('(', ', ')
    insert_var = insert_var.slice(0, -1)

    var code = var_input + insert_var;

    return [code, Blockly.Lua.ORDER_NONE];
};

/********************************************************************************************************************************************************************/

Blockly.Lua['alter_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var operation = block.getFieldValue('operation');
    var column_name = block.getFieldValue('column_name');
    var column_type = block.getFieldValue('type');

    // TODO: Assemble Lua into code variable.
    if (operation == 'ADD' || operation == 'MODIFY COLUMN')
        var code = `\nALTER TABLE ${table_name} ${operation} ${column_name} ${column_type};\n`;
    else if (operation == 'DROP COLUMN')
        var code = `\nALTER TABLE ${table_name} ${operation} ${column_name};\n`;
    return code;
};

/********************************************************************************************************************************************************************/

Blockly.Lua['update_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var update_var = Blockly.Lua.statementToCode(block, 'update_var');
    var column_name = block.getFieldValue('column_name');
    var type = block.getFieldValue('type');
    var value = block.getFieldValue('value');

    // TODO: Assemble Lua into code variable.
    if (isNumber(value))
        value = Number(value);
    else if (type == "LIKE")
        value = `"%` + value + `%"`;
    else
        value = `"${value}"`

    var code = `\nUPDATE ${table_name} SET${update_var}`
    code = code.slice(0, -1) + ` WHERE ${column_name} ${type} ${value};\n`;
    return code;
};

Blockly.Lua['update_var'] = function (block) {
    var var_name = block.getFieldValue('var_name');
    var value = block.getFieldValue('value');
    // TODO: Assemble Lua into code variable.
    if (isNumber(value))
        value = Number(value);
    else
        value = `"${value}"`

    var code = `${var_name} = ${value},`;
    return code;
};

/********************************************************************************************************************************************************************/

Blockly.Lua['delete_from_table'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var var_name = block.getFieldValue('var_name');
    var type = block.getFieldValue('type');
    var value = block.getFieldValue('value');

    if (isNumber(value))
        value = Number(value);
    else
        value = `'${value}'`

    var code = `\nDELETE FROM ${table_name} WHERE ${var_name} ${type} ${value};\n`;
    return code;
};

/********************************************************************************************************************************************************************/

Blockly.Lua['drop_table'] = function (block) {
    var table_name = block.getFieldValue('name_table');
    var option = block.getFieldValue('option');
    var code = `\nDROP TABLE${option} ${table_name};\n`;
    return code;
};

function isNumber(var_input) {
    return Number(var_input) > -Infinity && Number(var_input) < Infinity;
}

function isDate(var_input) {
    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    return var_input.match(reg);
}

/********************************************************************************************************************************************************************/

Blockly.Lua['select'] = function (block) {
    var option = block.getFieldValue('option');
    var select_var = Blockly.Lua.valueToCode(block, 'vars', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var table_name = Blockly.Lua.valueToCode(block, 'from', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var join_type = block.getFieldValue('join_type');
    var join = Blockly.Lua.valueToCode(block, 'join', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var where = Blockly.Lua.valueToCode(block, 'conditions', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var orderby = Blockly.Lua.valueToCode(block, 'orderby', Blockly.Lua.ORDER_ATOMIC).slice(1, -3);

    if (select_var.includes('*'))
        select_var = '*'

    var code = `\nSELECT${option} ${select_var} \nFROM ${table_name}`;

    if (join != ''){
        join = join.replace(/INNER /g, `\nINNER `)
        join = join.replace(/LEFT /g, `\nLEFT `)
        join = join.replace(/RIGHT /g, `\nRIGHT `)
        join = join.replace(/FULL /g, `\nFULL `)
        code += `\n${join_type} ${join.replace(/= /g, `= ${table_name}.`)}`;
    }

    if (where != '')
        code += `\nWHERE ${where}`;

    if (orderby != '')
        code += `\nORDER BY ${orderby};`;

    return code;
};

Blockly.Lua['select2'] = function (block) {
    var option = block.getFieldValue('option');
    var select_var = Blockly.Lua.valueToCode(block, 'vars', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var table_name = Blockly.Lua.valueToCode(block, 'from', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);

    if (select_var.includes('*'))
        select_var = '*'

    var code = `\nSELECT${option} ${select_var} \nFROM ${table_name}`;

    return code;
};

Blockly.Lua['select3'] = function (block) {
    var option = block.getFieldValue('option');
    var select_var = Blockly.Lua.valueToCode(block, 'vars', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var table_name = Blockly.Lua.valueToCode(block, 'from', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var join_type = block.getFieldValue('join_type');
    var join = Blockly.Lua.valueToCode(block, 'join', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);

    if (select_var.includes('*'))
        select_var = '*'

    var code = `\nSELECT${option} ${select_var} \nFROM ${table_name}`;

    if (join != ''){
        join = join.replace(/INNER /g, `\nINNER `)
        join = join.replace(/LEFT /g, `\nLEFT `)
        join = join.replace(/RIGHT /g, `\nRIGHT `)
        join = join.replace(/FULL /g, `\nFULL `)
        code += `\n${join_type} ${join.replace(/= /g, `= ${table_name}.`)}`;
    }

    return code;
};

Blockly.Lua['select4'] = function (block) {
    var option = block.getFieldValue('option');
    var select_var = Blockly.Lua.valueToCode(block, 'vars', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var table_name = Blockly.Lua.valueToCode(block, 'from', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    var where = Blockly.Lua.valueToCode(block, 'conditions', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);

    if (select_var.includes('*'))
        select_var = '*'

    var code = `\nSELECT${option} ${select_var} \nFROM ${table_name}`;

    if (where != '')
        code += `\nWHERE ${where}`;


    return code;
};

Blockly.Lua['select_var'] = function (block) {
    var var_input = block.getFieldValue('var_input');
    var vars = Blockly.Lua.valueToCode(block, 'vars', Blockly.Lua.ORDER_ATOMIC);
    vars = vars.replace('(', ', ')
    vars = vars.slice(0, -1)

    var code = var_input + vars;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_from'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    // TODO: Assemble Lua into code variable.
    var code = table_name;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_join'] = function (block) {
    var table_name = block.getFieldValue('table_name');
    var table_var = block.getFieldValue('table_var');
    var table_join_var = block.getFieldValue('table_join_var');
    var join = Blockly.JavaScript.valueToCode(block, 'join', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble Lua into code variable.
    var code = `${table_name} ON ${table_name}.${table_var} = ${table_join_var}` + join;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_join_op'] = function (block) {
    var join_type = block.getFieldValue('join_type');
    var table_name = block.getFieldValue('table_name');
    var table_var = block.getFieldValue('table_var');
    var table_join_var = block.getFieldValue('table_join_var');
    var join = Blockly.JavaScript.valueToCode(block, 'join', Blockly.JavaScript.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble Lua into code variable.
    var code = `${join_type} ${table_name} ON ${table_name}.${table_var} = ${table_join_var}`  + join;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_where'] = function (block) {
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var value = block.getFieldValue('value');
    var conditions = Blockly.Lua.valueToCode(block, 'conditions', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);

    if (op == "LIKE")
        value = '%' + value + '%';

    if (value.includes('NULL') || value.includes('null'))
        var code = `${variavel} ${op} NULL ${conditions}`;
    else if (isNumber(value) && value != '')
        var code = `${variavel} ${op} ${value} ${conditions}`;
    else
        var code = `${variavel} ${op} "${value}" ${conditions}`;

    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_where_op'] = function (block) {
    var action = block.getFieldValue('action');
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var value = block.getFieldValue('value');
    var conditions = Blockly.Lua.valueToCode(block, 'conditions', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);

    if (op == "LIKE")
        value = '%' + value + '%';

    if (value.includes('NULL') || value.includes('null'))
        var code = `${action} ${variavel} ${op} NULL ${conditions}`;
    else if (isNumber(value) && value != '')
        var code = `${action} ${variavel} ${op} ${value} ${conditions}`;
    else
        var code = `${action} ${variavel} ${op} "${value}" ${conditions}`;

    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};

Blockly.Lua['select_orderby'] = function (block) {
    var variavel = block.getFieldValue('variavel');
    var op = block.getFieldValue('op');
    var orderby = Blockly.Lua.valueToCode(block, 'orderby', Blockly.Lua.ORDER_ATOMIC).slice(1, -1);
    // TODO: Assemble Lua into code variable.
    var code = `${variavel}${op}, ${orderby}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Lua.ORDER_NONE];
};