const xml = require("xml-parse");

let text = "<div>The 8</div><superscript>th</superscript><div> Generation </div><bold><color r=\"0\" g=\"0\" b=\"255\"><div>Intel</div></color></bold><div> Processor</div>"

var parsedXML = xml.parse(text)

console.log(JSON.stringify(parsedXML, null, 2));

