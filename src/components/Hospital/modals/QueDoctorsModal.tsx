import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import doctorsData from "@/data/doctors.json";
import { printQueueTicket } from "@/function/prinQue";

// Doctor type
interface Doctor {
  id: string;
  name: string;
  picture: string;
  specialty: string;
  schedule: { day: string; time: string }[];
}

// All departments type
type DoctorsData = {
  [key: string]: Doctor[];
};

interface DoctorsModalProps {
  onClose: () => void; // only prop now
}

export default function DoctorsModal({ onClose }: DoctorsModalProps) {
  const data: DoctorsData = doctorsData as DoctorsData;

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [queueNumber, setQueueNumber] = useState<string | null>(null);

  // When doctor selected → generate queue number + print + auto-close
  useEffect(() => {
    if (selectedDoctor) {
      const randomNum = Math.floor(100 + Math.random() * 900); // 100–999
      const numStr = randomNum.toString();
      setQueueNumber(numStr);

      // Print immediately
      printQueueTicket(numStr);

      // Auto close after 5s
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [selectedDoctor, onClose]);

  // If doctor chosen → show queue number view
  if (selectedDoctor && queueNumber) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-700">
              Your Queue Number
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600 mt-2">
            Clinic: <span className="font-semibold">Clinic 1</span>
          </p>
          <p className="text-gray-600 mb-4">
            Doctor: <span className="font-semibold">{selectedDoctor.name}</span>
          </p>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-3xl text-green-600 mb-2"
          >
            ⬇
          </motion.div>

          <p className="text-6xl font-extrabold text-blue-700 mb-6">
            {queueNumber}
          </p>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Default → show list of doctors
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            👨‍⚕️ Available Doctors
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data).map(([dept, doctors]) =>
            doctors.map((doctor) => (
              <Card key={doctor.id} className="shadow-md">
                <CardHeader className="flex flex-col items-center">
                  <img
                    src="/dr.jpg"
                    alt={doctor.name}
                    className="h-24 w-24 rounded-full object-cover border"
                  />
                  <h3 className="mt-3 font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialty}
                  </p>
                  <span className="mt-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium">
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </span>
                </CardHeader>

                <CardContent className="text-center space-y-2">
                  {doctor.schedule.map((s, i) => (
                    <p
                      key={i}
                      className="text-xs text-gray-600 flex items-center justify-center gap-2"
                    >
                      📅 {s.day} | ⏰ {s.time}
                    </p>
                  ))}

                  <Button
                    className="w-full mt-3"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Select Doctor
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
