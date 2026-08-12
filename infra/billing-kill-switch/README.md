# Portfolio billing kill switch

Cloud Run Function triggered by Cloud Billing budget Pub/Sub notifications.

When the configured portfolio budget reaches its real monthly amount, the function disables billing on the target project by unlinking the billing account. This intentionally stops billable services in the project.

Safety guards:

- only reacts to the configured `BUDGET_ID`;
- only reacts to the configured `BILLING_ACCOUNT_ID`;
- cuts only when `costAmount >= budgetAmount`;
- supports `KILL_SWITCH_MODE=simulate` for dry runs and `KILL_SWITCH_MODE=live` for the real shutdown.
