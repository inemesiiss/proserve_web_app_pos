"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/context/entertainment/OrderProvider";
import Header from "@/components/entertainment/components/Header";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "selected" | "reserved" | "occupied";
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;

interface SelectSeatPageProps {
  cinema: string;
  movie: string;
  time: string;
  price: number;
}

export default function SelectSeatPage({
  cinema,
  movie,
  time,
  price,
}: SelectSeatPageProps) {
  const { addItem } = useOrder();
  const [seats, setSeats] = useState<Seat[]>(generateSeats);

  function generateSeats(): Seat[] {
    const seats: Seat[] = [];
    for (const row of ROWS) {
      for (let num = 1; num <= SEATS_PER_ROW; num++) {
        let status: Seat["status"] = "available";
        if (row === "B" && (num === 2 || num === 3)) status = "reserved";
        if (row === "H" && num === 10) status = "occupied";
        seats.push({ id: `${row}${num}`, row, number: num, status });
      }
    }
    return seats;
  }

  const toggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              status:
                seat.status === "available"
                  ? "selected"
                  : seat.status === "selected"
                  ? "available"
                  : seat.status,
            }
          : seat
      )
    );
  };

  const selectedSeats = useMemo(
    () => seats.filter((s) => s.status === "selected"),
    [seats]
  );

  const totalPrice = useMemo(
    () => selectedSeats.length * price,
    [selectedSeats, price]
  );

  const addToCart = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat first.");
      return;
    }

    selectedSeats.forEach((seat) => {
      addItem({
        id: `ticket-${seat.id}`,
        name: `${cinema}-${seat.id} - ${time}`,
        qty: 1,
        price,
        type: "ticket",
      });
    });

    setSeats((prev) =>
      prev.map((seat) =>
        seat.status === "selected" ? { ...seat, status: "reserved" } : seat
      )
    );
  };

  const resetSelection = () => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.status === "selected" ? { ...seat, status: "available" } : seat
      )
    );
  };

  return (
    <>
      <Header headerText="🍿 Select a Seat" to="/cinema/tickets" />

      <div
        className="flex flex-row items-start justify-center gap-6 p-8 w-full overflow-hidden"
        style={{ height: "calc(100vh)", marginBottom: "80px" }}
      >
        <div className="flex-1 max-w-[500px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">
            {movie}
          </h2>
          <p className="text-gray-700 mb-4 text-center">
            {cinema} • {time}
          </p>

          {/* Screen */}
          <div className="bg-gray-700 text-white rounded-md text-center py-2 px-6 mb-6 w-2/3 font-semibold shadow-inner">
            SCREEN
          </div>

          {/* Seat Grid */}
          <div
            className="grid gap-2 text-center"
            style={{
              gridTemplateColumns: `auto repeat(${SEATS_PER_ROW}, 1fr)`,
              maxWidth: "480px",
            }}
          >
            <div></div>
            {Array.from({ length: SEATS_PER_ROW }).map((_, i) => (
              <div key={i} className="text-xs font-semibold text-gray-600">
                {i + 1}
              </div>
            ))}

            {ROWS.map((row) => (
              <div key={row} className="contents">
                <div className="font-semibold text-gray-600">{row}</div>
                {seats
                  .filter((seat) => seat.row === row)
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() =>
                        seat.status !== "reserved" &&
                        seat.status !== "occupied" &&
                        toggleSeat(seat.id)
                      }
                      disabled={
                        seat.status === "reserved" || seat.status === "occupied"
                      }
                      className={`rounded-md text-xs font-medium select-none transition 
                      ${
                        seat.status === "available"
                          ? "bg-gray-200 hover:bg-blue-200"
                          : seat.status === "selected"
                          ? "bg-blue-600 text-white"
                          : seat.status === "reserved"
                          ? "bg-pink-400 text-white cursor-not-allowed"
                          : "bg-gray-500 text-white cursor-not-allowed"
                      }`}
                      style={{ width: 32, height: 32 }}
                      title={`Seat ${seat.id} - ₱${price}`}
                    >
                      {seat.number}
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 text-sm flex-wrap">
            <LegendDot color="bg-gray-200" label="Available" />
            <LegendDot color="bg-blue-600" label="Selected" />
            <LegendDot color="bg-pink-400" label="Reserved" />
            <LegendDot color="bg-gray-500" label="Occupied" />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <Button
              onClick={addToCart}
              disabled={selectedSeats.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-sm px-8 w-56 disabled:opacity-60"
            >
              {selectedSeats.length > 0
                ? `Selected ${selectedSeats.length} Seat${
                    selectedSeats.length > 1 ? "s" : ""
                  } (₱${totalPrice.toLocaleString()})`
                : "Select Seats"}
            </Button>

            <Button
              variant="outline"
              onClick={resetSelection}
              className="border-gray-400 w-56"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}
