import React from "react";

const FAQItem = ({ item = {}, onToggle, isOpen }) => {
  const { question, answer } = item;

  if (!question) {
    return null;
  }

  return (
    <button
      type="button"
      className="bg-white p-6 rounded-xl shadow border border-gray-200 cursor-pointer"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`faq-content-${question}`}
    >
      <h2 className="text-lg font-semibold text-cyan-800 flex justify-between items-center">
        {question}
        <span className="text-xl font-light">{isOpen ? "−" : "+"}</span>
      </h2>
      {isOpen && (
        <p
          id={`faq-content-${question}`}
          className="text-sm leading-relaxed text-neutral-700 mt-4"
        >
          {answer}
        </p>
      )}
    </button>
  );
};

export default FAQItem;
