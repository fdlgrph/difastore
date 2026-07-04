const BASE_URL = "https://api.jsonbin.io/v3/b";
const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;

async function jsonbinRequest(binId, options = {}) {
  const res = await fetch(`${BASE_URL}/${binId}${options.latest ? "/latest" : ""}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`jsonbin error (${res.status}): ${text}`);
  }
  return res.json();
}

// ---- Generic read/write ----
export async function readBin(binId) {
  const data = await jsonbinRequest(binId, { latest: true });
  return data.record; // { products: [...] } or { orders: [...] }
}

export async function writeBin(binId, record) {
  const data = await jsonbinRequest(binId, {
    method: "PUT",
    body: record,
  });
  return data.record;
}

// ---- Products ----
export async function getProducts() {
  const record = await readBin(process.env.JSONBIN_PRODUCTS_BIN_ID);
  return record.products || [];
}

export async function saveProducts(products) {
  return writeBin(process.env.JSONBIN_PRODUCTS_BIN_ID, { products });
}

// ---- Orders ----
export async function getOrders() {
  const record = await readBin(process.env.JSONBIN_ORDERS_BIN_ID);
  return record.orders || [];
}

export async function saveOrders(orders) {
  return writeBin(process.env.JSONBIN_ORDERS_BIN_ID, { orders });
}

export async function addOrder(order) {
  const orders = await getOrders();
  orders.push(order);
  await saveOrders(orders);
  return order;
}

export async function updateOrder(orderId, updates) {
  const orders = await getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found");
  orders[idx] = { ...orders[idx], ...updates };
  await saveOrders(orders);
  return orders[idx];
}
