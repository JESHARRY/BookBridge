import React, { useState } from "react";
import axios from "axios";
import {
  FaBook,
  FaUser,
  FaMoneyBill,
  FaLanguage,
  FaTags,
  FaLink,
  FaAlignLeft,
} from "react-icons/fa";

const AddBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    genre: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const {
        url,
        title,
        author,
        price,
        desc,
        language,
        genre,
      } = Data;

      if (
        url === "" ||
        title === "" ||
        author === "" ||
        price === "" ||
        desc === "" ||
        language === "" ||
        genre === ""
      ) {
        alert("Please fill all the fields");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/add-book",
          Data,
          { headers }
        );

        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          desc: "",
          language: "",
          genre: "",
        });

        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c3e50] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative Background Glass Border */}
      <div className="absolute w-[90%] max-w-3xl h-[90%] rounded-[3rem] bg-gradient-to-r from-blue-400/30 to-purple-500/20 blur-3xl opacity-30 border-2 border-white/10 z-0 shadow-2xl"></div>

      {/* Form Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl p-10 text-white transition-all duration-500">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-200 tracking-wider">
          📘 Add a New Book
        </h2>

        <form onSubmit={submit} className="space-y-5">
          {[
            {
              name: "url",
              placeholder: "Cover Image URL",
              icon: <FaLink />,
            },
            {
              name: "title",
              placeholder: "Book Title",
              icon: <FaBook />,
            },
            {
              name: "author",
              placeholder: "Author Name",
              icon: <FaUser />,
            },
            {
              name: "price",
              placeholder: "Price (₹)",
              icon: <FaMoneyBill />,
              type: "number",
            },
            {
              name: "language",
              placeholder: "Language",
              icon: <FaLanguage />,
            },
            {
              name: "genre",
              placeholder: "Genre (e.g., Fiction, Sci-fi)",
              icon: <FaTags />,
            },
          ].map(({ name, placeholder, icon, type = "text" }) => (
            <div
              key={name}
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300"
            >
              <div className="text-blue-300 text-lg">{icon}</div>
              <input
                type={type}
                name={name}
                value={Data[name]}
                onChange={change}
                placeholder={placeholder}
                className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none"
                required
              />
            </div>
          ))}

          {/* Description Textarea */}
          <div className="flex items-start gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-blue-400 transition duration-300">
            <div className="text-blue-300 pt-1 text-lg">
              <FaAlignLeft />
            </div>
            <textarea
              name="desc"
              rows="3"
              value={Data.desc}
              onChange={change}
              placeholder="Book Description"
              className="w-full bg-transparent placeholder-gray-300 text-white focus:outline-none resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-xl font-semibold text-white tracking-wide shadow-md hover:shadow-indigo-400/40 transition-all duration-300 hover:scale-[1.02]"
          >
            🚀 Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
