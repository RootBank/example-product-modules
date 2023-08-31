const fs = require('fs').promises;
const path = require('path');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');

const destinationsFile = './destinations.yaml';

async function main() {
  try {
    const destinationsContent = await fs.readFile(destinationsFile, 'utf8');
    const destinations = yaml.load(destinationsContent);
    const hosts = destinations.hosts;
    const templates = destinations.templates;

    for (const template of templates) {
      for (const host of hosts) {
        // Override all the relevant fields for the relevant host

        // Update .root-config.json
        const rootConfigPath = path.join(
          template.directory,
          '.root-config.json'
        );
        const rawConfig = await fs.readFile(rootConfigPath, 'utf8');
        const config = JSON.parse(rawConfig);
        config.host = host.host;
        config.organizationId = host.organizationId;
        config.productModuleKey = template.destinationProductKey;
        config.settings.billing.currency = host.currency;
        config.settings.policyholder.idCountry = host.country;
        await fs.writeFile(rootConfigPath, JSON.stringify(config), 'utf8');

        // Update .quote-schema.json
        const quoteSchemaPath = path.join(
          template.directory,
          'workflows',
          'quote-schema.json'
        );
        let rawQuoteSchema = await fs.readFile(quoteSchemaPath, 'utf8');
        rawQuoteSchema = rawQuoteSchema.replace(/\"prefix\"\: \"R\"/g, `"prefix": "${host.currencyPrefix}"`);
        await fs.writeFile(quoteSchemaPath, rawQuoteSchema, 'utf8');
        
        // Update .root-auth
        const rootAuthPath = path.join(
          template.directory,
          '.root-auth'
        );
        const githubSecretKey = 'HOST__' + host.host.replace(/\./g, '_').toUpperCase(); // E.g. HOST__API_ROOTPLATFORM_COM
        const githubSecret = process.env[githubSecretKey];
        await fs.writeFile(rootAuthPath, `ROOT_API_KEY=${githubSecret}`, 'utf8');

        // Run deployment command in the subdirectory
        const deployCommand = spawnSync('rp', ['push', '-f'], {
          cwd: path.join(template.directory),
          stdio: 'inherit',
          shell: true,
        });

        if (deployCommand.error) {
          console.error(
            `❌ Error deploying ${template.directory} to ${host.host}`
          );
          console.error(deployCommand.error.message);
        } else {
          console.log(`✅ Deployed ${template.directory} to ${host.host}`);
        }
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
