import { z } from "zod";

export const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  phone: z.string().trim().min(1).max(40),
  addressLine1: z.string().trim().min(1).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100),
  state: z.string().trim().max(100),
  postalCode: z.string().trim().max(30),
  country: z.string().trim().max(100),
});

export const orderSnapshotSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    unitAmount: z.number().int().nonnegative(),
  })).min(1),
  delivery: z.object({
    title: z.string(),
    description: z.string(),
    priceCents: z.number().int().nonnegative(),
  }),
});

export type OrderSnapshot = z.infer<typeof orderSnapshotSchema>;

export function serializeOrderSnapshot(snapshot: OrderSnapshot) {
  const serialized = JSON.stringify(snapshot);
  const count = Math.ceil(serialized.length / 450);
  if (count > 40) return null;
  const metadata: Record<string, string> = { snapshotCount: String(count) };
  for (let index = 0; index < count; index++) {
    metadata[`snapshot_${index}`] = serialized.slice(index * 450, (index + 1) * 450);
  }
  return metadata;
}

export function readOrderSnapshot(metadata: Record<string, string>) {
  const count = Number(metadata.snapshotCount);
  if (!Number.isInteger(count) || count < 1 || count > 40) return null;
  try {
    const serialized = Array.from({ length: count }, (_, index) => metadata[`snapshot_${index}`] ?? "").join("");
    const result = orderSnapshotSchema.safeParse(JSON.parse(serialized));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}