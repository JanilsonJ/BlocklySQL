var commonStatements = ["create_table", "insert_table", "select_table", "select_table_where", "delete_table", "delete_from_table", "alter_table", "update_table"];

function newBlock(tipo) {
    let newblock = Blockly.mainWorkspace.newBlock(tipo);
    newblock.initSvg();
    newblock.render();

    if (newblock.outputConnection)
        return newblock.outputConnection;
    else
        return newblock.previousConnection;
}

Blockly.Blocks['select'] = {
    init: function () {
        this.appendValueInput("vars")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addVarSelect))
            .appendField("SELECT")
            .appendField(new Blockly.FieldDropdown([["", ""], ["DISTINCT", " DISTINCT"]]), "option")
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck("select_var");
        this.appendValueInput("from")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addFromSelect))
            .appendField("FROM")
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck('select_from');
        this.appendValueInput("join")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addJoinSelect))
            .appendField(new Blockly.FieldDropdown([["INNER JOIN", "INNER JOIN"], ["LEFT JOIN", "LEFT JOIN"]]), "join_type")
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck("select_join");
        this.appendValueInput("conditions")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addWhereSelect))
            .appendField("WHERE")
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck("select_where");
        this.appendValueInput("orderby")
            .appendField(new Blockly.FieldImage("https://secure.webtoolhub.com/static/resources/icons/set72/c7033168.png", 15, 15, "", addOrderBySelect))
            .setCheck('select_orderby')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ODER BY");
        this.setInputsInline(false);
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
};

/********************************************************************************************************************************************************************/