export type ServiceKey =
  | "Hotels"
  | "Flights"
  | "Food"
  | "Taxi"
  | "Train"
  | "Bus"
  | "Car rental"
  | "Events"
  | "Bills"
  | "Health"
  | "Insurance"
  | "Shop"
  | "Marketplace";
export type Item = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  image: string | number;
  rating?: string;
  badge?: string;
  description: string;
  features: string[];
  kind: "hotel" | "food" | "shop" | "market" | "service";
  service?: ServiceKey;
};
export const riad = require("../../assets/images/riad.png");
export const argan = require("../../assets/images/argan.png");
export const images = {
  coast: require("../../assets/editorial/coast.jpg"),
  room: require("../../assets/editorial/room.jpg"),
  food: require("../../assets/editorial/food.jpg"),
  pizza: require("../../assets/editorial/pizza.jpg"),
  burger: require("../../assets/editorial/burger.jpg"),
  sushi: require("../../assets/editorial/sushi.jpg"),
  pottery: require("../../assets/editorial/pottery.jpg"),
  bag: require("../../assets/editorial/bag.jpg"),
  car: require("../../assets/editorial/car.jpg"),
  house: require("../../assets/editorial/house.jpg"),
  laptop: require("../../assets/editorial/laptop.jpg"),
  plane: require("../../assets/editorial/plane.jpg"),
  train: require("../../assets/editorial/train.jpg"),
  event: require("../../assets/editorial/event.jpg"),
  sam: require("../../assets/editorial/sam.jpg"),
  amelia: require("../../assets/editorial/amelia.jpg"),
  oliver: require("../../assets/editorial/oliver.jpg"),
  taxi: require("../../assets/editorial/taxi.jpg"),
  bus: require("../../assets/editorial/bus.jpg"),
  doctor: require("../../assets/editorial/doctor.jpg"),
  lemonade: require("../../assets/images/lemonade.png"),
};
export const services: {
  name: ServiceKey;
  icon: string;
  color: string;
  bg: string;
  tagline: string;
}[] = [
  {
    name: "Hotels",
    icon: "hotel",
    color: "#927444",
    bg: "#F5EEDC",
    tagline: "Somewhere worth staying",
  },
  {
    name: "Flights",
    icon: "plane",
    color: "#557A93",
    bg: "#EAF1F5",
    tagline: "Your next chapter awaits",
  },
  {
    name: "Food",
    icon: "utensils",
    color: "#B7734B",
    bg: "#F8EDE4",
    tagline: "Good food. Great moments.",
  },
  {
    name: "Taxi",
    icon: "car",
    color: "#6D8453",
    bg: "#EDF2E3",
    tagline: "Your everyday ride",
  },
  {
    name: "Train",
    icon: "train",
    color: "#7973A3",
    bg: "#F0EDF7",
    tagline: "Take the scenic route",
  },
  {
    name: "Bus",
    icon: "bus",
    color: "#588582",
    bg: "#E8F3EF",
    tagline: "Go a little further",
  },
  {
    name: "Car rental",
    icon: "key",
    color: "#8F735C",
    bg: "#F3EDE6",
    tagline: "The freedom to explore",
  },
  {
    name: "Events",
    icon: "ticket",
    color: "#AD6E7B",
    bg: "#F9EDF0",
    tagline: "Make a memory",
  },
  {
    name: "Bills",
    icon: "receipt",
    color: "#5A7F64",
    bg: "#EAF2E9",
    tagline: "Life admin, simplified",
  },
  {
    name: "Health",
    icon: "heart-pulse",
    color: "#A76968",
    bg: "#F7EBE9",
    tagline: "A little care goes a long way",
  },
];
export const hotels: Item[] = [
  {
    id: "riad",
    name: "Riad Jardin Secret",
    subtitle: "Marrakech, Morocco",
    category: "Riads",
    price: 18500,
    image: riad,
    rating: "4.98",
    badge: "Zedd favourite",
    kind: "hotel",
    description:
      "A quiet courtyard, sunlit arches, and a little space to slow down. Discover an intimate riad tucked away in the heart of Marrakech’s medina, with thoughtful details and a warm Moroccan welcome.",
    features: [
      "Pool",
      "Breakfast included",
      "Free Wi-Fi",
      "Courtyard",
      "Airport transfer",
    ],
  },
  {
    id: "harbour",
    name: "Harbour Boutique Hotel",
    subtitle: "Sydney, Australia",
    category: "Boutique",
    price: 32000,
    image: images.room,
    rating: "4.92",
    badge: "Guest favourite",
    kind: "hotel",
    description:
      "Wake up to harbour light in the heart of The Rocks. Spacious rooms, considered design, and a rooftop terrace made for slow mornings.",
    features: ["Rooftop terrace", "Restaurant", "Free Wi-Fi", "Harbour views"],
  },
  {
    id: "coast",
    name: "The Coast House",
    subtitle: "Gold Coast, Australia",
    category: "Resorts",
    price: 24500,
    image: images.coast,
    rating: "4.87",
    kind: "hotel",
    description:
      "Easy days by the ocean. A thoughtfully designed coastal retreat with private beach access and a relaxed, welcoming atmosphere.",
    features: ["Beach access", "Pool", "Breakfast included", "Free parking"],
  },
  {
    id: "loft",
    name: "Fitzroy Loft Hotel",
    subtitle: "Melbourne, Australia",
    category: "Boutique",
    price: 17500,
    image: images.room,
    rating: "4.85",
    kind: "hotel",
    description:
      "Your creative base in Melbourne. Loft-inspired rooms, local coffee and everything worth exploring just outside your door.",
    features: ["Free Wi-Fi", "Coffee bar", "City location", "Late checkout"],
  },
];
export const restaurants: Item[] = [
  {
    id: "bowl",
    name: "Bondi Beach Bowl",
    subtitle: "Fresh bowls · Australian · Healthy",
    category: "Healthy",
    price: 2400,
    image: images.food,
    rating: "4.8",
    badge: "Free delivery",
    kind: "food",
    description:
      "Bright, seasonal ingredients and generous bowls. A fresh take on your everyday favourites, made to order.",
    features: ["20–30 min", "Free delivery", "No minimum"],
  },
  {
    id: "pizza",
    name: "Luna Pizza",
    subtitle: "Wood-fired · Italian · Pizza",
    category: "Pizza",
    price: 2600,
    image: images.pizza,
    rating: "4.9",
    badge: "Popular nearby",
    kind: "food",
    description:
      "Slow-fermented dough, San Marzano tomatoes and the perfect wood-fired crust. Made with a little patience and a lot of love.",
    features: ["25–35 min", "A$3 delivery", "Handmade daily"],
  },
  {
    id: "burger",
    name: "Harbour Burgers",
    subtitle: "Smash burgers · Comfort food",
    category: "Burgers",
    price: 2200,
    image: images.burger,
    rating: "4.7",
    kind: "food",
    description:
      "Crisp edges, soft buns, house-made sauces. Good honest burgers with harbour soul.",
    features: ["15–25 min", "A$3 delivery", "Local favourite"],
  },
  {
    id: "sushi",
    name: "Sushi Sydney",
    subtitle: "Japanese · Sushi · Fresh",
    category: "Sushi",
    price: 2900,
    image: images.sushi,
    rating: "4.9",
    kind: "food",
    description:
      "Beautifully simple Japanese food with seasonal Pacific ingredients and thoughtful attention to every detail.",
    features: ["30–40 min", "A$3 delivery", "Fresh daily"],
  },
];
export const products: Item[] = [
  {
    id: "argan",
    name: "Pure Argan Oil",
    subtitle: "Essaouira Oils · 50 ml",
    category: "Beauty",
    price: 1800,
    image: argan,
    badge: "Bestseller",
    kind: "shop",
    description:
      "Cold-pressed, single-origin argan oil from Essaouira. A naturally nourishing ritual for skin and hair, made in small batches by a women-led cooperative.",
    features: ["100% natural", "Ethically sourced", "Made in Morocco"],
  },
  {
    id: "bowl-ceramic",
    name: "Safi Ceramic Collection",
    subtitle: "Safi Ceramics · Handmade",
    category: "Home",
    price: 3200,
    image: images.pottery,
    badge: "Artisan made",
    kind: "shop",
    description:
      "Hand-shaped and glazed by artisans in Safi. Each piece carries its own subtle variations: a beautiful object made to be used every day.",
    features: ["Handcrafted", "Small batch", "Unique finish"],
  },
  {
    id: "leather",
    name: "Everyday Leather Tote",
    subtitle: "Souk Leather · Black leather",
    category: "Style",
    price: 8900,
    image: images.bag,
    kind: "shop",
    description:
      "An understated everyday companion. Supple leather, generous proportions and careful stitching, crafted to become more beautiful with time.",
    features: ["Genuine leather", "Hand stitched", "Made in Marrakech"],
  },
];
export const marketplace: Item[] = [
  {
    id: "car",
    name: "Porsche 911 Carrera",
    subtitle: "Sydney · Private seller",
    category: "Cars",
    price: 12900000,
    image: images.car,
    badge: "Verified listing",
    kind: "market",
    description:
      "A beautifully maintained example, with full service history. ",
    features: ["2021", "32,000 km", "Automatic", "Petrol"],
  },
  {
    id: "house",
    name: "Light-filled coastal home",
    subtitle: "Gold Coast · 3 bedrooms",
    category: "Homes",
    price: 410000,
    image: images.house,
    badge: "For rent / month",
    kind: "market",
    description:
      "An airy coastal retreat with a generous garden and easy access to the beach. ",
    features: ["3 bedrooms", "2 bathrooms", "Garden", "Parking"],
  },
  {
    id: "laptop",
    name: "MacBook Pro 14-inch",
    subtitle: "Melbourne · Like new",
    category: "Lifestyle",
    price: 185000,
    image: images.laptop,
    kind: "market",
    description: "Carefully used with original packaging. ",
    features: ["M3 chip", "16GB memory", "512GB SSD", "Like new"],
  },
];
export const allItems = [
  ...hotels,
  ...restaurants,
  ...products,
  ...marketplace,
];
export const getItem = (id: string) => allItems.find((i) => i.id === id);
export const menuFor = (item: Item) => [
  {
    id: `${item.id}-signature`,
    name:
      item.id === "pizza"
        ? "Wood-fired Mushroom Pizza"
        : item.id === "bowl"
          ? "The Green Goddess"
          : item.id === "sushi"
            ? "Salmon & Cream Cheese Roll"
            : "Double Smash Burger",
    description:
      item.id === "pizza"
        ? "Mushrooms, mozzarella, golden wood-fired crust"
        : item.id === "bowl"
          ? "Avocado, chickpeas, sweet potato, crisp greens"
          : item.id === "sushi"
            ? "Salmon, cream cheese, seasoned rice"
            : "Two patties, cheddar, pickles, house sauce",
    price: item.price,
    image: item.image,
  },
  {
    id: `${item.id}-drink`,
    name: "House-made Lemonade",
    description: "Fresh lemon, mint and sparkling water",
    price: 600,
    image: images.lemonade,
  },
];
export const serviceOffers = (service: ServiceKey): Item[] => {
  const map: Partial<
    Record<ServiceKey, [string, string, string, number, string][]>
  > = {
    Flights: [
      [
        "Sydney to Melbourne",
        "SYD 09:30 · MEL 11:05",
        "Direct · Economy",
        14900,
        images.plane,
      ],
      [
        "Sydney to Brisbane",
        "SYD 12:10 · BNE 13:40",
        "Direct · Economy",
        17900,
        images.plane,
      ],
    ],
    Taxi: [
      [
        "Zedd Comfort",
        "Comfortable everyday rides",
        "4 seats · 5 min away",
        2400,
        images.taxi,
      ],
      [
        "Zedd XL",
        "A little more room",
        "6 seats · 8 min away",
        3600,
        images.taxi,
      ],
    ],
    Train: [
      [
        "Sydney to Newcastle",
        "Central 10:15 · Newcastle 12:50",
        "Intercity · Standard",
        2800,
        images.train,
      ],
      [
        "Sydney to Blue Mountains",
        "Central 11:00 · Katoomba 13:02",
        "Scenic route · Standard",
        1900,
        images.train,
      ],
    ],
    Bus: [
      [
        "Sydney to Canberra",
        "09:00 · 12:30",
        "Express · Wi-Fi included",
        4500,
        images.bus,
      ],
      [
        "Sydney to Melbourne",
        "21:00 · 08:30",
        "Overnight · Reclining seats",
        8900,
        images.bus,
      ],
    ],
    "Car rental": [
      [
        "City Compact",
        "Sydney Airport · Automatic",
        "5 seats · Unlimited km",
        6500,
        images.car,
      ],
      [
        "Weekend SUV",
        "Sydney Airport · Automatic",
        "5 seats · Free cancellation",
        9500,
        images.car,
      ],
    ],
    Events: [
      [
        "An Evening of Jazz",
        "Sydney · The Foundry",
        "Fri 27 Nov · 19:00",
        4500,
        images.event,
      ],
      [
        "Weekend Makers Market",
        "Sydney · Carriageworks",
        "Sat 28 Nov · 10:00",
        1500,
        images.pottery,
      ],
    ],
    Health: [
      [
        "General Consultation",
        "Dr. James Wilson",
        "General practice · 30 min",
        6500,
        images.doctor,
      ],
      [
        "Wellness Consultation",
        "Dr. James Wilson",
        "Wellness · 45 min",
        8500,
        images.doctor,
      ],
    ],
  };
  return (map[service] || []).map((x, i) => ({
    id: `${service}-${i}`,
    name: x[0],
    subtitle: x[1],
    category: service,
    price: x[3],
    image: x[4],
    kind: "service",
    service,
    description: `Explore ${x[0].toLowerCase()} with Zedd. Choose a date and make it yours.`,
    features: [x[2], "Flexible options", "Pay with Zedd"],
  }));
};
