// Copyright (C) 2021 Kai D. Gonzalez
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const obf = require("./obf")
const express = require("express")
const fs = require("fs")
// const express = require('express')
    
const app = express()
let name = ""
let port = 1111
obf.exportObf("init_server", function(properties) {
    let portt = properties.port || null
    let code = properties.code || null

    
    port = parseInt(portt);

    eval(code);
    const fs = require("fs");
    const { stringify } = require('querystring');    
})

obf.exportObf("")

obf.exportObf("listen", function(props) {
    
    app.listen(port, () => {
        console.log(`Document app listening at http://localhost:${port}`)
    })
})
console.log(obf.runObf(fs.readFileSync('server.obf').toString()));