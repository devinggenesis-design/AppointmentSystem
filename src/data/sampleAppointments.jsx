const toISO = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const day = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toISO(d);
};

export const todayISO = () => toISO(new Date());

export const sampleAppointments = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    phone: "0917 123 4567",
    service: "Haircut",
    price: 150,
    date: day(0),
    time: "09:00",
    status: "booked",
  },
  {
    id: 2,
    name: "Mark Santos",
    phone: "0928 555 1122",
    service: "Haircut + Beard Trim",
    price: 250,
    date: day(0),
    time: "10:30",
    status: "booked",
  },
  {
    id: 3,
    name: "Paolo Reyes",
    phone: "0905 777 8899",
    service: "Shave",
    price: 100,
    date: day(0),
    time: "13:00",
    status: "completed",
  },
  {
    id: 4,
    name: "Carlo Mendoza",
    phone: "0999 321 6543",
    service: "Haircut",
    price: 150,
    date: day(1),
    time: "11:00",
    status: "booked",
  },
  {
    id: 5,
    name: "Miguel Torres",
    phone: "0916 222 3344",
    service: "Hair Color",
    price: 600,
    date: day(1),
    time: "15:30",
    status: "booked",
  },
  {
    id: 6,
    name: "Rico Villanueva",
    phone: "0927 888 9900",
    service: "Beard Trim",
    price: 120,
    date: day(2),
    time: "09:30",
    status: "cancelled",
  },
  {
    id: 7,
    name: "Daniel Garcia",
    phone: "0918 456 7890",
    service: "Haircut",
    price: 150,
    date: day(-1),
    time: "16:00",
    status: "completed",
  },
];
