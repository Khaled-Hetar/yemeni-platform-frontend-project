import React, { useState } from "react";
import faqData from "../data/faqData.js";
import FAQItem from "../components/faq/FAQItem";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 mt-14 text-neutral-800">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8 text-center">
        الأسئلة الشائعة
      </h1>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <FAQItem
            key={faq.id}
            item={faq}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
