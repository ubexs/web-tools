const cp = require('child_process');

const main = () => {
    let exit = 0;
    do {
        try {
            const res = cp.execSync(`blender`);
            console.log(res.toString());
            process.exit();
        } catch (err) {
            exit = err.status;
            let out = err.stderr.toString();
            let msg = out.match(/while loading shared libraries: (.+?):/);
            if (!msg) {
                console.log('exit 1. error message', out);
                process.exit();
            } else {
                let thingToInstall = msg[1];
                if (typeof thingToInstall !== 'string') {
                    console.log('exit 2. error message', out);
                    process.exit();
                }
                console.log('missing so', thingToInstall);
                let fileRes = cp.execSync(`apt-file search ${thingToInstall}`);
                let missing = fileRes.toString().match(/(.+?)\:/);
                if (!missing || typeof missing[0] !== 'string') {
                    console.log('exit 3. msg', missing);
                    process.exit();
                } else {
                    let p = missing[0];
                    try {
                        cp.execSync(`sudo apt-get install ${p.slice(0, p.length - 1)}`);
                    } catch (e) {
                        let msg = e.stderr.toSring();
                        console.log('installation of package', p, 'failed. error message', msg);
                        console.error(e);
                        process.exit(1);
                    }
                }
            }
        }
    } while (exit !== 0)
}
main();