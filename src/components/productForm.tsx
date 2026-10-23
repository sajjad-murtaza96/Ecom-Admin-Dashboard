import type { ProductState } from "@/reducers/product/product.reducer";
import type { ProductOperation } from "@/utilities/product";
import type React from "react";

export const ProductForm: React.FC<{
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  productState: ProductState;
  title: ProductOperation;
  ctaText: string;
  ctaLoadingText: string;
}> = ({
  handleSubmit,
  handleChange,
  productState: { productToAddUpdate, message, loading },
  title,
  ctaText,
  ctaLoadingText,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow text-gray-700"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            name="title"
            value={productToAddUpdate.title}
            onChange={(e) => handleChange(e)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            name="price"
            value={productToAddUpdate.price}
            onChange={(e) => handleChange(e)}
            type="number"
            step="0.01"
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={productToAddUpdate.description}
            onChange={(e) => handleChange(e)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image Url
          </label>
          <input
            name="imageUrl"
            value={productToAddUpdate.imageUrl}
            onChange={(e) => handleChange(e)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        {message ? (
          <div className="text-sm text-blue-600">{message}</div>
        ) : null}

        <div>
          <button
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer"
          >
            {loading ? ctaLoadingText : ctaText}
          </button>
        </div>
      </form>
    </div>
  );
};
