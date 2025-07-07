import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ServiceCard from "../../components/ServiceCard";
import { fetchBarberById, fetchServiceById } from "../../services/api";

export default function ChooseService() {
  const { barberId } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBarberServices() {
      try {
        const barber = await fetchBarberById(barberId);
        if (Array.isArray(barber.services) && barber.services.length > 0) {
          const serviceDetails = await Promise.all(
            barber.services.map((serviceId) => fetchServiceById(serviceId))
          );
          setServices(serviceDetails);
        } else {
          setServices([]);
        }
      } catch (err) {
        setServices([]);
      }
    }
    fetchBarberServices();
  }, [barberId]);

  const toggleService = (service) => {
    const exists = selectedServices.find((s) => s._id === service._id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s._id !== service._id));
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
              key={service._id || service.service_id}
              service={service}
              isSelected={!!selectedServices.find((s) => s._id === service._id)}
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
