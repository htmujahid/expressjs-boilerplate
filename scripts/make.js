import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('Usage: npm run make <type> <name>');
    process.exit(1);
}

const type = args[0];
const name = args[1];

const templatePath = path.join('scripts', 'templates', `${type}.template.txt`);

fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) throw err;

    const renderedTemplate = template.replace(/\{\{name\}\}/g, name);
    const fileName = `${name}.${type}.js`;

    const filePath =
        type === 'schema' ? path.join('src', `database/${type}s`, fileName) : path.join('src', `${type}s`, fileName);

    fs.writeFile(filePath, renderedTemplate, err => {
        if (err) throw err;
        console.log(`${name} ${type} created successfully.`);
    });
});
