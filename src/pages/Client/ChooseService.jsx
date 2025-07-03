import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../components/ServiceCard";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300 p-6 pt-12"
    >
      <div className="w-full max-w-xl mx-auto">
        {/* Modern Stepper Progress */}
        <div className="flex justify-between items-center mb-10 px-2">
          {[
            { label: "Service", step: 1 },
            { label: "Time", step: 2 },
            { label: "Confirm", step: 3 },
          ].map((item, i) => (
            <div key={i} className="flex-1 relative text-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm z-10 border-2 ${
                    item.step === 1
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-white border-gray-300 dark:border-zinc-600"
                  }`}
                >
                  {item.step}
                </div>
                <span className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {item.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`absolute top-4  h-0.5 w-full ${
                    item.step === 1 ? "bg-green-500" : "bg-gray-300 dark:bg-zinc-600"
                  }`}
                  style={{ transform: "translateX(50%)" }}
                />
              )}
            </div>
          ))}
        </div>

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
    </motion.div>
  );
}
