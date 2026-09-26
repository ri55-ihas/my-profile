import BookCard from "./components/BookCard";

const BookData =[
  {id: "1",title:"ハリー・ポッターと賢者の石" ,author:"J・K・ローリング" ,rating:"★★★★★" ,comment:"魔法界の圧倒的な世界観と心温まるストーリーが最初から完成されている名作"},
  {id: "2",title:"ハリー・ポッターと秘密の部屋" ,author:"J・K・ローリング" ,rating:"★★★★☆" ,comment:"ミステリー要素やダークな雰囲気が増し、テンポよく楽しめる名作"},
  {id: "3",title:"ハリー・ポッターとアズカバンの囚人" ,author:"J・K・ローリング" ,rating:"★★★★★" ,comment:"ハリーのルーツや重厚な人間ドラマが描かれる最高傑作"},
] ;

const App = ()=>(
  <main className="p-10 flex flex-col gap-4">
    <h1 className="text-3xl font-bold mb-2">書籍紹介ページ</h1>
    {BookData.map((book)=>(
      <BookCard key={book.id} title={book.title} author={book.author} rating={book.rating} comment={book.comment}/>
    ))}
  </main>
);

export default App;