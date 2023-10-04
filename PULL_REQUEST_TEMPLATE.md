Take note that this PR should align with the standards outlined in this [document](https://docs.google.com/document/d/1LcEBUMAogHAtU2AS8At7cbQ07dysEsHqKPp95gYC2jU/edit#).

### What type of PR is this?

-   [ ] Feature addition
-   [ ] Feature removal
-   [ ] Feature change
-   [ ] Config update
-   [ ] Adding a Schema
-   [ ] Updating a schema
-   [ ] Define custom type

### What is the PR for?

(The "what" of the PR should be a clearly defined title in present tense i.e "Add Reactivation Logic")

### Why was this PR done?

(The "why" of the PR should be defined in a single line. i.e "To block reactivations older than 3 months")

### Root specification section link

[ Add the section link here for the Root Spec Doc]()

### Jira ticket link

[ Add the ticket link here]()

### Testing plan

**Types of tests required**

-   [ ] Unit test check (tests to be done prior to handing to reviewer)
-   [ ] API endpoint testing
-   [ ] Add custom test (where necessary)

**Acceptance criteria**
[A list of tests to perform to pass, split into testing types if required] eg:

-   Unit test for reactivation logic check logic
    -   Using date-hacking, call reactivation function with date under 3 months and nothing should be returned
    -   Using date-hacking, call date over 3 months and error should be returned
-   Using API endpoint test:
    -   Issue policy, cancel, and reactivate
    -   Change start date to over 3 months in the past, try to reactivate, should get error returned.
-   Issuing from dashboard:
    -   Issue policy from dashboard, cancel from dashboard dropdown, reactivate from dashboard dropdown

### Authors considerations checklist

-   [ ] Has the impact on claims blocks been considered?
-   [ ] Has the impact on reporting templates been considered?
-   [ ] Has the impact on communications templates (email/sms) been considered?
-   [ ] Has the impact on document templates been considered?
-   [ ] Has the impact on client system integrations been considered?

### Reviewer checklist

-   [ ] Do all changes correlate to the described CR?
-   [ ] Have unit tests been written for the new feature (where applicable)?
-   [ ] Are all unit tests passing?
-   [ ] Has the Root specification document been updated to reflect the PR?
-   [ ] Has the API documentation been updated (where applicable)?
-   [ ] Has a PL done the front-end testing?
