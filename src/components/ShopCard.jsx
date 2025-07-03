export default function ShopCard({ shop, onView }) {
  return (
    <div
      onClick={onView}
      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl shadow-sm flex gap-4 items-center transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700"
    >
      <img
        src={shop.image}
        alt={shop.name}
        className="w-16 h-16 object-cover rounded-xl"
      />
      <div className="flex-1">
        <p className="font-semibold text-lg text-zinc-900 dark:text-white">{shop.name}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {shop.area} • {shop.type}
        </p>
        <p className="text-sm text-yellow-500 font-medium">
          ⭐ {shop.rating} • Code: {shop.code}
        </p>
      </div>
      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 underline">
        View
      </div>
    </div>
  );
}
