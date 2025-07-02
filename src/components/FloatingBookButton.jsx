import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function FloatingBookButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const client = JSON.parse(localStorage.getItem("client"));
    if (client?.shop_id) {
      navigate(`/shop/${client.shop_id}`);
    } else {
      navigate("/discover");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
}
