# Root Product Module templates

This repository contains the latest example product templates for the [Root](https://rootplatform.com) platform.

To use one of these templates, create a new product module on the Root dashboard and select the template from the options list, or alternatively copy the template directory from within this repo and update the `.root-config.json` to your organisation's details.

## Development

How to iterate, test and evolve the templates (a guide for the internal Root team).

1. On the ZA multi tenant stack, there is a `Template Development Staging` org (`70294dd2-b9bc-4f77-844a-1d1ed7cfc3f4`).
2. All the templates in this repository is configured for that org.
3. Create your own API key for that org, and set it in `.root-auth` in the respective template.
3. Feel free to iteratively `rp push` to this org to test changes.
4. When you merge a Pull Request into `main` on Github, a Github Action would automatically override the host and org details for each template and `rp push` them to the correct orgs on all the stacks.

Adding another stack to the list:

1. Open <todo>

```yaml
destinations:
- host: api.rootplatform.com
  country: ZA
  organizationId: 0000-0000
  apiKey: secret
  currency: ZAR
- host: api.uk.rootplatform.com
  country: GB
  organizationId: 0000-0000
  apiKey: secret
  currency: GBP
```
