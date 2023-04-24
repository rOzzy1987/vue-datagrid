'use strict';

const fs = require('fs');
const { exec } = require("child_process");

var argv = process.argv.slice(2);
var argc = argv.length;


function runCmd(cmd, processFn){
    var prc = exec(cmd, (e, so, se) => {
        if (e) {
            console.error(e.message);
        }
        if (se) {
            console.error(se);
        }
        if (prc.exitCode != 0)
            return;
        
        processFn(so);

    });
}

function publish() {
    runCmd("npm publish --access public", (o) => {
        console.log("Package published");
    });
}

runCmd("git status -s", (changes) => {

    var p = changes.split(/\n/g);
    if (p.every(s => s.trim() == "")){
        console.log("No changes, starting publish");
        publish();
    }
    else {
        console.error("Changes present");
        if(argc > 0){
            if (argv[0] == "-inc")
            {
                var rawdata = fs.readFileSync('package.json');
                var packJson = JSON.parse(rawdata);

                var match = /([0-9]+).([0-9]+).([0-9]+)/g.exec(packJson.version);
                var maj = match[1];
                var min = match[2];
                var rev = Number(match[3]);

                packJson.version = `${maj}.${min}.${++rev}`;

                fs.writeFileSync('package.json', JSON.stringify(packJson, null, 2));

                console.log("package.json updated, new version: " + packJson.version);

                runCmd("git add package.json", () => {
                    runCmd(`git commit -m "version bump to ${packJson.version}"`, () => {
                        console.log("committed")
                        runCmd(`git push`, () => {
                            console.log("pushed")
                            publish();
                        });
                    });

                });
            }
        }
    }

});

