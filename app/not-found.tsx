import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f4] px-6 text-center text-ink">
      <div>
        <h1 className="text-3xl font-bold">没有找到这支球拍</h1>
        <Link href="/" className="mt-4 inline-block rounded-full bg-court px-5 py-2 font-semibold text-white">
          返回球拍库
        </Link>
      </div>
    </main>
  );
}
