import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toSlug } from "@/utils/entertainment/CinemaUtils";
import Header from "@/components/entertainment/components/Header";

export default function TicketsPage() {
  const navigate = useNavigate();

  const movies = [
    {
      id: 1,
      title: "Doctor Strange",
      cinema: "Cinema 1",
      image: "strange.jfif",
      price: 300,
    },
    {
      id: 2,
      title: "Superman",
      cinema: "Cinema 2",
      image: "superman.jfif",
      price: 300,
    },
    {
      id: 3,
      title: "Batman",
      cinema: "Cinema 3",
      image: "batman.jfif",
      price: 300,
    },
    {
      id: 4,
      title: "Spiderman",
      cinema: "Cinema 4",
      image: "spiderman.jfif",
      price: 300,
    },
    {
      id: 5,
      title: "The Hulk",
      cinema: "Cinema 5",
      image: "hulk.jfif",
      price: 300,
    },
    {
      id: 6,
      title: "Antman",
      cinema: "Cinema 6",
      image: "antman.jpg",
      price: 300,
    },
  ];

  const times = ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

  const [selectedMovie, setSelectedMovie] = useState<(typeof movies)[0] | null>(
    null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Auto-select the first movie on page load
  useEffect(() => {
    setSelectedMovie(movies[0]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      {/* Back Button */}
      {/* Title */}
      <Header headerText="🍿 Select a Movie" to="/cinema" />

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {movies.map((movie) => {
          const isSelected = selectedMovie?.id === movie.id;

          return (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all flex flex-col 
                ${isSelected ? "ring-4 ring-blue-400" : ""}
              `}
              onClick={() => {
                setSelectedMovie(movie);
                setSelectedTime(null); // reset selected time when changing movie
              }}
            >
              {/* Poster */}
              <img
                src={`/cinema/${movie.image}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />

              {/* Details */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-blue-600 text-center mb-1">
                  {movie.cinema}
                </h3>
                <p className="text-xl font-bold text-gray-800 text-center mb-2">
                  {movie.title}
                </p>
                <p className="text-center text-gray-600 mb-4">
                  🎟️ Ticket Price: ₱{movie.price}
                </p>

                {/* Time Slots */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {times.map((time) => (
                    <button
                      key={time}
                      className={`text-gray-700 text-sm py-2 rounded-lg transition font-medium
                        ${
                          selectedTime === time && isSelected
                            ? "bg-blue-300 font-semibold"
                            : "bg-gray-100 hover:bg-blue-100"
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent movie re-select on time click
                        setSelectedMovie(movie);
                        setSelectedTime(time);
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Reserve Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedTime || !isSelected) {
                      alert("Please select a time before reserving a seat.");
                      return;
                    }

                    const cinemaSlug = toSlug(movie.cinema);
                    const movieSlug = toSlug(movie.title);
                    const timeSlug = selectedTime
                      .replace(/:/g, "")
                      .replace(/\s/g, "")
                      .toLowerCase();

                    navigate(`/cinema/${cinemaSlug}/${movieSlug}/${timeSlug}`, {
                      state: {
                        movie,
                        selectedTime,
                      },
                    });
                  }}
                  className={`w-full text-white text-lg py-3 rounded-xl mt-auto transition ${
                    selectedTime && isSelected
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                >
                  Reserve Seat
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
