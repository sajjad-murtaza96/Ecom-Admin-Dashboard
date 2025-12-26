import Link from "next/link";

export const EditIcon: React.FC<{
  productId: string;
}> = ({ productId }) => {
  return (
    <Link
      href={`/product/${productId}/edit`}
      className="absolute right-2 top-15 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow hover:bg-blue-600 hover:text-white transition cursor-pointer"
    >
      ✏️
    </Link>
  );
};
