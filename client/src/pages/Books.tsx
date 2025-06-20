import axios from "axios";
import { useEffect, useState } from "react";
import { database_url } from "../config";
import { Link } from "react-router-dom";
import type { Book } from "./Home";
import Loader from "../components/Loading"; // Loader component

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${database_url}/books`, {
        params: { page: pageNumber },
      });
      const fetchedBooks = res.data.books;
      setBooks(fetchedBooks);
      setHasMore(fetchedBooks.length > 0);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage(page + 1);
  };

  return (
    <div className="flex justify-center py-10 bg-white min-h-screen font-sans">
      <div className="w-full max-w-5xl px-6 flex flex-col space-y-6">
        {loading ? (
          <Loader />
        ) : books.length > 0 ? (
          books.map((book) => (
            <div key={book._id}>
              <Link to={`/Review/?id=${book._id}`}>
                <h2 className="text-2xl  text-black tracking-wide hover:underline hover:text-blue-700 font-serif  ">
                  {book.name.toUpperCase()}
                </h2>
              </Link>
              <p className="text-gray-700 italic text-base mt-1">
                by {book.author}
              </p>
              <p className="text-sm text-yellow-700 font-medium mt-1">
                ⭐ {book.ratings.value}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center">No books found.</p>
        )}

        {/* Pagination Buttons */}
        {!loading && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!hasMore}
              className={`px-5 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition ${
                !hasMore ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
