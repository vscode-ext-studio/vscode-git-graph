const cp = require('child_process');
const { join } = require('path');

const packagedFile = `./${process.env.npm_package_name}-${process.env.npm_package_version}.vsix`;
const fullPath = join(process.cwd(), packagedFile)
const cmd = `code --install-extension ${fullPath} --force`;
console.log(`Executing: ${cmd}`);
cp.exec(cmd, (err, stdout, stderr) => {
	if (err) {
		console.log('ERROR:');
		console.log(err);
		process.exit(1);
	} else {
		console.log(stderr + stdout);
	}
});
