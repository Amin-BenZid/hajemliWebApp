export default function ServiceCard({ service, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer bg-white dark:bg-zinc-800 border rounded-2xl p-4 shadow-sm flex gap-4 items-center transition-colors duration-300 ${
        isSelected
          ? "border-black dark:border-white ring-2 ring-black dark:ring-white"
          : "hover:shadow-md border-zinc-200 dark:border-zinc-700"
      }`}
    >
      <img
        src={service.image}
        alt={service.name}
        className="w-20 h-20 object-cover rounded-xl border dark:border-zinc-600"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-zinc-800 dark:text-white">
          {service.name}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {service.bio}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{service.time}</p>
      </div>
      <p className="text-lg font-bold text-black dark:text-white whitespace-nowrap">
        {service.price} DT
      </p>
    </div>
  );
}
