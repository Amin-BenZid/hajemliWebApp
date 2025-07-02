import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BarberReviewSection from "../components/BarberReviewSection";
import { MapPin, Phone, CalendarCheck } from "lucide-react";
import FloatingBookButton from "../components/FloatingBookButton";

export default function BarberProfile() {
  const { id } = useParams(); // barberId from URL
  const [barber, setBarber] = useState(null);

  // 🔧 Fake data
  useEffect(() => {
    setBarber({
      _id: id,
      name: "Youssef Amara",
      rating: 4.7,
      phone: "+216 55 123 456",
      birthdate: "1992-07-15",
      mail: "youssef@example.com",
      profile_image: "https://randomuser.me/api/portraits/men/75.jpg",
      bio: "Professional barber with 10+ years experience. Precision cuts and modern styles.",
      services: [
        { _id: "1", name: "Haircut", price: 30 },
        { _id: "2", name: "Beard Trim", price: 20 },
        { _id: "3", name: "Shave", price: 15 },
      ],
      reviews: [
        {
          _id: "r1",
          user_id: "u1",
          nb_stars: 5,
          comment: "Youssef is amazing! Super clean and professional.",
          date_of_send: new Date("2024-06-01"),
        },
        {
          _id: "r2",
          user_id: "u2",
          nb_stars: 4,
          comment: "Great haircut, but the wait time was long.",
          date_of_send: new Date("2024-06-10"),
        },
        {
          _id: "r3",
          user_id: "u3",
          nb_stars: 5,
          comment: "Perfect fade! I’ll be back for sure.",
          date_of_send: new Date("2024-06-15"),
        },
      ],
    });
  }, [id]);

  if (!barber) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      <BottomNav />
      <FloatingBookButton />

      {/* Top Profile Section */}
      <div className="relative bg-gray-100 dark:bg-zinc-800 p-6 rounded-b-3xl">
        <div className="flex flex-col items-center gap-4">
          <img
            src={barber.profile_image}
            alt={barber.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold">{barber.name}</h1>
            <p className="text-yellow-500 font-semibold">{barber.rating} ⭐</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{barber.bio}</p>
          </div>
        </div>
      </div>

      {/* Contact + Services */}
      <div className="px-6 py-4 space-y-6">
        <div className="space-y-1 text-sm text-gray-600 dark:text-zinc-300">
          <p className="flex items-center gap-2">
            <Phone size={16} /> {barber.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} /> Based in your shop
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck size={16} /> Born:{" "}
            {new Date(barber.birthdate).toLocaleDateString()}
          </p>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold mb-2">💈 Services Offered</h2>
          <ul className="space-y-2">
            {barber.services.map((s) => (
              <li
                key={s._id}
                className="flex justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-xl shadow"
              >
                <span>{s.name}</span>
                <span className="font-medium">{s.price} TND</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <BarberReviewSection barberId={barber._id} reviews={barber.reviews} />
        </div>
      </div>
    </div>
  );
}
