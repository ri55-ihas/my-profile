const BookCard =({title,author,rating,comment})=>(
    <div className="flex flex-col gap-1 shadow-md border border-stone-300 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <h3 className="text-lg font-semibold text-gray-500">{author}</h3>
        <span className="mb-4 text-yellow-700">{rating}</span>
        <p className="leading-relaxed text-stone-700">{comment}</p>
    </div>
);

export default BookCard;