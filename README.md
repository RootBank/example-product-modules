# Root Product Module templates

This repository contains the latest example product templates for the [Root](https://rootplatform.com) platform.

To use one of these templates, create a new product module on the Root dashboard and select the template from the options list, or alternatively copy the template directory from within this repo and update the `.root-config.json` to your organisation's details.

## Development

Here's how to iterate, test and evolve the templates (a guide for the internal Root team):

1. On the ZA multi tenant stack, there is a `Template Development Staging` org (`70294dd2-b9bc-4f77-844a-1d1ed7cfc3f4`).
2. All the templates in this repository are configured for that org.
3. Create your own API key for that org and set it in `.root-auth` in the respective template.
3. Iteratively `rp push` to this org to test changes (this is a safe space to test).
4. Submit a Pull Request with your changes to merge into `main`.
4. When you merge a Pull Request into `main` on Github, a Github Action would automatically override the host and org details for each template and `rp push` them to the correct orgs on all the stacks.

Adding another stack to the list:

1. Create the appropriate organisation on the new stack to house the template product modules.
1. Create a product module for each template in this directory. Their keys must match the keys defined in `./deployment.yaml`.
1. Open `./deployment.yaml` and add the stack & organisation to deploy to.
1. Open the Github org's secrets and add an API key for `host`


### Todo list

1. Update pet product to match spec
  - ~~quote schema: currency slider range limits~~
  - ~~application step~~
  - ~~policy issuing~~
  - pricing
  - reactivations
  - alteration hook
  - scheduled function
  - documents
1. Create github action that automatically deploys the templates to all the different stacks
  - Set up where the script can pull the config for each stack
  - Create a list containing all the stack's host orgs
    - host (stack)
    - org ID
    - API key
    - country
    - currency
  - Update the following fields in the root-config.json
    - host
    - organizationId
    - settings.policyholder.idCountry
    - settings.billing.currency
  - Update the following fields in the quote-schema.json
    - list.cover_amount.props.prefix
  - Set the `root-auth`` temporarily for the stack's API key in order to push to that stack
