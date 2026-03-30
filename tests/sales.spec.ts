import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { credentials } from './helpers/data';

const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+nm4kAAAAASUVORK5CYII=',
  'base64'
);

const getStoreProductQuantity = async (page: any, storeId: string, productId: string) => {
  const response = await page.request.get(`http://localhost:4100/api/v1/stores/${storeId}/products`);
  const body = await response.json();
  const products = body.data?.products || [];
  const product = products.find((p: { id: string }) => p.id === productId);
  const storeProduct = product?.stores?.find((s: { storeId: string }) => s.storeId === storeId);
  return storeProduct?.quantity ?? 0;
};

test('sales page supports create, view, and refund', async ({ page }) => {
  const uniqueSuffix = String(Date.now()).slice(-6);
  let specialProductId: string | undefined;
  let mixtureId: string | undefined;

  try {
    await login(page, credentials.admin.phone, credentials.admin.password);

    const usersResponse = await page.request.get(
      `http://localhost:4100/api/v1/users?search=${encodeURIComponent(credentials.keeper.phone)}`
    );
    const usersBody = await usersResponse.json();
    const keeperUser = usersBody.data?.users?.find((u: { phone: string }) => u.phone === credentials.keeper.phone);
    const keeperStoreId = keeperUser?.storeId;
    expect(keeperStoreId).toBeTruthy();

    const storesResponse = await page.request.get('http://localhost:4100/api/v1/stores/all');
    const storesBody = await storesResponse.json();
    const mainStoreId = storesBody.data?.find((store: { name: string }) => store.name === 'main')?.id;
    expect(mainStoreId).toBeTruthy();

    const productsResponse = await page.request.get(
      `http://localhost:4100/api/v1/products?search=${encodeURIComponent('UnoProducto')}`
    );
    const productsBody = await productsResponse.json();
    const unoProduct = productsBody.data?.products?.find((p: { name: string }) => p.name.includes('UnoProducto'));
    const unoProductId = unoProduct?.id;
    expect(unoProductId).toBeTruthy();

    const specialProductName = `E2E Special ${uniqueSuffix}`;
    const specialCreateResponse = await page.request.post('http://localhost:4100/api/v1/products', {
      multipart: {
        name: specialProductName,
        type: 'SPECIAL',
        'variations[0][name]': 'Pack',
        'variations[0][number]': '1',
        'variations[0][costPrice]': '12',
        'variations[0][sellingPrice]': '25',
        image: {
          name: 'special.png',
          mimeType: 'image/png',
          buffer: pngBuffer,
        },
      },
    });
    expect(specialCreateResponse.status()).toBe(201);
    const specialBody = await specialCreateResponse.json();
    specialProductId = specialBody.data?.id;

    const specialVariationsResponse = await page.request.get(
      `http://localhost:4100/api/v1/products/${specialProductId}/variations`
    );
    const specialVariationsBody = await specialVariationsResponse.json();
    const specialVariationId = specialVariationsBody.data?.[0]?.id;
    expect(specialVariationId).toBeTruthy();

    await page.request.post('http://localhost:4100/api/v1/stores/addProduct', {
      data: {
        from: 'main',
        to: mainStoreId,
        productId: specialProductId,
        quantity: 5,
      },
    });

    await page.request.post('http://localhost:4100/api/v1/stores/addProduct', {
      data: {
        from: mainStoreId,
        to: keeperStoreId,
        productId: specialProductId,
        quantity: 5,
      },
    });

    const mixtureName = `E2E Mixture ${uniqueSuffix}`;
    const mixtureCreateResponse = await page.request.post('http://localhost:4100/api/v1/mixtures', {
      multipart: {
        name: mixtureName,
        costPrice: '10',
        sellingPrice: '20',
        description: 'E2E mixture',
        'items[0][productId]': unoProductId,
        'items[0][number]': '1',
        image: {
          name: 'mixture.png',
          mimeType: 'image/png',
          buffer: pngBuffer,
        },
      },
    });
    expect(mixtureCreateResponse.status()).toBe(201);
    const mixtureBody = await mixtureCreateResponse.json();
    mixtureId = mixtureBody.data?.id;

    await page.context().clearCookies();
    await login(page, credentials.keeper.phone, credentials.keeper.password);

    const createSale = async (clientName: string, phone: string, items: string[]) => {
      await page.goto('/dashboard/sales/create');
      await expect(page.locator('.MuiTypography-header', { hasText: /Make a sell/i })).toBeVisible();

      const productPicker = page.getByPlaceholder('Choose products to purchase...');
      for (const item of items) {
        await productPicker.fill(item);
        await page
          .getByRole('option', { name: new RegExp(item, 'i') })
          .first()
          .click({ timeout: 5000 });
        await expect(
          page
            .getByRole('row')
            .filter({ hasText: new RegExp(item, 'i') })
            .first()
        ).toBeVisible({
          timeout: 5000,
        });
      }
      await expect(page.getByText(/Total Amount:/i)).toBeVisible({ timeout: 10000 });

      await page.getByPlaceholder('Choose or enter a value').fill(clientName);
      await page.getByPlaceholder('Enter phone number ...').fill(phone);

      const createResponsePromise = page.waitForResponse(
        (resp) => resp.url().includes('/api/v1/sales') && resp.request().method() === 'POST',
        { timeout: 15000 }
      );
      await expect(page.getByRole('button', { name: /Confirm Payment/i })).toBeEnabled();
      await page.getByRole('button', { name: /Confirm Payment/i }).click();
      const createResponse = await createResponsePromise;
      await expect(page).toHaveURL(/\/dashboard\/sales/);
      expect(createResponse.ok()).toBeTruthy();

      let saleId: string | undefined;
      try {
        const createBody = await createResponse.json();
        saleId =
          createBody?.data?.id || createBody?.data?.sale?.id || createBody?.data?.saleId || createBody?.data?.data?.id;
      } catch {
        // ignore body parsing failures
      }

      if (!saleId) {
        for (let attempt = 0; attempt < 5; attempt++) {
          const listResponse = await page.request.get(
            `http://localhost:4100/api/v1/sales?clientPhone=${encodeURIComponent(phone)}`
          );
          const listBody = await listResponse.json();
          const sales = listBody.data?.sales || [];
          saleId = sales[0]?.id;
          if (saleId) break;
          await page.waitForTimeout(500);
        }
      }

      if (!saleId) {
        return { data: undefined };
      }

      const detailResponse = await page.request.get(`http://localhost:4100/api/v1/sales/${saleId}`);
      const detailBody = await detailResponse.json();
      return { data: detailBody?.data };
    };

    const standardSale = await createSale('E2E Client Standard', '+258840000777', ['UnoProducto']);
    expect(standardSale.data).toBeTruthy();
    expect(standardSale.data?.variations?.length).toBeGreaterThan(0);

    const mixtureSale = await createSale('E2E Client Mixture', '+258840000778', [mixtureName]);
    expect(mixtureSale.data).toBeTruthy();
    expect(mixtureSale.data?.mixtures?.length).toBeGreaterThan(0);

    const beforeMixedQuantity = await getStoreProductQuantity(page, keeperStoreId, unoProductId);

    const mixedSale = await createSale('E2E Client Mixed', '+258840000779', [
      'UnoProducto',
      specialProductName,
      mixtureName,
    ]);
    expect(mixedSale.data).toBeTruthy();
    expect(mixedSale.data?.variations?.length).toBeGreaterThan(0);
    expect(mixedSale.data?.mixtures?.length).toBeGreaterThan(0);

    const afterMixedQuantity = await getStoreProductQuantity(page, keeperStoreId, unoProductId);
    expect(afterMixedQuantity).toBe(beforeMixedQuantity - 2);

    const saleId = mixedSale.data?.id;
    expect(saleId).toBeTruthy();

    if (saleId) {
      await page.goto(`/dashboard/sales/${saleId}`);
      await expect(page).toHaveURL(new RegExp(`/dashboard/sales/${saleId}`));
    }

    await page.getByRole('button', { name: /Refund/i }).click();
    await page.getByPlaceholder('Enter sale name to delete').fill('I Understand');
    await page.getByRole('button', { name: /Yes, Refund/i }).click();
    await page.waitForResponse(
      (resp) => resp.url().includes(`/api/v1/sales/${saleId}`) && resp.request().method() === 'PATCH'
    );

    const afterRefundQuantity = await getStoreProductQuantity(page, keeperStoreId, unoProductId);
    expect(afterRefundQuantity).toBe(beforeMixedQuantity);
  } finally {
    await page.request.post('http://localhost:4100/api/v1/users/login', {
      data: { phone: credentials.admin.phone, password: credentials.admin.password },
    });

    if (mixtureId) {
      await page.request.delete(`http://localhost:4100/api/v1/mixtures/${mixtureId}`);
    }

    if (specialProductId) {
      await page.request.delete(`http://localhost:4100/api/v1/products/${specialProductId}`);
    }
  }
});

test('blocks sales in collected time ranges and allows refunds after collection', async ({ page }) => {
  await login(page, credentials.admin.phone, credentials.admin.password);

  const usersResponse = await page.request.get(
    `http://localhost:4100/api/v1/users?search=${encodeURIComponent(credentials.keeper.phone)}`
  );
  const usersBody = await usersResponse.json();
  const keeperUser = usersBody.data?.users?.find((u: { phone: string }) => u.phone === credentials.keeper.phone);
  const keeperStoreId = keeperUser?.storeId;
  expect(keeperStoreId).toBeTruthy();

  const productsResponse = await page.request.get(
    `http://localhost:4100/api/v1/products?search=${encodeURIComponent('UnoProducto')}`
  );
  const productsBody = await productsResponse.json();
  const unoProduct = productsBody.data?.products?.find((p: { name: string }) => p.name.includes('UnoProducto'));
  const unoProductId = unoProduct?.id;
  expect(unoProductId).toBeTruthy();

  const variationsResponse = await page.request.get(`http://localhost:4100/api/v1/products/${unoProductId}/variations`);
  const variationsBody = await variationsResponse.json();
  const unoVariationId = variationsBody.data?.[0]?.id;
  expect(unoVariationId).toBeTruthy();

  const loginApi = async (phone: string, password: string) => {
    await page.request.post('http://localhost:4100/api/v1/users/login', {
      data: { phone, password },
    });
  };

  await loginApi(credentials.keeper.phone, credentials.keeper.password);

  const cashT1 = new Date(Date.now() - 4 * 60 * 60 * 1000);
  const cashT2 = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const cashT3 = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const futureBase = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const mpesaT1 = new Date(futureBase + 60 * 60 * 1000);
  const mpesaT2 = new Date(futureBase + 2 * 60 * 60 * 1000);
  const mpesaT3 = new Date(futureBase + 3 * 60 * 60 * 1000);

  const createSaleApi = async (payload: any) => {
    const response = await page.request.post('http://localhost:4100/api/v1/sales', { data: payload });
    expect(response.status()).toBe(200);
    return response.json();
  };

  await createSaleApi({
    storeId: keeperStoreId,
    paymentMethod: 'CASH',
    clientName: 'E2E Cash Before',
    phone: '+258840000920',
    isMember: false,
    doneOn: cashT1.toISOString(),
    variations: {
      [unoVariationId]: 1,
    },
  });

  await createSaleApi({
    storeId: keeperStoreId,
    paymentMethod: 'CASH',
    clientName: 'E2E Cash After',
    phone: '+258840000921',
    isMember: false,
    doneOn: cashT3.toISOString(),
    variations: {
      [unoVariationId]: 1,
    },
  });

  const collectAround = async (date: Date) => {
    await loginApi(credentials.admin.phone, credentials.admin.password);
    const from = new Date(date.getTime() - 5 * 60 * 1000).toISOString();
    const to = new Date(date.getTime() + 5 * 60 * 1000).toISOString();
    const response = await page.request.post('http://localhost:4100/api/v1/stores/collectProfit', {
      data: { storeId: keeperStoreId, from, to },
    });
    expect(response.status()).toBe(200);
    await loginApi(credentials.keeper.phone, credentials.keeper.password);
  };

  await collectAround(cashT1);
  await collectAround(cashT3);

  await page.context().clearCookies();
  await login(page, credentials.keeper.phone, credentials.keeper.password);

  await page.goto('/dashboard/sales/create');
  await expect(page.locator('.MuiTypography-header', { hasText: /Make a sell/i })).toBeVisible();

  const productPicker = page.getByPlaceholder('Choose products to purchase...');
  await productPicker.fill('UnoProducto');
  await page
    .getByRole('option', { name: /UnoProducto/i })
    .first()
    .click({ timeout: 5000 });

  await page.getByPlaceholder('Choose or enter a value').fill('E2E Collected Client');
  await page.getByPlaceholder('Enter phone number ...').fill('+258840000920');

  const blockedDate = cashT2.toISOString().slice(0, 16);
  await page.getByLabel('Date of payment').fill(blockedDate);

  await page.getByRole('button', { name: /Confirm Payment/i }).click();
  await expect(page.getByText(/Cannot create a sale in a collected time range for this payment method/i)).toBeVisible();

  const allowedDate = new Date().toISOString().slice(0, 16);
  await page.getByLabel('Date of payment').fill(allowedDate);

  const createResponsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/v1/sales') && resp.request().method() === 'POST',
    { timeout: 15000 }
  );
  await page.getByRole('button', { name: /Confirm Payment/i }).click();
  const createResponse = await createResponsePromise;
  await expect(page).toHaveURL(/\/dashboard\/sales/);
  expect(createResponse.ok()).toBeTruthy();

  const createBody = await createResponse.json();
  const saleId = createBody?.data?.id;
  expect(saleId).toBeTruthy();

  await loginApi(credentials.keeper.phone, credentials.keeper.password);

  await createSaleApi({
    storeId: keeperStoreId,
    paymentMethod: 'M-PESA',
    clientName: 'E2E Mpesa Before',
    phone: '+258840000922',
    isMember: false,
    doneOn: mpesaT1.toISOString(),
    variations: {
      [unoVariationId]: 1,
    },
  });

  const refundSale = await createSaleApi({
    storeId: keeperStoreId,
    paymentMethod: 'M-PESA',
    clientName: 'E2E Refund Sale',
    phone: '+258840000923',
    isMember: false,
    doneOn: mpesaT2.toISOString(),
    variations: {
      [unoVariationId]: 1,
    },
  });

  await createSaleApi({
    storeId: keeperStoreId,
    paymentMethod: 'M-PESA',
    clientName: 'E2E Mpesa After',
    phone: '+258840000924',
    isMember: false,
    doneOn: mpesaT3.toISOString(),
    variations: {
      [unoVariationId]: 1,
    },
  });

  await collectAround(mpesaT1);
  await collectAround(mpesaT3);

  await page.context().clearCookies();
  await login(page, credentials.keeper.phone, credentials.keeper.password);

  const refundSaleId = refundSale?.data?.id;
  expect(refundSaleId).toBeTruthy();

  await page.goto(`/dashboard/sales/${refundSaleId}`);
  await page.getByRole('button', { name: /Refund/i }).click();
  await page.getByPlaceholder('Enter sale name to delete').fill('I Understand');
  const refundResponsePromise = page.waitForResponse(
    (resp) => resp.url().includes(`/api/v1/sales/${refundSaleId}`) && resp.request().method() === 'PATCH'
  );
  await page.getByRole('button', { name: /Yes, Refund/i }).click();
  const refundResponse = await refundResponsePromise;
  const refundStatus = refundResponse.status();
  const refundBody = await refundResponse.json();
  expect(refundStatus).toBe(200);
  expect(refundBody?.message?.sale?.refundedAt || refundBody?.data?.refundedAt).toBeTruthy();
});
