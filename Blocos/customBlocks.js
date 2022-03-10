var commonStatements = ["create_table", "insert_table", "select_table", "select_table_where", "delete_table", "delete_from_table", "alter_table", "update_table"];

var validator = function (newValue) {
    if (newValue == '*')
        return '*'

    newValue = newValue.toLowerCase();
    newValue = newValue.replace(/[^A-Za-z0-9_ ]/g, "");
    newValue = newValue.replace(/  +/g, " ");
    return newValue.replace(/\s/g, "_");
};

function newBlock(tipo) {
    let newblock = Blockly.mainWorkspace.newBlock(tipo);
    newblock.initSvg();
    newblock.render();

    if (newblock.outputConnection)
        return newblock.outputConnection;
    else
        return newblock.previousConnection;
}

/******************************************************************************************************************************************************************** */

Blockly.Blocks['start_sql'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Conectar ao banco")
            .appendField(new Blockly.FieldTextInput("database", validator), "db_name");
        this.setNextStatement(true, "create_table");
        this.setColour(120);
        this.setTooltip("Iniciando projeto SQL");
        this.setHelpUrl("https://www.w3schools.com/sql/default.asp");
    }
}

/******************************************************************************************************************************************************************** */

Blockly.Blocks['create_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("CREATE TABLE")
            .appendField(new Blockly.FieldDropdown([["", ""], ["IF NOT EXISTS", " IF NOT EXISTS"]]), "option")
            .appendField(new Blockly.FieldTextInput("pessoa", validator), "table_name");
        this.appendStatementInput("table_var")
            .setCheck("table_var");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Variáveis")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addVar))
            .appendField("Primary key")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addPK))
            .appendField("Foreign key")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addFk));
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
            .appendField(new Blockly.FieldTextInput("nome", validator), "var_name")
            .appendField("Tipo")
            .appendField(new Blockly.FieldDropdown([["VARCHAR", "VARCHAR(30)"], ["INTEGER", "INTEGER"], ["TINYINT", "TINYINT"], ["CHAR", "CHAR(1)"], ["FLOAT", "FLOAT"], ["DATE", "DATE"], ["TIMESTAMP", "TIMESTAMP"]]), "type")
            .appendField("Atributo")
            .appendField(new Blockly.FieldDropdown([["-", ""], ["UNIQUE", " UNIQUE"], ["NOT NULL", " NOT NULL"], ["AUTO_INCREMENT", " AUTO_INCREMENT"], ["NOT NULL AUTO_INCREMENT", " NOT NULL AUTO_INCREMENT"]]), "opcao")
            .appendField(new Blockly.FieldImage("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Feather-arrows-chevron-up.svg/120px-Feather-arrows-chevron-up.svg.png", 20, 20, "Adicionar Variavel", up))
            .appendField(new Blockly.FieldImage("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Feather-arrows-chevron-down.svg/1200px-Feather-arrows-chevron-down.svg.png", 20, 20, "Adicionar Variavel", down))
        this.setInputsInline(false);
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
            .appendField(new Blockly.FieldTextInput("nome", validator), "var_name");
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
            .appendField(new Blockly.FieldTextInput("id", validator), "var_name")
            .appendField("REFENCES")
            .appendField(new Blockly.FieldTextInput("tabela", validator), "table_name")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("id", validator), "var_name_reference")
            .appendField(")");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "table_var_pk");
        this.setNextStatement(true, "table_var_pk");
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

function addVar() {
    tipo = Blockly.selected.getFirstStatementConnection().check_;

    if (Blockly.selected.getChildren(true).length > 0 && Blockly.selected.getChildren(true)[0].type == tipo[0]) {
        var bloco = Blockly.selected.getChildren(true)[0];

        while (bloco.getNextBlock() != null && bloco.getNextBlock().type == tipo[0])
            bloco = bloco.getNextBlock();

        bloco = bloco.nextConnection
    }
    else
        var bloco = Blockly.selected.getInput(tipo[0]).connection;

    bloco.connect(newBlock(tipo[0]));
}

function addPK() {
    //Cria um bloco de variável caso não tenha antes de adicionar o bloco de chave primaria
    if (Blockly.selected.getChildren(true).length == 0 || Blockly.selected.getChildren(true)[0].type != 'table_var')
        Blockly.selected.getInput('table_var').connection.connect(newBlock('table_var'));

    var block = Blockly.selected.getChildren(true)[0].lastConnectionInStack();

    block.connect(newBlock('table_var_pk'));
}

function addFk() {
    //Cria um bloco de variável caso não tenha antes de adicionar o bloco de chave primaria
    if (Blockly.selected.getChildren(true).length == 0 || Blockly.selected.getChildren(true)[0].type != 'table_var')
        Blockly.selected.getInput('table_var').connection.connect(newBlock('table_var'));

    var bloco = Blockly.selected.getChildren(true)[0].lastConnectionInStack();

    while (bloco.sourceBlock_.type == 'table_var_pk') {
        bloco = bloco.sourceBlock_.getPreviousBlock().nextConnection
    }

    bloco.connect(newBlock('table_var_fk'));
}

function up() {
    if (Blockly.selected != Blockly.selected.getTopStackBlock()) {
        if (Blockly.selected.getTopStackBlock().getNextBlock() == Blockly.selected)
            var parent = Blockly.selected.getTopStackBlock().getPreviousBlock().getFirstStatementConnection();
        else
            var parent = Blockly.selected.getPreviousBlock().getPreviousBlock().nextConnection;

        Blockly.selected.unplug(true);
        parent.connect(Blockly.selected.previousConnection)
    }
}

function down() {
    bloco = Blockly.selected;
    if (bloco.getNextBlock() != null && (bloco.getNextBlock().nextConnection.check_[0] == bloco.type || bloco.getNextBlock().nextConnection.check_[1] == bloco.type)) {
        var child = bloco.getNextBlock().nextConnection
        bloco.unplug(true);

        child.connect(bloco.previousConnection)
    }
}

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
        this.appendDummyInput()
            .appendField("Novo Valor")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", InsertVar))
            .appendField("Valor Padrão")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", InsertVarDefault));
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
        this.setOutput(true, ["insert_var","insert_var_default"]);
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
        this.setOutput(true, ["insert_var","insert_var_default"]);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

function InsertVar() {
    var bloco = Blockly.selected.getChildren(true)[0];

    while (bloco.getChildren(true)[0])
        bloco = bloco.getChildren(true)[0];

    bloco = bloco.getInput('insert_var').connection;
    bloco.connect(newBlock('insert_var'));
}

function InsertVarDefault() {
    var bloco = Blockly.selected.getChildren(true)[0];

    while (bloco.getChildren(true)[0])
        bloco = bloco.getChildren(true)[0];

    bloco = bloco.getInput('insert_var').connection;
    bloco.connect(newBlock('insert_var_default'));
}

/******************************************************************************************************************************************************************** */

Blockly.Blocks['update_table'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("UPDATE")
            .appendField(new Blockly.FieldTextInput("tabela", validator), "table_name")
            .appendField("SET");
        this.appendStatementInput("update_var")
            .setCheck("update_var");
        this.appendDummyInput()
            .appendField("WHERE")
            .appendField(new Blockly.FieldTextInput("nome"), "column_name")
            .appendField(new Blockly.FieldDropdown([["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "<>"], ["LIKE", "LIKE"], ["IS", "IS"], ["IS NOT", "IS NOT"]]), "type")
            .appendField(new Blockly.FieldTextInput("Fulano"), "value");
        this.appendDummyInput()
            .appendField(" Adicionar variáveis")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 25, 25, "Adicionar Variavel", addVar));
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
            .appendField(new Blockly.FieldTextInput("nome", validator), "var_name");
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
            .appendField(new Blockly.FieldTextInput("tabela", validator), "table_name");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["ADD", "ADD"], ["RENAME TO", "RENAME TO"], ["DROP COLUMN", "DROP COLUMN"], ["MODIFY COLUMN", "MODIFY COLUMN"]]), "operation");
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("email", validator), "column_name")
            .appendField(new Blockly.FieldDropdown([["VARCHAR", "VARCHAR(30)"], ["INTEGER", "INTEGER"], ["TINYINT", "TINYINT"], ["CHAR", "CHAR(1)"], ["FLOAT", "FLOAT"]]), "type");
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
            .appendField(new Blockly.FieldDropdown([["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "<>"], ["LIKE", "LIKE"], ["IS", "IS"], ["IS NOT", "IS NOT"]]), "type");
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
            .appendField(new Blockly.FieldDropdown([["", ""], ["IF EXISTS", " IF EXISTS"]]), "option")
            .appendField(new Blockly.FieldTextInput("tabela", validator), "name_table");
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
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", " DISTINCT"]]), "option");
        this.appendValueInput("from")
            .setCheck('select_from')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("FROM");
        this.appendValueInput("join")
            .setCheck("select_join")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"], ["RIGHT JOIN", "RIGHT JOIN"], ["FULL JOIN", "FULL JOIN"]]), "join_type");
        this.appendValueInput("conditions")
            .setCheck("select_where")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("WHERE");
        this.appendValueInput("orderby")
            .setCheck('select_orderby')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ODER BY");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Adicionar")
            .appendField(new Blockly.FieldDropdown([["Coluna","Select"], ["Tabela","From"], ["Interação","Join"], ["Restrição","Where"], ["Ordenação","OrderBy"]]), "opcao")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addSelect));
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(205);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select2'] = {
    init: function () {
        this.appendValueInput("vars")
            .setCheck("select_var")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("SELECT")
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", " DISTINCT"]]), "option");
        this.appendValueInput("from")
            .setCheck('select_from')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("FROM");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Adicionar")
            .appendField(new Blockly.FieldDropdown([["Coluna","Select"], ["Tabela","From"]]), "opcao")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addSelect));
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(205);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select3'] = {
    init: function () {
        this.appendValueInput("vars")
            .setCheck("select_var")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("SELECT")
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", " DISTINCT"]]), "option");
        this.appendValueInput("from")
            .setCheck('select_from')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("FROM");
            this.appendValueInput("join")
            .setCheck("select_join")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"], ["RIGHT JOIN", "RIGHT JOIN"], ["FULL JOIN", "FULL JOIN"]]), "join_type");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Adicionar")
            .appendField(new Blockly.FieldDropdown([["Coluna","Select"], ["Tabela","From"], ["Interação","Join"]]), "opcao")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addSelect));
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(205);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['select4'] = {
    init: function () {
        this.appendValueInput("vars")
            .setCheck("select_var")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("SELECT")
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", " DISTINCT"]]), "option");
        this.appendValueInput("from")
            .setCheck('select_from')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("FROM");
        this.appendValueInput("conditions")
            .setCheck("select_where")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("WHERE");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Adicionar")
            .appendField(new Blockly.FieldDropdown([["Coluna","Select"], ["Tabela","From"], ["Restrição","Where"]]), "opcao")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addSelect));
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
            .appendField(new Blockly.FieldLabelSerializable(""), "tabela1")
            .appendField(".")
            .appendField(new Blockly.FieldTextInput("id"), "table_var")
            .appendField("=")
            .appendField(new Blockly.FieldLabelSerializable(""), "tabela2")
            .appendField(".")  
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
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"], ["RIGHT JOIN", "RIGHT JOIN"], ["FULL JOIN", "FULL JOIN"]]), "join_type")
            .appendField(new Blockly.FieldTextInput("tabela"), "table_name")
            .appendField("ON")
            .appendField(new Blockly.FieldTextInput("id"), "table_var")
            .appendField("=")
            .appendField(new Blockly.FieldTextInput("id"), "table_join_var")
            .setCheck("select_join_op");
        this.setOutput(true, "select_join_op");
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
        this.setOutput(true, "select_where_op");
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
            .setCheck("select_orderby");
        this.setOutput(true, "select_orderby");
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

function addSelect(){
    switch (Blockly.selected.getFieldValue('opcao')) {
        case 'Select':
            addVarSelect();
            break;
        case 'From':
            addFromSelect();
            break;
        case 'Join':
            addJoinSelect();
            break;
        case 'Where':
            addWhereSelect();
            break;
        case 'OrderBy':
            addOrderBySelect();
            break;
        default:
            break;
    }
}

function addVarSelect() {
    bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('vars') != null) {
        bloco = bloco.getInputTargetBlock('vars');

        while (bloco.getChildren(true)[0])
            bloco = bloco.getChildren(true)[0];
    }

    bloco.getInput('vars').connection.connect(newBlock('select_var'));
}

function addFromSelect() {
    bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('from') != null) {
        bloco = bloco.getInputTargetBlock('from');

        while (bloco.getChildren(true)[0])
            bloco = bloco.getChildren(true)[0];
    }

    bloco.getInput('from').connection.connect(newBlock('select_from'));
}

function addJoinSelect() {
    bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('join') != null) {
        bloco = bloco.getInputTargetBlock('join');

        while (bloco.getChildren(true)[0])
            bloco = bloco.getChildren(true)[0];

        bloco.getInput('join').connection.connect(newBlock('select_join_op'));
    }else
        bloco.getInput('join').connection.connect(newBlock('select_join'));

}

function addWhereSelect() {
    bloco = Blockly.selected;
    if (bloco.getInputTargetBlock('conditions') != null) {
        bloco = bloco.getInputTargetBlock('conditions');

        while (bloco.getChildren(true)[0])
            bloco = bloco.getChildren(true)[0];

        bloco.getInput('conditions').connection.connect(newBlock('select_where_op'));
    }else
        bloco.getInput('conditions').connection.connect(newBlock('select_where'));
}

function addOrderBySelect() {
    if (Blockly.selected.getInputTargetBlock('orderby') != null) {
        var bloco = Blockly.selected.getInputTargetBlock('orderby');

        while (bloco.getChildren(true)[0])
            bloco = bloco.getChildren(true)[0];
    } else
        var bloco = Blockly.selected;

    bloco.getInput('orderby').connection.connect(newBlock('select_orderby'));
}

/********************************************************************************************************************************************************************/