import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryFilter = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Kategoriler alınamadı:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = (id) => {
    setActiveCategory(id);
    onSelect(id); // Cards componentine bildir
  };
  console.log(categories);
  return (
    <div className="d-flex flex-wrap gap-2 mb-4 ">
      <button
        className={`btn btn-sm ${
          activeCategory === null ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => handleSelect(null)}
      >
        Tüm Kategoriler
      </button>
      {categories.map((cat, idx) => (
        <button
          key={cat.idx}
          className={`btn btn-sm ${
            activeCategory === cat.id ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => handleSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
