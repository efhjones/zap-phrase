// @flow
import React from "react";

import "./Categories.css";

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
        <option value="Random">Random</option>
        <option value="Millennials">Millennials</option>
        <option value="Around the House">Around the House</option>
        <option value="Food and Drink">Food and Drink</option>
        <option value="Plants and Animals">Plants and Animals</option>
        <option value="Idioms">Idioms</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Tech and Inventions">Tech and Inventions</option>
        <option value="Geography">Geography</option>
      </select>
    </div>
  );
};

export default Categories;
