function aplicarCor(code) {
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
    code = code.replace(/TIMESTAMP/g, "<span class='color_var'>TIMESTAMP</span>");
    code = code.replace(/PRIMARY KEY/g, "<span class='color_var'>PRIMARY KEY</span>");
    code = code.replace(/UNIQUE/g, "<span class='color_var'>UNIQUE</span>");
    code = code.replace(/AUTO_INCREMENT/g, "<span class='color_var'>AUTO_INCREMENT</span>");

    code = code.replace(/ADD/g, "<span class='color_var'>ADD</span>");
    code = code.replace(/DROP COLUMN/g, "<span class='color_var'>DROP COLUMN</span>");

    code = code.replace(/SET/g, "<span class='color_var'>SET</span>");
    code = code.replace(/LIKE/g, "<span class='color_var'>LIKE</span>");
    code = code.replace(/WHERE/g, "<span class='color_var'>WHERE</span>");
    code = code.replace(/FROM/g, "<span class='color_var'>FROM</span>");
    code = code.replace(/VALUES/g, "<span class='color_var'>VALUES</span>");

    code = code.replace(/%/g, "<span style='color: rgb(197, 147, 97)'>%</span>");
    code = code.replace(/"/g, "<span style='color: rgb(197, 147, 97)'>" + '"' + "</span>");

    code = code.replace(/NOT/g, "<span style='color: rgb(192, 53, 53)'>NOT</span>");
    code = code.replace(/NULL|null|"null"/g, "<span style='color: rgb(203, 107, 26)'>NULL</span>");

    return code;
}