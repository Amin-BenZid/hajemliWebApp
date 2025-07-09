import { useNavigate } from "react-router-dom";

export default function BarberCardWorker({ barber }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-md px-5 py-4 flex items-center justify-between hover:shadow-lg transition-colors duration-300">
      {/* Clickable left section for profile */}
      <div
        onClick={() => navigate(`/barber/${barber.barber_id}`)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <img
          src={barber.image}
          alt={barber.name}
          className="w-16 h-16 object-cover rounded-full border dark:border-zinc-600"
        />
        <div>
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
            {barber.name}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
            {barber.rating} ⭐
          </div>
        </div>
      </div>

   
    </div>
  );
}
