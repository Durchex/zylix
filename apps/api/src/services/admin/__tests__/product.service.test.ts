import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(async (callback: (tx: unknown) => unknown) => callback(mockTx())),
  },
}));

function mockTx() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/lib/prisma").prisma;
}

import { adminProductService } from "@/services/admin/product.service";
import { ApiError } from "@/middleware/errorHandler";

const mockPrisma = prisma as unknown as {
  product: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  productImage: { deleteMany: jest.Mock };
  productVariant: { deleteMany: jest.Mock };
};

(mockPrisma as unknown as Record<string, unknown>).productImage = { deleteMany: jest.fn() };
(mockPrisma as unknown as Record<string, unknown>).productVariant = { deleteMany: jest.fn() };
(mockPrisma.product as unknown as Record<string, unknown>).update = jest.fn();

const baseInput = {
  sellerId: "seller_1",
  categoryId: "cat_1",
  name: "iPhone 16 Pro",
  slug: "iphone-16-pro",
  brand: "Apple",
  description: "Flagship phone",
  basePrice: 1250000,
  currency: "NGN",
  sku: "IPH16PRO",
  status: "DRAFT" as const,
  isFeatured: false,
  images: [],
  variants: [],
};

describe("adminProductService.create", () => {
  it("rejects a duplicate slug", async () => {
    mockPrisma.product.findUnique
      .mockResolvedValueOnce({ id: "existing" }) // slug check
      .mockResolvedValueOnce(null); // sku check

    await expect(adminProductService.create(baseInput)).rejects.toThrow(ApiError);
  });

  it("rejects a duplicate SKU", async () => {
    mockPrisma.product.findUnique
      .mockResolvedValueOnce(null) // slug check
      .mockResolvedValueOnce({ id: "existing" }); // sku check

    await expect(adminProductService.create(baseInput)).rejects.toThrow(ApiError);
  });

  it("creates the product with nested images and variants", async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    mockPrisma.product.create.mockResolvedValueOnce({ id: "prod_1", ...baseInput });

    await adminProductService.create(baseInput);

    expect(mockPrisma.product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: { create: [] },
          variants: { create: [] },
        }),
      }),
    );
  });
});

describe("adminProductService.delete", () => {
  it("throws 404 for an unknown product", async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);
    await expect(adminProductService.delete("does-not-exist")).rejects.toThrow(ApiError);
  });

  it("deletes an existing product", async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: "prod_1" });
    mockPrisma.product.delete.mockResolvedValueOnce({});

    await adminProductService.delete("prod_1");

    expect(mockPrisma.product.delete).toHaveBeenCalledWith({ where: { id: "prod_1" } });
  });
});
