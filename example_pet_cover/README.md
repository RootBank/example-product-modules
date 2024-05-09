# Example Pet Cover - Root product module template

Hey there 👋

This is a template product to help you get started. You can change any of this product module's features and configurations to create, test and launch your own insurance solution. Some features are optional and can be removed, if required.

If you're not yet familiar with building insurance products on Root, we recommend that you start with the [Dinosure tutorial](https://docs.rootplatform.com/docs/workbench-setup).

Root has extensive guides on how to build and configure product modules. The following guides will be useful to help you get started:

- [Insurance on Root](https://docs.rootplatform.com/docs/overview)
- [Product modules overview](https://docs.rootplatform.com/docs/product-modules-overview)
- [Workbench](https://docs.rootplatform.com/docs/workbench)

As you begin testing your product module, you will also find it useful to refer to our [API reference](https://docs.rootplatform.com/reference/getting-started-1).

## Getting started with our Pet insurance template

This is a standard representation of a Pet insurance product, where a policyholder can insure a single pet (a dog or a cat). It covers expenses at the veterinarian arising from an accident or illness. The customer can choose between standard cover (£3,000 annual limit) or premium cover (£5,000 annual limit).

The following features are included:

- "Sensible" basic product setup and settings
- Quote hook with simple rating factors and an illustrative premium calculation using lookup tables
- Application hook for saving additional pet information to the policy
- Policy issue hook including a breakdown of the premium into costs and charges
- Quote and application schemas allowing policies to be issued on the Root management dashboard
- A policy schedule template with illustrative layout and branding
- An "amendment" alteration hook for making simple updates to existing policies (with its own dashboard schema)
- A claims workflow for capturing illustrative claim information, and allowing claims agents to generate payout requests
- Unit tests for the hooks defined in the product module code

Reading through the rest of the file layout you'll see how to:

- [Issue a policy](https://docs.rootplatform.com/docs/policy-issuing) on Root suing the correct flow.
- See how to use rating tables in different formats on Root to price products based on their value.
- Post a property on the [Claim Blocks](https://docs.rootplatform.com/docs/claims-workflow) from the module object.
- Update a property on the policy object that influences the premium pricing, using [alteration hooks](https://docs.rootplatform.com/docs/alteration-hooks).
- Limit the [reactivation](https://docs.rootplatform.com/docs/reactivation-hook) of the product using [lifecycle hooks](https://docs.rootplatform.com/docs/lifecycle-hooks).

## Folder structure

Let's look at a quick overview of all the folders in this product module.

### `./.root-config`

Here you can configure all the [General Settings](https://docs.rootplatform.com/docs/general-settings) and [Billing Settings](https://docs.rootplatform.com/docs/billing-settings) for the product module.

### `./.root-auth`

The Root API key that was used to clone the product module is kept here as an env variable. We use this key to authorise your product when you [push](https://docs.rootplatform.com/docs/workbench-commands#rp-push) to Root.

### `./code/*`

All logic of the [product module](https://docs.rootplatform.com/docs/product-module-code) is developed here. We recommend [splitting files](https://docs.rootplatform.com/docs/coding-standards#file-structure) into logical modules, as done here.

### `./code/unit-tests`

Unit tests for the code can be developed here and [executed](https://docs.rootplatform.com/docs/workbench-commands#rp-test) with workbench. There is already a suite of tests to show how it can be used.

### `./code/00-helper-functions.js`

Contains all the logic relating to non-specific functions or functions used across multiple files.

### `./code/01-ratings.js`

Contains all rating tables and functions associated with calculations of pet premiums.

### `./code/02-quote-hook.js`

Contains all logic relating to [quote package generation](https://docs.rootplatform.com/docs/quote-hook), including validation logic. This level only included the data necessary to generate a quote and contains no additional information.

### `./code/03-application-hook.js`

Contains all logic relating to [application package generation](https://docs.rootplatform.com/docs/application-hook), including validation. At this level all additional information for the policy or additional infrmation is added here after a quote is accepted.

### `./code/04-policy-hook.js`

Contains all logic for issuing of the final [policy](https://docs.rootplatform.com/docs/policy-issue-hook). Policy start date in controlled at this level.

### `./code/05-alteration-hooks.js`

Contains all the logic for [policy alterations](https://docs.rootplatform.com/docs/alteration-hooks). This is where policy amendments and endorsements take place.

### `./docs`

Here you can [document](https://docs.rootplatform.com/docs/api-docs) your product's customisable API endpoints for any external integrations, for example if you are using an external system to capture quote and application data.

### `./documents`

Here you can configure templates for a range of [policy documents](https://docs.rootplatform.com/docs/policy-documents). These documents serve both as a form of communication with policyholders, and as a human readable record of important policy information. These are configured using HTML and CSS. The `terms` file must always be in PDF format. [Handlebars](https://docs.rootplatform.com/docs/handlebars) can be used to pull in policy information dynamically.

### `./sandbox`

[Render](https://docs.rootplatform.com/docs/workbench-commands#rp-render) the policy documents in your local. A PDF will be compiled for each valid HTML document in `./documents`. The `merge-vars` is used to populate the documents with policy information.

### `./workflows`

[Schemas](https://docs.rootplatform.com/docs/schemas) for the quote and application schema can be developed here. You'll also be able to develop your [claims workflow](https://docs.rootplatform.com/docs/claims-blocks-overview) here, specifically [claims](https://docs.rootplatform.com/docs/claims-blocks-reference) and [disbursement](https://docs.rootplatform.com/docs/disbursement-blocks) blocks,

### `./workflows/alteration-hooks`

[Schemas](https://docs.rootplatform.com/docs/schemas) for your [alteration hooks](https://docs.rootplatform.com/docs/alteration-hooks) can be developed here.
