import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { database_url } from "../config";
import Loader from "../components/Loading";

interface BookData {
  _id: string;
  name: string;
  author: string;
  reviews: string[];
  ratings: {
    count: number;
    value: number;
  };
}

const Review = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [book, setBook] = useState<BookData | null>(null);

  useEffect(() => {
    axios
      .get(`${database_url}/books`, {
        params: { id },
      })
      .then((res) => {
        console.log("API Response:", res.data);
        const bookData =
          res.data.books && res.data.books.length > 0
            ? res.data.books[0]
            : null;
        setBook(bookData);
      });
  }, [id]);

  const handleAddReview = () => {
    // Placeholder for future "Add Review" functionality
    alert("Add Review button clicked!");
  };

  return (
    <div className="flex justify-center py-10 bg-white min-h-screen">
      <div className="w-full max-w-4xl px-5">
        {book ? (
          <div className="flex flex-col space-y-4">
            {/* Book Name + Add Review Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-black font-sans tracking-wide">
                {book.name.toUpperCase()}
              </h2>
              <button
                onClick={handleAddReview}
                className="ml-4 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200"
              >
                + Add Review
              </button>
            </div>

            {/* Author */}
            <p className="text-lg font-semibold text-gray-700 italic">
              by {book.author}
            </p>

            {/* Rating */}
            <p className="text-md text-yellow-700 font-medium">
              ⭐ Rating: {book.ratings.value} / 5
            </p>

            {/* Reviews */}
            <div className="mt-6 space-y-3">
              <h3 className="text-2xl font-semibold text-black">Reviews:</h3>
              {book.reviews.length > 0 ? (
                book.reviews.map((review, index) => (
                  <p
                    key={index}
                    className="text-gray-800 text-base leading-relaxed"
                  >
                    {index + 1}. {review}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews available.</p>
              )}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Review;
