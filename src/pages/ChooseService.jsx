import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";

export default function ChooseService() {
  const { barberId } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allServices = [
      {
        id: "s1",
        name: "Haircut",
        time: "30 mins",
        price: 25,
        image:
          "https://images.unsplash.com/photo-1620912189866-74bb4248b89d?auto=format&fit=crop&w=200&q=80",
        bio: "Precision haircut tailored to your style.",
      },
      {
        id: "s2",
        name: "Beard Trim",
        time: "15 mins",
        price: 10,
        image:
          "https://images.unsplash.com/photo-1621607512997-3b8eaa73e3e6?auto=format&fit=crop&w=200&q=80",
        bio: "Sharp beard lining and clean edges.",
      },
      {
        id: "s3",
        name: "Facial",
        time: "20 mins",
        price: 20,
        image:
          "https://images.unsplash.com/photo-1617034024049-769aa14d3554?auto=format&fit=crop&w=200&q=80",
        bio: "Skin cleanse and rejuvenating treatment.",
      },
    ];

    const barberServicesById = {
      b1: ["s1", "s2"],
      b2: ["s1", "s3"],
    };

    const serviceIds = barberServicesById[barberId] || [];
    const filtered = allServices.filter((s) => serviceIds.includes(s.id));
    setServices(filtered);
  }, [barberId]);

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 p-6 pt-12">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-white">
          Choose Services
        </h1>

        {/* Selected Services Bar */}
        <div className="min-h-[40px] mb-6 flex flex-wrap gap-2">
          {selectedServices.length === 0 ? (
            <p className="text-sm text-zinc-400">No service selected</p>
          ) : (
            selectedServices.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleService(s)}
                className="px-3 py-1 rounded-full bg-black text-white text-sm hover:bg-red-600 transition"
              >
                {s.name} ✕
              </button>
            ))
          )}
        </div>

        {/* List of Services */}
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={!!selectedServices.find((s) => s.id === service.id)}
              onSelect={() => toggleService(service)}
            />
          ))}
        </div>

        <button
          disabled={selectedServices.length === 0}
          onClick={() =>
            navigate(`/book/${barberId}/calendar`, {
              state: { services: selectedServices },
            })
          }
          className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
            selectedServices.length > 0
              ? "bg-black text-white hover:opacity-90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
