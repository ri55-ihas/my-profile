import Timer from './components/Timer.jsx'
import TaskSection from './components/TaskSection.jsx'

// Appは「部品(Timer, TaskSection)を並べるだけ」のシンプルな役割にする。
// タイマーのロジックとタスクのロジックをそれぞれの子コンポーネントに
// 閉じ込めているので、Appの中には状態(useState)が一切登場しない。
// こうした「小さな部品に役割を分ける」設計をコンポーネント分割と呼び、
// 1つ1つのファイルが何をしているか把握しやすくなるメリットがある。
export default function App() {
  return (
    // min-h-screenで画面の高さいっぱいを確保しつつ、
    // px-4のような余白でスマホ幅(375px)でも文字や枠が
    // 画面端にくっつかないようにしている
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <h1 className="text-center text-xl sm:text-2xl font-bold text-gray-800 mb-8">
        ポモドーロタイマー & タスク管理
      </h1>

      <Timer />
      <TaskSection />
    </div>
  )
}
