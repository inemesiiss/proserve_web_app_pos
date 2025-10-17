import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "@/components/entertainment/components/BackButton";
// import { useEffect, useState } from "react";

export default function HomeIndoorPage() {
  const navigate = useNavigate();

  // // 🎥 Local fallback ads
  // const localAds = ["/ads/ad1.mp4", "/ads/ad2.mp4", "/ads/ad3.mp4"];

  // // 🎬 YouTube ads (using privacy-friendly, no-cookie embeds)
  // const youtubeAds = [
  //   "https://www.youtube-nocookie.com/embed/p4JLAmKq84Q?autoplay=1&mute=1&loop=1&playlist=p4JLAmKq84Q&controls=0&modestbranding=1&showinfo=0&rel=0",
  //   "https://www.youtube-nocookie.com/embed/x-ahBVkPGuE?autoplay=1&mute=1&loop=1&playlist=x-ahBVkPGuE&controls=0&modestbranding=1&rel=0",
  //   "https://www.youtube-nocookie.com/embed/nb_fFj_0rq8?autoplay=1&mute=1&loop=1&playlist=nb_fFj_0rq8&controls=0&modestbranding=1&rel=0",
  // ];

  // const [online, setOnline] = useState(navigator.onLine);
  // const [adSource, setAdSource] = useState<string | null>(null);
  // const [isYouTubeAd, setIsYouTubeAd] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const updateOnlineStatus = () => setOnline(navigator.onLine);
  //   window.addEventListener("online", updateOnlineStatus);
  //   window.addEventListener("offline", updateOnlineStatus);

  //   if (navigator.onLine) {
  //     setAdSource(youtubeAds[currentIndex]);
  //     setIsYouTubeAd(true);
  //   } else {
  //     setAdSource(localAds[currentIndex]);
  //     setIsYouTubeAd(false);
  //   }

  // 🎞️ Rotate ads every 60 seconds
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => {
  //       const nextIndex =
  //         (prev + 1) % (navigator.onLine ? youtubeAds.length : localAds.length);
  //       setAdSource(
  //         navigator.onLine ? youtubeAds[nextIndex] : localAds[nextIndex]
  //       );
  //       return nextIndex;
  //     });
  //   }, 60000); // change every 60 seconds (adjust to your liking)

  //   return () => {
  //     clearInterval(interval);
  //     window.removeEventListener("online", updateOnlineStatus);
  //     window.removeEventListener("offline", updateOnlineStatus);
  //   };
  // }, [online, currentIndex]);

  const services = [
    {
      label: "PlayLab",
      image: "/services/indoor.png",
      alt: "Ticket Icon",
      path: "/indoor/transaction",
      color: "from-yellow-500 to-yellow-700",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 relative">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <BackButton to="/services" label="Back" />
      </div>

      {/* 🎥 Advertisement Section */}
      {/* <motion.div
        key={adSource}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-6xl h-[700px] bg-black rounded-3xl shadow-2xl overflow-hidden mb-14 relative"
      >
        {adSource ? (
          isYouTubeAd ? (
            <iframe
              src={adSource}
              title="Advertisement"
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <video
              key={adSource}
              src={adSource}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-xl font-medium">
            Loading Ad...
          </div>
        )}
        <div className="absolute top-3 left-5 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
          Sponsored Ad
        </div>
      </motion.div> */}

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold text-gray-800 mb-10 text-center"
      >
        Choose Sub Type Industry
      </motion.h2>

      {/* Service Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-5xl justify-items-center">
        {services.map((service, index) => (
          <motion.div
            key={service.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <Button
              onClick={() => navigate(service.path)}
              className={`w-60 h-64 bg-gradient-to-b ${service.color} text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95`}
            >
              <motion.div
                className="flex flex-col items-center justify-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.img
                  src={service.image}
                  alt={service.alt}
                  className="w-35 h-24 mb-4 drop-shadow-lg"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <p className="text-xl font-semibold tracking-wide">
                  {service.label}
                </p>
              </motion.div>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
