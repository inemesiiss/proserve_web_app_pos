// // pages/entertainment/kiosk/SelectSeatPageWrapper.tsx
// import { useLocation, Navigate } from "react-router-dom";
// import SelectSeatPage from "@/pages/entertainment/kiosk/SelectSeatPage";

// export default function SelectSeatPageWrapper() {
//   const location = useLocation();

//   // Get state passed from navigate()
//   const { state } = location as {
//     state?: {
//       movie?: {
//         cinema: string;
//         title: string;
//         price: number;
//         // add more fields if needed
//       };
//       selectedTime?: string;
//     };
//   };

//   if (!state?.movie || !state.selectedTime) {
//     // User accessed URL directly without navigation — handle gracefully
//     return <Navigate to="/cinema/tickets" replace />;
//   }

//   const { movie, selectedTime } = state;

//   return (
//     <SelectSeatPage
//       cinema={movie.cinema}
//       movie={movie.title}
//       time={selectedTime}
//       price={movie.price}
//     />
//   );
// }
