// src/data/carData.js

export const CAR_BRANDS = [
  "Toyota",
  "Honda",
  "Nissan",
  "Subaru",
  "Mitsubishi",
  "Mazda",
  "Suzuki",
  "Isuzu",
  "Ford",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Hyundai",
  "Kia",
  "Lexus",
  "Volvo",
  "Land Rover",
  "Jeep",
  "Peugeot",
  "Renault",
  "Chevrolet",
  "Mitsubishi",
  "Daihatsu",
  "Proton",
  "Maserati",
  "Ferrari",
  "Porsche",
  "Jaguar",
  "Tesla",
  "BYD",
  "GWM",
  "Chery",
  "Mahindra",
  "Tata"
];

// Optional: Add car models if needed
export const CAR_MODELS = {
  Toyota: ["Camry", "Corolla", "Fielder", "Harrier", "Land Cruiser", "Prado", "Rav4", "Vitz", "Noah", "Voxy", "Axio", "Premio", "Allion"],
  Honda: ["Civic", "Accord", "Fit", "CR-V", "HR-V", "Odyssey", "Pilot"],
  Nissan: ["Note", "X-Trail", "Qashqai", "Juke", "Leaf", "Patrol", "Sunny", "Bluebird"],
  Subaru: ["Forester", "Outback", "Impreza", "Legacy", "WRX", "Levorg"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "1 Series", "7 Series"],
  Mercedes: ["C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "A-Class"],
  // Add more models as needed
};

// Car years (last 20 years)
export const CAR_YEARS = Array.from({ length: 25 }, (_, i) => (new Date().getFullYear() - i).toString());

// Colors
export const CAR_COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Brown",
  "Orange",
  "Yellow",
  "Purple",
  "Gold",
  "Maroon",
  "Navy",
  "Beige",
  "Teal"
];