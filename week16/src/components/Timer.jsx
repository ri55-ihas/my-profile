import { useState, useEffect } from 'react'

// 「マジックナンバー」を直接コードに埋め込まず、名前付きの定数にしておく。
// こうすることで「25*60」が何の数字か毎回考えなくてもよくなり、
// 将来値を変えたくなった場合もここ1箇所を直すだけで済む。
const FOCUS_SECONDS = 25 * 60 // 集中: 25分
const BREAK_SECONDS = 5 * 60  // 休憩: 5分

// 秒数を "24:59" のような mm:ss 形式の文字列に変換するヘルパー関数。
// コンポーネントの外に置くことで「このタイマー専用の状態」に依存しない
// 純粋な計算用関数として独立させている（テストや再利用がしやすい）。
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  // padStart(2, '0') で 1桁の数字を "01" のように2桁表示にする
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function Timer() {
  // ① mode: 今が「集中(focus)」なのか「休憩(break)」なのかを表す状態
  const [mode, setMode] = useState('focus')

  // ② secondsLeft: 現在のモードにおける残り秒数
  //    初期値はモードに応じたuseState(初期値を関数で渡す形)にしている
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)

  // ③ isRunning: タイマーが再生中かどうか（true = カウントダウン中）
  const [isRunning, setIsRunning] = useState(false)

  const switchMode = (newMode) => {
    setIsRunning(false)
    setMode(newMode)
    setSecondsLeft(newMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }

  // --- タイマーを1秒ごとに進めるuseEffect -----------------------------
  // このuseEffectは「isRunning」か「mode」が変化するたびに実行し直される。
  // やっていることは大きく2つ：
  //   1. isRunningがtrueなら、setIntervalで1秒ごとにsecondsLeftを1減らす
  //   2. isRunningがfalse、またはコンポーネントが消える/依存値が変わる
  //      直前に、必ずclearIntervalで先ほど作ったタイマーを止める
  useEffect(() => {
    // isRunningがfalse（一時停止 or リセット直後）のときは
    // 何もしない＝setIntervalを作らずにこのまま抜ける
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // 残り1秒以下になったら、そこでタイマーを止めて
          // モードを切り替える（集中→休憩、休憩→集中）
          setIsRunning(false)
          setMode((prevMode) => (prevMode === 'focus' ? 'break' : 'focus'))
          return prevMode === 'focus' ? BREAK_SECONDS : FOCUS_SECONDS
        }
        return prev - 1
      })
    }, 1000)

    // ★ useEffectの「戻り値」として返す関数は"クリーンアップ関数"と呼ばれ、
    //   次にこのuseEffectが再実行される直前、または
    //   コンポーネントが画面から消える（アンマウントされる）ときに実行される。
    //
    //   もしここでclearIntervalを呼ばないと、
    //   ・isRunningの切り替えやmodeの変更のたびに新しいsetIntervalが作られ、
    //   ・古いタイマーは動いたまま残り続けてしまい、
    //   ・画面には見えていない「幽霊タイマー」が裏で秒数を勝手に
    //     減らし続ける、というバグ（メモリリーク）が発生する。
    //   毎回きちんと片付けることで「今動いているタイマーは常に1つだけ」
    //   という状態を保証できる。
    return () => clearInterval(intervalId)
  }, [isRunning, mode])

  // スタート/一時停止ボタンを押したときの処理。
  // 今の状態を反転させるだけなので、実際のタイマー開始/停止は
  // 上のuseEffectが「isRunningの変化」を検知してやってくれる。
  const handleToggle = () => setIsRunning((prev) => !prev)

  // リセットボタン：タイマーを止めて、現在のモードの初期秒数に戻す
  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }

  // モードによって見た目を変えるための設定をオブジェクトにまとめておく。
  // if文をJSXの中に何度も書くより、こうして1箇所にまとめた方が
  // 「モードごとの色の対応」が見渡しやすくなる。
  const theme =
    mode === 'focus'
      ? {
          label: '集中タイム',
          bg: 'bg-red-50',
          ring: 'ring-red-200',
          text: 'text-red-600',
          button: 'bg-red-500 hover:bg-red-600',
        }
      : {
          label: '休憩タイム',
          bg: 'bg-green-50',
          ring: 'ring-green-200',
          text: 'text-green-600',
          button: 'bg-green-500 hover:bg-green-600',
        }

  return (
    
    // transition-colors duration-500 で、モードが切り替わったときに
    // 背景色がパッと変わるのではなく、ふわっと変化するようにしている
    <div
      className={`w-full max-w-md mx-auto rounded-2xl ring-1 ${theme.ring} ${theme.bg} p-6 sm:p-8 transition-colors duration-500 shadow-sm`}
    >
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => switchMode('focus')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mode === 'focus' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          集中 (25分)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mode === 'break' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          休憩 (5分)
        </button>
      </div>

      <p className={`text-center text-sm sm:text-base font-semibold tracking-wide ${theme.text}`}>
        {theme.label}
      </p>

      {/* タイマーの数値表示。text-6xl〜sm:text-7xlのようにブレイクポイントで
          サイズを変え、スマホでもPCでも「大きく・中央」を保つ */}
      <p
        className={`mt-2 text-center font-mono font-bold text-6xl sm:text-7xl ${theme.text} tabular-nums`}
      >
        {formatTime(secondsLeft)}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={handleToggle}
          className={`px-6 py-2.5 rounded-full text-white font-medium transition-colors ${theme.button}`}
        >
          {isRunning ? '一時停止' : 'スタート'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 rounded-full font-medium text-gray-600 bg-white ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  )
}
