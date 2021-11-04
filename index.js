const obf = require ("./obf")

const prompt = require ("prompt-sync")();

while (true) {
    let p = prompt(">>>");
    // console.log(p)
    obf.runObf(p);
}