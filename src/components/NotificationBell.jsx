import { Bell } from "lucide-react";

export default function NotificationBell({ count }) {
  const displayCount = count > 9 ? "9+" : count;

  return (
    <a className="relative inline-block" href="/barber/notifications">
      <Bell size={24} className="text-zinc-700 dark:text-white" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {displayCount}
        </span>
      )}
    </a>
  );
}
