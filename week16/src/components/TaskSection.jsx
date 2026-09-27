import { useState, useEffect } from 'react'

// localStorageに保存するときのキー名。
// タイプミスを防ぐため、文字列を直接あちこちに書かず定数にまとめる。
const STORAGE_KEY = 'pomodoro-tasks'

export default function TaskSection() {
  // tasks: { id, text, done } の配列。
  // useStateの初期値を「関数」で渡しているのがポイント（下のuseEffectと対の設計）。
  // こうするとコンポーネントが最初に描画されるたった1回だけlocalStorageを読みに行き、
  // 再描画のたびに毎回localStorageへアクセスする無駄を避けられる。
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // 保存データがあればJSON文字列をJS配列に戻す。なければ空配列からスタート
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      // JSON.parseに失敗した場合（データが壊れている等）でもアプリが
      // クラッシュしないよう、空配列にフォールバックする
      console.error('タスクの読み込みに失敗しました', error)
      return []
    }
  })

  // 入力欄に今打っている途中のテキストを保持する状態
  const [inputText, setInputText] = useState('')

  // --- tasksが変化するたびにlocalStorageへ書き込むuseEffect -----------
  // 「tasksを更新する処理」と「保存する処理」を分けて書くことで、
  // handleAddTaskやhandleToggleTaskなど、tasksを変えるすべての場所で
  // 個別に保存処理を書く必要がなくなる（保存し忘れのバグを防げる）。
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    // このuseEffectはsetIntervalのような「後片付けが必要な処理」を
    // 開始していないため、クリーンアップ関数（return文）は不要。
    // クリーンアップは「タイマーやイベントリスナーなど、
    // 放置すると残り続けてしまうもの」を止めるためのものなので、
    // 単なる保存処理には必要ない。
  }, [tasks])

  const handleAddTask = (e) => {
    // フォームのデフォルト動作（ページ再読み込み）を止める
    e.preventDefault()

    // 空文字や空白だけの入力は追加しない
    const trimmed = inputText.trim()
    if (trimmed === '') return

    const newTask = {
      id: Date.now(), // 簡易的な一意のID（学習用途としては十分な精度）
      text: trimmed,
      done: false,
    }

    // 既存のtasks配列を直接書き換えず、スプレッド構文で
    // 「新しい配列」を作ってからsetTasksに渡す。
    // Reactは状態が「別のオブジェクト/配列に変わったかどうか」を見て
    // 再描画するかを判断するため、直接pushして変更すると
    // 画面が更新されないバグにつながる。
    setTasks((prev) => [...prev, newTask])
    setInputText('')
  }

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 rounded-2xl ring-1 ring-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-gray-700">
        タスクリスト
      </h2>

      <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="やることを入力..."
          className="flex-1 min-w-0 rounded-full border border-gray-200 px-4 py-2 text-sm sm:text-base outline-none focus:border-gray-400 transition-colors"
        />
        <button
          type="submit"
          className="shrink-0 px-4 sm:px-5 py-2 rounded-full bg-gray-800 text-white text-sm sm:text-base font-medium hover:bg-gray-700 transition-colors"
        >
          追加
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {tasks.length === 0 && (
          <li className="text-sm text-gray-400 text-center py-4">
            タスクはまだありません
          </li>
        )}

        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleToggleTask(task.id)}
              className="h-4 w-4 shrink-0 accent-red-500"
            />
            <span
              className={`flex-1 min-w-0 break-words text-sm sm:text-base ${
                task.done ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {task.text}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="shrink-0 text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
