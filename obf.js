// const obf = require("obf");
const fs = require("fs")
function writeToConsole(props) {
    let msg = props.message || null

    console.log(msg)
}

function openFile(props) {
    let filename = props.name || null

    let mode = props.mode || null

    let content = props.content || null

    let remove = props.remove || null

    if (remove == "yes" || remove == "true") {
        fs.rmSync(filename);
    } 
    else if (remove == null) {
        if (mode == "w") {
            fs.writeFileSync(filename, content);
        }
    }
}

var funcs = {
    "writeToConsole": writeToConsole,
    "openFile": openFile
}

function OBF_CompileAST(code) {
    let place = "";
    let place2 = "";
    let state = 0;
    let cfunc = "";

    for (let i = 0 ; i < code.length ; ++i) {
        /// obf

        if (code[i] == '{') {
            state = 900;
            cfunc = place;
            place = "";
        } else if (code[i] == '"' || code[i] == "'" && state == 900) {
          state = 1288  
        } else if (code[i] == '"' || code[i] == "'" && state == 1288) {
          state = 900;  
        } else if (code[i] == '}' && state == 900) {
            break;  
        } else {
            place = place + code[i]; /* keep adding chars to buffer */
        }
    }

    let properties = {}

    let head = ""; /* name of property */
    let val = ""; /* value of property */

    let propstate = -1;
    for (let i = 0; i < place.length ; ++ i) {
        if (place[i] == ':' && propstate == -1) {
            head = place2;
            place2 = "";
            propstate = 1;
        } else if (place[i] == ',' || place[i] == ':' && propstate == 1) {
            val = place2;

            properties[head] = val;

            head = "";
            val = "";
            place2 = "";

            propstate = -1;
            continue;
        }
        else {
            place2 = place2 + place[i];
        }
    }

    if (place2.length > 0) {
        properties[head.trim()] = place2.trim()
        place2 = "";
    }
    Object.entries(properties).forEach(entry => {
        const [key, value] = entry;
        delete properties[key]
        properties[key.trim()] = value.trim()
    });

    // console.log(properties)
    return {
        func: {
            name: cfunc.trim(),
            properties: properties
        }
    };
}

function OBF_Run(code) {
    let ast = OBF_CompileAST(code);

    let name = ast.func.name

    let props = ast.func.properties

    if (funcs[name] != undefined) {
        funcs[name](props)
    } else {
        console.warn("OBF: there's no function in memory that registers as " + name + ".")
    }
}

module.exports.runObf = OBF_Run

module.exports.compileObf = OBF_CompileAST