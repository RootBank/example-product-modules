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
  const { currencyCode, currencySymbol, country } = host;
  // We need to replace all occurences of:
  // - '£' with currencySymbol
  // - 'GBP' with currencyCode
  // - 'GB' with country

  // Loop through all code files in {productDirectory}/code
  const codeDirectory = path.join(productDirectory, "code");
  const codeFiles = await glob("**/*.js", { cwd: codeDirectory });
  for (const codeFile of codeFiles) {
    const codeFilePath = path.join(codeDirectory, codeFile);
    let rawCode = await fs.readFile(codeFilePath, "utf8");
    rawCode = rawCode.replace(/£/g, currencySymbol);
    rawCode = rawCode.replace(/GBP/g, currencyCode);
    rawCode = rawCode.replace(/GB/g, country);
    await fs.writeFile(codeFilePath, rawCode, "utf8");
  }

  // Loop through all JSON files in {productDirectory}/workflows (including files in sub-directories)
  const workflowsDirectory = path.join(productDirectory, "workflows");
  const workflowFiles = await glob("**/*.json", { cwd: workflowsDirectory });
  for (const workflowFile of workflowFiles) {
    const workflowFilePath = path.join(workflowsDirectory, workflowFile);
    let rawWorkflow = await fs.readFile(workflowFilePath, "utf8");
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
  await fs.writeFile(rootConfigPath, JSON.stringify(config, null, 2), "utf8");

  // Update .root-auth file with the ROOT_API_KEY
  const rootAuthPath = path.join(buildProductDirectory, ".root-auth");
  await fs.writeFile(rootAuthPath, `ROOT_API_KEY=${host.apiKey}`, "utf8");

  // Run deployment command in the subdirectory
  const deployCommand = await shellDeploy(buildProductDirectory);
  if (deployCommand.error) {
    console.error(`❌ Error deploying ${product.directory} to ${host.host}`);
    console.error(deployCommand.error.message);
  } else {
    console.log(`✅ Deployed ${product.directory} to ${host.host}`);
  }
};

const publishProduct = async (product, host) => {
  const buildProductDirectory = path.join(buildDirectory, product.directory);
  // Run the publish command in the subdirectory
  const publishCommand = await shellPublish(buildProductDirectory);
  if (publishCommand.error) {
    console.error(`❌ Error publishing ${product.directory} to ${host.host}`);
    console.error(publishCommand.error.message);
  } else {
    console.log(`✅ Published ${product.directory} to ${host.host}`);
  }
};

async function main() {
  try {
    const deploymentsFileContent = await fs.readFile(deploymentsFile, "utf8");
    const deployments = yaml.load(deploymentsFileContent);
    const hosts = deployments.hosts;

    for (const host of hosts) {
      for (const product of host.products) {
        // Reset the build space
        await prepareBuildDirectory();
        // Deploy the product
        await deployProduct(product, host);
        // Publish the product
        await publishProduct(product, host);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();
