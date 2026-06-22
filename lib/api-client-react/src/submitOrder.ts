export type SubmitOrderPaymentStatus = "paid" | "pending";

export type SubmitOrderItem = {
  description: string;
  quantity: number;
  unitPriceInCents: number;
  productId?: string;
  variantId?: string;
  sku?: string;
};

export type SubmitOrderParcel = {
  submitted_length_cm: number;
  submitted_width_cm: number;
  submitted_height_cm: number;
  submitted_weight_kg: number;
};

export type SubmitOrderRequest = {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  platform?: string;
  platformOrderId?: string;
  items: SubmitOrderItem[];
  paymentStatus?: SubmitOrderPaymentStatus;
  shippingCost?: number;
  tax?: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  notes?: string;
  shipLogicQuoteId?: string;
  shipLogicServiceCode?: string;
  shipLogicServiceId?: number;
  shipLogicRate?: number;
  parcels?: SubmitOrderParcel[];
  lekkerGiftCardCode?: string;
  lekkerGiftCardAmountCents?: number;
};

export type SubmitOrderResponse = {
  orderId: string;
  orderNumber: string;
  duplicate: boolean;
  giftCardRedeemedCents?: number;
};

export class SubmitOrderApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "SubmitOrderApiError";
    this.status = status;
    this.data = data;
  }
}

export type SubmitOrderOptions = {
  endpoint?: string;
  fetchImpl?: typeof fetch;
};

const DEFAULT_ENDPOINT = "/api/connect/orders";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

async function runRequest(
  orderData: SubmitOrderRequest,
  options?: SubmitOrderOptions,
): Promise<SubmitOrderResponse> {
  const fetcher = options?.fetchImpl ?? fetch;
  const response = await fetcher(options?.endpoint ?? DEFAULT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    throw new SubmitOrderApiError(
      `submitOrder failed with status ${response.status}`,
      response.status,
      data,
    );
  }

  const result = data as SubmitOrderResponse;
  if (result.duplicate) {
    console.info("Duplicate order acknowledged and treated as success", {
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    });
  }

  return result;
}

export async function submitOrder(
  orderData: SubmitOrderRequest,
  options?: SubmitOrderOptions,
): Promise<SubmitOrderResponse> {
  try {
    return await runRequest(orderData, options);
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }

    await delay(2000);
    return runRequest(orderData, options);
  }
}