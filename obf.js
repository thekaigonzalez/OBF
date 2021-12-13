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
    let tmp_props = {}

    place = ""
    for (let i = 0 ; i < code.length ; ++i) {
        /// obf

        if (code[i] == '{') {
            state = 900;
            cfunc = place;
            // console.log("pushing name " + cfunc)
            place = "";
        } else if (code[i] == '"' || code[i] == "'" && state == 900) {
          state = 1288  
        } else if (code[i] == '"' || code[i] == "'" && state == 1288) {
          state = 900;  
        } else if (code[i] == '}' && state == 900) {
            tmp_props[cfunc] = place;
            place = ""
            state = 0;
        } else {
            // console.log("adding " + place)
            place = place + code[i]; /* keep adding chars to buffer */
        }
    }
    // console.log(cfunc)
    // console.log(tmp_props)


    // console.log(tmp_props)
    let properties = {}

    Object.entries(tmp_props).forEach(entry => {
    const [key, value] = entry;
        
    let head = ""; /* name of property */
    let val = ""; /* value of property */
    // place = ""
    let propstate = -1;
    // console.log(value.trim())
    properties[key.trim()] = {}
    for (let i = 0; i < value.length ; ++ i) {
        
        if (value[i] == ':' && propstate == -1) {
            head = place2;
            place2 = "";
            propstate = 1;
        } else if (value[i] == ',' || value[i] == ':' && propstate == 1) {
            val = place2;

            properties[key.trim()][head.trim()] = val.trim();

            head = "";
            val = "";
            place2 = "";

            propstate = -1;
            continue;
        }
        else {
            place2 = place2 + value[i];
        }
    }

    if (place2.length > 0) {
        properties[key.trim()][head.trim()] = place2.trim()
        place2 = "";
    }


    });
    
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

            properties[head.trim()] = val.trim();

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

    // if (place2.length > 0) {
    //     properties[head.trim()] = place2.trim()
    //     place2 = "";
    // }
    Object.entries(properties).forEach(entry => {
        const [key, value] = entry;
        delete properties[key]
        properties[key.trim()] = (typeof value === 'string') ? value.trim() : value

        // console.log(value)
    });
    // console.log(properties)
    return properties;
}

function OBF_Run(code) {
    let ast = OBF_CompileAST(code);

    Object.entries(ast).forEach(entry => {
        console.log(entry)
        const [k,v] = entry
        console.log(v )
        console.log("name ^")
        // console.log("find func " + k + " with props " + v)
        // console.log
        if (funcs[k.trim()] != undefined) {
            funcs[k.trim()](v)
        } else {
            console.warn("OBF: there's no function in memory that registers as " + k + ".")
        }
    })

    // if (funcs[name] != undefined) {
    //     funcs[name](props)
    // } else {
    //     console.warn("OBF: there's no function in memory that registers as " + name + ".")
    // }
}

function OBF_pushfunc(n, f) {
    funcs[n] = f
}

module.exports.runObf = OBF_Run

module.exports.compileObf = OBF_CompileAST

module.exports.exportObf = OBF_pushfunc