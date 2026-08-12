'use strict';

const { CloudBillingClient } = require('@google-cloud/billing');

const billing = new CloudBillingClient();

function decodeBudgetNotification(cloudEvent) {
  const message = cloudEvent?.data?.message ?? cloudEvent?.message ?? cloudEvent;
  const encodedData = message?.data;

  if (typeof encodedData !== 'string' || encodedData.length === 0) {
    throw new Error('Budget notification does not contain Pub/Sub data.');
  }

  const payload = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

  return {
    attributes: message?.attributes ?? {},
    payload,
  };
}

function isExpectedBudget(attributes) {
  const expectedBudgetId = process.env.BUDGET_ID;
  const expectedBillingAccountId = process.env.BILLING_ACCOUNT_ID;

  if (expectedBudgetId && attributes.budgetId !== expectedBudgetId) {
    console.log(
      JSON.stringify({
        action: 'ignored',
        reason: 'unexpected-budget-id',
        expectedBudgetId,
        receivedBudgetId: attributes.budgetId,
      }),
    );
    return false;
  }

  if (expectedBillingAccountId && attributes.billingAccountId !== expectedBillingAccountId) {
    console.log(
      JSON.stringify({
        action: 'ignored',
        reason: 'unexpected-billing-account-id',
        expectedBillingAccountId,
        receivedBillingAccountId: attributes.billingAccountId,
      }),
    );
    return false;
  }

  return true;
}

function readCost(payload, fieldName) {
  const value = Number(payload[fieldName]);

  if (!Number.isFinite(value)) {
    throw new Error(`Budget notification field "${fieldName}" is not a number.`);
  }

  return value;
}

async function disableBilling(projectName) {
  if (process.env.KILL_SWITCH_MODE !== 'live') {
    console.log(
      JSON.stringify({
        action: 'simulated',
        reason: 'kill-switch-mode-is-not-live',
        projectName,
      }),
    );
    return;
  }

  try {
    await billing.updateProjectBillingInfo({
      name: projectName,
      resource: { billingAccountName: '' },
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        action: 'billing-disable-failed',
        message: error?.message,
        code: error?.code,
      }),
    );
    throw error;
  }

  console.log(JSON.stringify({ action: 'billing-disabled', projectName }));
}

exports.stopBilling = async (cloudEvent) => {
  const targetProjectId = process.env.TARGET_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT;

  if (!targetProjectId) {
    throw new Error('TARGET_PROJECT_ID or GOOGLE_CLOUD_PROJECT must be set.');
  }

  const { attributes, payload } = decodeBudgetNotification(cloudEvent);

  if (!isExpectedBudget(attributes)) {
    return;
  }

  const costAmount = readCost(payload, 'costAmount');
  const budgetAmount = readCost(payload, 'budgetAmount');
  const projectName = `projects/${targetProjectId}`;

  console.log(
    JSON.stringify({
      action: 'budget-notification-received',
      budgetDisplayName: payload.budgetDisplayName,
      costAmount,
      budgetAmount,
      currencyCode: payload.currencyCode,
      projectName,
    }),
  );

  if (costAmount < budgetAmount) {
    console.log(JSON.stringify({ action: 'skipped', reason: 'budget-not-reached' }));
    return;
  }

  await disableBilling(projectName);
};
