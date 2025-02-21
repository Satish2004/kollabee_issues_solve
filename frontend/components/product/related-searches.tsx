const relatedSearches = [
  "hoodies",
  "tribal print hoodie",
  "zip up hoodie",
  "full print hoodies",
  "bulk hoodies",
  "obey hoodie",
  "mens hoodies",
  "custom printed hoodies",
  "black hoodie",
  "tall hoodies",
];

export default function RelatedSearches() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Related searches
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-3">
        {relatedSearches.map((item, index) => (
          <div
            key={index}
            className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
