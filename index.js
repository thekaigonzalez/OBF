const obf = require ("./obf")

const prompt = require ("prompt-sync")();

function compare(prop) {
    let val1 = prop.val1 || null;

    let val2 = prop.val2 || null;

    if (val1 == val2) {
        let data = prop.do || null;

        obf.runObf(data);
    }
}

obf.exportObf("compare", compare)

while (true) {
    let p = prompt(">>>");
    // console.log(p)
    obf.runObf(p);
}