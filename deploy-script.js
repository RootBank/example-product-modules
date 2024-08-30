const fs = require("fs").promises;
const { existsSync } = require("fs");
const fse = require("fs-extra");
const { glob } = require("glob");
const path = require("path");
const { spawnSync } = require("child_process");
const yaml = require("js-yaml");

const deploymentsFile = "./.deployments.yaml";
const buildDirectory = "./build";
const exampleProductDirectoryPrefix = "example";

const prepareBuildDirectory = async () => {
  // If build directory exists, remove it
  if (existsSync(buildDirectory))
    await fs.rm(buildDirectory, { recursive: true });

  // Create list of products based on all directories in
  // the current directory that start with the example product directory prefix
  const allDirectories = await fs.readdir(".", { withFileTypes: true });
  const productDirectories = allDirectories
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name.startsWith(exampleProductDirectoryPrefix)
    )
    .map((dirent) => dirent.name);

  // Create product directories in build directory and copy over contents
  for (const productDirectory of productDirectories) {
    const targetPath = path.join(buildDirectory, productDirectory);
    await fs.mkdir(targetPath, { recursive: true });
    await fse.copy(productDirectory, targetPath, { recursive: true });
  }
};

const prepareProductForCurrency = async (productDirectory, host) => {
  const { currencyCode, currencySymbol, currencyMultiplier, country } = host;
  // We need to replace all occurences of:
  // - '£' with currencySymbol
  // - 'GBP' with currencyCode
  // - 'GB' with country

  // Helper function to convert currency amounts using the currency multiplier
  const convertCurrencyAmount = (
    rawCode,
    currencySymbol,
    currencyMultiplier
  ) => {
    return rawCode.replace(/£([\d,]+)/g, (match, p1) => {
      const amount = parseFloat(p1.replace(/,/g, ""));
      const newAmount = (amount * currencyMultiplier).toLocaleString();
      return `${currencySymbol}${newAmount}`;
    });
  };
  // Helper function to convert base cover amount using the currency multiplier
  const convertBaseAmount = (rawCode, currencySymbol, currencyMultiplier) => {
    return rawCode.replace(
      /(const\s+baseAmount\s*=\s*)(\d+)(\s*;\s*\/\/\s*£)/g,
      (match, p1, p2, p3) => {
        const amount = parseFloat(p2);
        const newAmount = amount * currencyMultiplier;
        return `${p1}${newAmount}${p3.replace("£", currencySymbol)}`;
      }
    );
  };

  // Loop through all code files in {productDirectory}/code
  const codeDirectory = path.join(productDirectory, "code");
  const codeFiles = await glob("**/*.js", { cwd: codeDirectory });
  for (const codeFile of codeFiles) {
    const codeFilePath = path.join(codeDirectory, codeFile);
    let rawCode = await fs.readFile(codeFilePath, "utf8");
    rawCode = convertBaseAmount(rawCode, currencySymbol, currencyMultiplier);
    rawCode = convertCurrencyAmount(
      rawCode,
      currencySymbol,
      currencyMultiplier
    );
    rawCode = rawCode.replace(/£/g, currencySymbol);
    rawCode = rawCode.replace(/GBP/g, currencyCode);
    rawCode = rawCode.replace(/GB/g, country);
    await fs.writeFile(codeFilePath, rawCode, "utf8");
  }

  // Loop through all html document files in {productDirectory}/documents
  const documentsDirectory = path.join(productDirectory, "documents");
  const documentsFiles = await glob("**/*.html", { cwd: documentsDirectory });
  for (const documentFile of documentsFiles) {
    const documentFilePath = path.join(documentsDirectory, documentFile);
    let rawHTML = await fs.readFile(documentFilePath, "utf8");
    rawHTML = convertCurrencyAmount(
      rawHTML,
      currencySymbol,
      currencyMultiplier
    );
    rawHTML = rawHTML.replace(/£/g, currencySymbol);
    rawHTML = rawHTML.replace(/GBP/g, currencyCode);
    rawHTML = rawHTML.replace(/GB/g, country);
    await fs.writeFile(documentFilePath, rawHTML, "utf8");
  }

  // Loop through all JSON files in {productDirectory}/workflows (including files in sub-directories)
  const workflowsDirectory = path.join(productDirectory, "workflows");
  const workflowFiles = await glob("**/*.json", { cwd: workflowsDirectory });
  for (const workflowFile of workflowFiles) {
    const workflowFilePath = path.join(workflowsDirectory, workflowFile);
    let rawWorkflow = await fs.readFile(workflowFilePath, "utf8");
    rawWorkflow = convertCurrencyAmount(
      rawWorkflow,
      currencySymbol,
      currencyMultiplier
    );
    rawWorkflow = rawWorkflow.replace(/£/g, currencySymbol);
    rawWorkflow = rawWorkflow.replace(/GBP/g, currencyCode);
    rawWorkflow = rawWorkflow.replace(/GB/g, country);
    await fs.writeFile(workflowFilePath, rawWorkflow, "utf8");
  }
};

const shellDeploy = async (productDirectory) =>
  spawnSync("rp", ["push", "-f"], {
    cwd: path.join(productDirectory),
    stdio: ["ignore", "ignore", "inherit"],
    shell: true,
  });

const shellPublish = async (productDirectory) =>
  spawnSync("rp", ["publish", "-f"], {
    cwd: path.join(productDirectory),
    stdio: ["ignore", "ignore", "inherit"],
    shell: true,
  });

const deployProduct = async (product, host) => {
  const buildProductDirectory = path.join(buildDirectory, product.directory);

  // Set the currency everywhere
  await prepareProductForCurrency(buildProductDirectory, host);

  // Update the .root-config.json file
  const rootConfigPath = path.join(buildProductDirectory, ".root-config.json");
  const rawConfig = await fs.readFile(rootConfigPath, "utf8");
  const config = JSON.parse(rawConfig);
  config.host = host.host;
  config.organizationId = host.organizationId;
  config.productModuleKey = product.destinationProductKey;
  config.settings.billing.currency = host.currencyCode;
  config.settings.policyholder.idCountry = host.country;
  if (host.country === "ZA") {
    config.settings.policyholder.individualsIdAllowed = true;
  }
  await fs.writeFile(rootConfigPath, JSON.stringify(config, null, 2), "utf8");

  // Update .root-auth file with the ROOT_API_KEY
  const rootAuthPath = path.join(buildProductDirectory, ".root-auth");
  await fs.writeFile(rootAuthPath, `ROOT_API_KEY=${host.apiKey}`, "utf8");

  // Run deployment command in the subdirectory
  const deployCommand = await shellDeploy(buildProductDirectory);
  if (deployCommand.error) {
    console.error(`❌ Error deploying ${product.directory}`);
    console.error(deployCommand.error.message);
  } else {
    console.log(`✅ Deployed ${product.directory}`);
  }
};

const publishProduct = async (product, host) => {
  const buildProductDirectory = path.join(buildDirectory, product.directory);
  // Run the publish command in the subdirectory
  const publishCommand = await shellPublish(buildProductDirectory);
  if (publishCommand.error) {
    console.error(`❌ Error publishing ${product.directory}`);
    console.error(publishCommand.error.message);
  } else {
    console.log(`✅ Published ${product.directory}`);
  }
};

async function main() {
  try {
    const deploymentsFileContent = await fs.readFile(deploymentsFile, "utf8");
    const deployments = yaml.load(deploymentsFileContent);
    let hosts = deployments.hosts;

    if (process.argv.includes("--factory")) hosts = [hosts[0]]; // Only deploy the factory
    console.time("Total time");

    for (const host of hosts) {
      console.time(`Completed ${host.host} - ${host.organizationName}`);
      console.log(
        `\x1b[1mProcessing ${host.host} - ${host.organizationName}\x1b[0m`
      );
      console.log(`----------------------------------------`);

      // Reset the build space
      await prepareBuildDirectory();
      console.log("✅ Build directory reset");

      const productPromises = host.products.map(async (product) => {
        // Deploy the product
        await deployProduct(product, host);
        // Publish the product
        await publishProduct(product, host);
      });

      // Wait until all products for the current host are done
      await Promise.all(productPromises);

      console.timeEnd(`Completed ${host.host} - ${host.organizationName}`);
      console.log('\n');
    }

    console.timeEnd("Total time");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();
