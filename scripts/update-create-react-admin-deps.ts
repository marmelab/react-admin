import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies'];

const main = async () => {
    if (process.env.RELEASE_DRY_RUN) {
        console.log('Dry run mode is enabled');
    }

    const version = process.argv[2];
    if (!version || !version.match(/^\d{1,2}\.\d{1,2}\.\d{1,2}$/)) {
        console.error(`Invalid version provided: ${version}`);
        console.error(
            'Usage: yarn run update-create-react-admin-deps <version>'
        );
        process.exit(1);
    }

    const templates = fs.readdirSync(
        path.join(__dirname, '../packages/create-react-admin/templates')
    );
    const raPackages = fs.readdirSync(path.join(__dirname, '../packages'));

    for (const template of templates) {
        const packageJsonPath = path.join(
            __dirname,
            '../packages/create-react-admin/templates',
            template,
            'package.json'
        );
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, 'utf-8')
            );
            let updatedDependencies = [];
            for (const raPackage of raPackages) {
                for (const dependencyType of dependencyTypes) {
                    if (packageJson[dependencyType]?.[raPackage]) {
                        updatedDependencies.push([
                            raPackage,
                            packageJson[dependencyType][raPackage],
                            version,
                        ]);
                        packageJson[dependencyType][raPackage] = `^${version}`;
                    }
                }
            }

            if (updatedDependencies.length > 0) {
                if (process.env.RELEASE_DRY_RUN) {
                    console.group(
                        `\nUpdated template "${template}" dependencies:`
                    );
                    for (const [
                        packageName,
                        oldVersion,
                        newVersion,
                    ] of updatedDependencies) {
                        console.log(
                            `- ${packageName}: ${oldVersion} -> ${newVersion}`
                        );
                    }
                    console.groupEnd();
                } else {
                    fs.writeFileSync(
                        packageJsonPath,
                        `${JSON.stringify(packageJson, null, 4)}\n`,
                        {
                            encoding: 'utf-8',
                        }
                    );
                }
            }
        }
    }
};

main();
