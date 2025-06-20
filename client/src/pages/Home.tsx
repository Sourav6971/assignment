import axios from "axios";
import { useEffect, useState } from "react";
import { database_url } from "../config";
import { Link } from "react-router-dom";
import Loader from "../components/Loading";

export interface Book {
  _id: string;
  author: string;
  name: string;
  reviews: string[];
  ratings: {
    count: number;
    value: number;
  };
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${database_url}/books`, {
        params: { page: 1 },
      })
      .then((res) => {
        setBooks(res.data.books.slice(0, 5));
        setLoading(false);
      });
  }, []);
  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="flex justify-center py-10 bg-white min-h-screen">
      <div className="w-full max-w-5xl px-5">
        {" "}
        {/* Increased max-w from 3xl to 5xl */}
        {books.map((book) => (
          <div
            key={book._id}
            className="border border-gray-300 py-6 flex flex-col space-y-2 hover:bg-gray-50 transition rounded-lg px-6 mb-6 shadow-md w-full"
          >
            <Link to={`/Review/?id=${book._id}`}>
              <h2 className="text-3xl font-bold text-black font-sans tracking-wide hover:underline">
                {book.name.toUpperCase()}
              </h2>
            </Link>
            <p className="text-gray-600 text-sm italic">by {book.author}</p>
            <p className="text-sm text-gray-500">
              Rating: {book.ratings.value} ⭐
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
