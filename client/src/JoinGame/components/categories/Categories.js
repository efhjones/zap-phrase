// @flow
import React from "react";

import "./Categories.css";

const categories = [
  "Random",
  "Millennials",
  "Around the House",
  "Food and Drink",
  "Plants and Animals",
  "Idioms",
  "Entertainment",
  "Tech and Inventions",
  "Geography"
];

const Categories = ({ onSelectCategory, category }) => {
  return (
    <div className="category-dropdown">
      <select
        className="select"
        id="category-dropdown"
        type="select"
        form="join-game-form"
        onChange={e => {
          onSelectCategory(e.target.value);
        }}
        value={category}
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Categories;
