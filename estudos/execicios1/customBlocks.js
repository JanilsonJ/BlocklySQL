var commonStatements = ["create_table", "insert_table", "select_table", "select_table_where", "delete_table", "delete_from_table", "alter_table", "update_table"];


/******************************************************************************************************************************************************************** */

Blockly.Blocks['start_sql'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Conectar ao banco")
            .appendField(new Blockly.FieldTextInput("database"), "db_name");
        this.setNextStatement(true, "create_table");
        this.setColour(120);
        this.setTooltip("Iniciando projeto SQL");
        this.setHelpUrl("https://www.w3schools.com/jquery/jquery_get_started.asp");
    }
}

/******************************************************************************************************************************************************************** */

Blockly.Blocks['create_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("CREATE TABLE")
            .appendField(new Blockly.FieldDropdown([["",""], ["IF NOT EXISTS"," IF NOT EXISTS"]]), "option")
            .appendField(new Blockly.FieldTextInput("pessoa"), "table_name");
        this.appendStatementInput("table_var")
            .setCheck("table_var");
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setColour(225);
        this.setTooltip("Cria uma nova tabela no banco");
        this.setHelpUrl("https://github.com/google/blockly/wiki/IfElse");
    }
};

Blockly.Blocks['table_var'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Variável")
            .appendField(new Blockly.FieldTextInput("nome"), "var_name");
        this.appendDummyInput()
            .appendField("Tipo")
            .appendField(new Blockly.FieldDropdown([["VARCHAR", "VARCHAR(30)"], ["INTEGER", "INTEGER"], ["TINYINT", "TINYINT"], ["CHAR", "CHAR(1)"], ["FLOAT", "FLOAT"], ["DATE", "DATE"], ["TIMESTAMP", "TIMESTAMP"]]), "type");
        this.appendDummyInput()
            .appendField("Atributo")
            .appendField(new Blockly.FieldDropdown([["-", ""], ["UNIQUE", " UNIQUE"], ["NOT NULL", " NOT NULL"], ["AUTO_INCREMENT", " AUTO_INCREMENT"], ["NOT NULL AUTO_INCREMENT", " NOT NULL AUTO_INCREMENT"]]), "opcao")
        this.setInputsInline(true);
        this.setPreviousStatement(true, "table_var");
        this.setNextStatement(true, ["table_var", "table_var_pk"]);
        this.setColour(180);
        this.setTooltip("Adiciona um novo dado a tabelaz");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['table_var_pk'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("PRIMARY KEY")
            .appendField(new Blockly.FieldTextInput("nome"), "var_name");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "table_var_pk");
        this.setNextStatement(true, "table_var_pk");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['table_var_fk'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("FOREIGN KEY")
            .appendField(new Blockly.FieldTextInput("id"), "var_name")
            .appendField("REFENCES")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("id"), "var_name_reference")
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "table_var_pk");
        this.setNextStatement(true, "table_var_pk");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['insert_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("INSERT INTO")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput(""), "vars")
            .appendField(")");
        this.appendStatementInput("insert_var")
            .appendField("VALUES")
            .setCheck('insert_start');
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setInputsInline(false);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['insert_start'] = {
    init: function () {
        this.appendValueInput("insert_var")
            .setCheck(['insert_var', 'insert_var_default']);
        this.setPreviousStatement(['insert_table'], null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setDeletable(false);
        this.setMovable(false);
        this.setEditable(false);
    }
};

Blockly.Blocks['insert_var'] = {
    init: function () {
        this.appendValueInput("insert_var")
            .setCheck(['insert_var', 'insert_var_default'])
            .appendField(new Blockly.FieldTextInput("id"), "var_input");
        this.setOutput(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['insert_var_default'] = {
    init: function () {
        this.appendValueInput("insert_var")
            .setCheck(['insert_var', 'insert_var_default'])
            .appendField(new Blockly.FieldDropdown([["NULL", "NULL"], ["CURRENT_TIMESTAMP", "CURRENT_TIMESTAMP"]]), "var_input")
        this.setOutput(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['update_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("UPDATE")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("SET");
        this.appendStatementInput("update_var")
            .setCheck("update_var");
        this.appendDummyInput()
            .appendField("WHERE")
            .appendField(new Blockly.FieldTextInput("nome"), "column_name")
            .appendField(new Blockly.FieldDropdown([["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "<>"], ["LIKE", "LIKE"]]), "type")
            .appendField(new Blockly.FieldTextInput("Fulano"), "value");
        this.appendDummyInput()
            .appendField(" Adicionar variáveis")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 35, 35, "Adicionar Variavel", addVar));
        this.setInputsInline(true);
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setColour(30);
        this.setTooltip("function () { [native code] }");
        this.setHelpUrl("https://github.com/google/blockly/wiki/IfElse");
    }
};

Blockly.Blocks['update_var'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Variável")
            .appendField(new Blockly.FieldTextInput("nome"), "var_name");
        this.appendDummyInput()
            .appendField("Novo valor")
            .appendField(new Blockly.FieldTextInput("Ciclano "), "value");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "update_var");
        this.setNextStatement(true, "update_var");
        this.setColour(60);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['alter_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("ALTER TABLE")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["ADD", "ADD"], ["DROP COLUMN", "DROP COLUMN"]]), "operation");
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("email"), "column_name")
            .appendField(new Blockly.FieldDropdown([["--", "--"],["VARCHAR", "VARCHAR(30)"], ["INTEGER", "INTEGER"], ["TINYINT", "TINYINT"], ["CHAR", "CHAR(1)"], ["FLOAT", "FLOAT"]]), "type");
        this.setInputsInline(true);
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setColour(30);
        this.setTooltip("function () { [native code] }");
        this.setHelpUrl("https://github.com/google/blockly/wiki/IfElse");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['delete_from_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("DELETE FROM")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("WHERE")
            .appendField(new Blockly.FieldTextInput("nome"), "var_name");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "<>"], ["LIKE", "LIKE"]]), "type");
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Fulano"), "value");
        this.setInputsInline(true);
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setColour(0);
        this.setTooltip("Deletar tabela");
        this.setHelpUrl("");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['drop_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("DROP TABLE")
            .appendField(new Blockly.FieldTextInput("tabela"), "name_table");
        this.setPreviousStatement(true, commonStatements);
        this.setNextStatement(true, commonStatements);
        this.setColour(345);
        this.setTooltip("Deletar tabela");
        this.setHelpUrl("");
    }
};

/******************************************************************************************************************************************************************** */

Blockly.Blocks['select'] = {
    init: function () {
        this.appendValueInput("vars")
            .setCheck("select_var")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("SELECT")
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", "DISTINCT"]]), "option");
        this.appendValueInput("from")
            .setCheck('select_from')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("FROM");
        this.appendValueInput("join")
            .setCheck("select_join")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"], ["RIGHT JOIN", "RIGHT JOIN"]]), "join_type");
        this.appendValueInput("conditions")
            .setCheck("select_where")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("WHERE");
        this.appendValueInput("orderby")
            .setCheck('select_orderby')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ODER BY");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(205);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_var'] = {
    init: function () {
        this.appendValueInput("vars")
            .setCheck("select_var")
            .appendField(new Blockly.FieldTextInput("*"), "var_input");
        this.setOutput(true, "select_var");
        this.setColour(185);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_from'] = {
    init: function () {
        this.appendValueInput("from")
            .setCheck("select_from")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name");
        this.setOutput(true, "select_from");
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_join'] = {
    init: function () {
        this.appendValueInput("join")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("ON")
            .appendField(new Blockly.FieldTextInput("id"), "table_var")
            .appendField("=")
            .appendField(new Blockly.FieldTextInput("id"), "table_join_var")
            .setCheck("select_join_op");
        this.setOutput(true, "select_join");
        this.setColour(235);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_join_op'] = {
    init: function () {
        this.appendValueInput("join")
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"], ["RIGHT JOIN", "RIGHT JOIN"]]), "join_type")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("ON")
            .appendField(new Blockly.FieldTextInput("id"), "table_var")
            .appendField("=")
            .appendField(new Blockly.FieldTextInput("id"), "table_join_var")
            .setCheck("select_join_op");
        this.setOutput(true, "select_join");
        this.setColour(235);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_where'] = {
    init: function () {
        this.appendValueInput("conditions")
            .appendField(new Blockly.FieldTextInput("id"), "variavel")
            .appendField(new Blockly.FieldDropdown([["<>", "<>"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["LIKE", "LIKE"], ["IS", "IS"], ["IS NOT", "IS NOT"], ["BETWEEN", "BETWEEN"], ["IN", "IN"]]), "op")
            .appendField(new Blockly.FieldTextInput(""), "value")
            .setCheck("select_where_op");
        this.setOutput(true, "select_where");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_where_op'] = {
    init: function () {
        this.appendValueInput("conditions")
            .appendField(new Blockly.FieldDropdown([["AND", "AND"], ["OR", "OR"]]), "action")
            .appendField(new Blockly.FieldTextInput("id"), "variavel")
            .appendField(new Blockly.FieldDropdown([["<>", "<>"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["LIKE", "LIKE"], ["IS", "IS"], ["IS NOT", "IS NOT"], ["BETWEEN", "BETWEEN"], ["IN", "IN"]]), "op")
            .appendField(new Blockly.FieldTextInput(""), "value")
            .setCheck("select_where_op");
        this.setOutput(true, "select_where");
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select_orderby'] = {
    init: function () {
        this.appendValueInput("orderby")
            .appendField(new Blockly.FieldTextInput("id"), "variavel")
            .appendField(new Blockly.FieldDropdown([["", ""], ["ASC", " ASC"], ["DESC", " DESC"]]), "op")
            .setCheck(null);
        this.setOutput(true, "select_orderby");
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/********************************************************************************************************************************************************************/