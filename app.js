let xml = require('xml-parse');

function tokenize(content){
    let token = [];
    let cur = "";
    for(let i=0; i<content.length; i++){
        if (content[i] == '<'){
            token.push(cur);
            cur = "";
        }
        cur += content[i];
        if (content[i] == '>') {
            token.push(cur);
            cur = "";
        }
    }
    token.push(cur);
    return token;
}

let TOKENS = {
    "<bold>": "start_bold",
    "</bold>": "end_bold",
    "<color>": "start_color",
    "</color>": "end_color",
    "<italic>": "start_italic",
    "</italic>": "end_italic",
    "<superscript>": "start_superscript",
    "</superscript>": "end_superscript",
    "<underline>": "start_underline",
    "</underline>": "end_underline",
};

let AST_TYPE = {
    "bold": true,
    "color": true,
    "italic": true,
    "superscript": true,
    "underline": true,
}

function construct_content(token, type, startIndex, endIndex){
    let element = {
        content: token,
        type: type,
        from: startIndex,
        to: endIndex,
    };
    return element;
}

function toXML(tokens){
    for(let i=0; i<tokens.length; i++){
        let colorReg = new RegExp(/.*color.*/, "g");
        if (tokens[i].length > 0 && (!TOKENS[tokens[i]] && !colorReg.test(tokens[i]) )){
            tokens[i] = "<div>" + tokens[i] + "</div>"
        }
    }
    return tokens.join("")
}

function updateASTWithTextPosition(ast, contentIndex){
    for(let element of ast){
        if (element.tagName == "div"){
            element['from'] = contentIndex;
            element['to'] = contentIndex + element.innerXML.length
            contentIndex += element.innerXML.length
        } else if (AST_TYPE[element.tagName]){
            contentIndex = updateASTWithTextPosition(element.childNodes, contentIndex)
        }
    }
    return contentIndex;
}

function main(){
    let content = "The 8<superscript>th</superscript> Generation <bold><color r=\"0\" g=\"0\" b=\"255\">Intel</color></bold> <italic>Processor</italic>";
    let tokens = tokenize(content);
    console.log(tokens)
    let xmlString = toXML(tokens);
    console.log(xmlString)
    let ast = xml.parse(xmlString);
    updateASTWithTextPosition(ast, 0)
    console.log(JSON.stringify(ast, null, 2));


}

main();
