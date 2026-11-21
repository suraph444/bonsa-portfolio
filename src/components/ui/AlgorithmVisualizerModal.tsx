import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Shuffle, BarChart3, CheckCircle2, Pause } from 'lucide-react'

interface AlgorithmVisualizerModalProps {
  isOpen: boolean
  onClose: () => void
}

type AlgorithmType = 'bubble' | 'selection' | 'insertion'

const ALGO_DETAILS: Record<AlgorithmType, { name: string; time: string; space: string; desc: string }> = {
  bubble: {
    name: 'Bubble Sort',
    time: 'O(n²)',
    space: 'O(1)',
    desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  },
  selection: {
    name: 'Selection Sort',
    time: 'O(n²)',
    space: 'O(1)',
    desc: 'Divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from the unsorted region.',
  },
  insertion: {
    name: 'Insertion Sort',
    time: 'O(n²)',
    space: 'O(1)',
    desc: 'Builds the final sorted array one item at a time by inserting each element into its proper position.',
  },
}

function generateRandomArray(length = 16): number[] {
  const arr: number[] = []
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 85) + 15)
  }
  return arr
}

export default function AlgorithmVisualizerModal({
  isOpen,
  onClose,
}: AlgorithmVisualizerModalProps) {
  const [algo, setAlgo] = useState<AlgorithmType>('bubble')
  const [array, setArray] = useState<number[]>([])
  const [comparing, setComparing] = useState<[number, number] | null>(null)
  const [swapping, setSwapping] = useState<[number, number] | null>(null)
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSorted, setIsSorted] = useState(false)
  const [comparisonsCount, setComparisonsCount] = useState(0)
  const [speed, setSpeed] = useState<number>(60) // ms delay

  const isCancelledRef = useRef(false)

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      resetArray()
    } else {
      document.body.style.overflow = ''
      isCancelledRef.current = true
      setIsRunning(false)
    }
    return () => {
      document.body.style.overflow = ''
      isCancelledRef.current = true
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const resetArray = () => {
    isCancelledRef.current = true
    setIsRunning(false)
    setIsSorted(false)
    setComparing(null)
    setSwapping(null)
    setSortedIndices([])
    setComparisonsCount(0)
    setArray(generateRandomArray(16))
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Bubble Sort execution
  const runBubbleSort = async () => {
    isCancelledRef.current = false
    setIsRunning(true)
    setIsSorted(false)
    const arr = [...array]
    const n = arr.length
    let comps = 0
    const sorted: number[] = []

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (isCancelledRef.current) return

        comps++
        setComparisonsCount(comps)
        setComparing([j, j + 1])
        setSwapping(null)
        await delay(speed)

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1])
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          setArray([...arr])
          await delay(speed)
        }
      }
      sorted.push(n - i - 1)
      setSortedIndices([...sorted])
    }

    if (!isCancelledRef.current) {
      setComparing(null)
      setSwapping(null)
      setSortedIndices(Array.from({ length: n }, (_, idx) => idx))
      setIsRunning(false)
      setIsSorted(true)
    }
  }

  // Selection Sort execution
  const runSelectionSort = async () => {
    isCancelledRef.current = false
    setIsRunning(true)
    setIsSorted(false)
    const arr = [...array]
    const n = arr.length
    let comps = 0
    const sorted: number[] = []

    for (let i = 0; i < n; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        if (isCancelledRef.current) return
        comps++
        setComparisonsCount(comps)
        setComparing([minIdx, j])
        setSwapping(null)
        await delay(speed)

        if (arr[j] < arr[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        setSwapping([i, minIdx])
        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
        setArray([...arr])
        await delay(speed)
      }

      sorted.push(i)
      setSortedIndices([...sorted])
    }

    if (!isCancelledRef.current) {
      setComparing(null)
      setSwapping(null)
      setSortedIndices(Array.from({ length: n }, (_, idx) => idx))
      setIsRunning(false)
      setIsSorted(true)
    }
  }

  // Insertion Sort execution
  const runInsertionSort = async () => {
    isCancelledRef.current = false
    setIsRunning(true)
    setIsSorted(false)
    const arr = [...array]
    const n = arr.length
    let comps = 0
    const sorted: number[] = [0]
    setSortedIndices([...sorted])

    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1

      while (j >= 0 && arr[j] > key) {
        if (isCancelledRef.current) return
        comps++
        setComparisonsCount(comps)
        setComparing([j, j + 1])
        setSwapping([j, j + 1])
        arr[j + 1] = arr[j]
        setArray([...arr])
        await delay(speed)
        j = j - 1
      }
      arr[j + 1] = key
      setArray([...arr])
      sorted.push(i)
      setSortedIndices([...sorted])
    }

    if (!isCancelledRef.current) {
      setComparing(null)
      setSwapping(null)
      setSortedIndices(Array.from({ length: n }, (_, idx) => idx))
      setIsRunning(false)
      setIsSorted(true)
    }
  }

  const handleStart = () => {
    if (isRunning) {
      isCancelledRef.current = true
      setIsRunning(false)
      return
    }
    if (algo === 'bubble') runBubbleSort()
    else if (algo === 'selection') runSelectionSort()
    else if (algo === 'insertion') runInsertionSort()
  }

  if (!isOpen) return null

  const maxVal = Math.max(...array, 100)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 bg-elevated/60">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-accent/15 text-accent">
                <BarChart3 size={16} />
              </span>
              <div>
                <h3 className="font-display text-sm sm:text-base font-semibold text-primary flex items-center gap-1.5">
                  Algorithm Visualizer & DSA Workbench
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/20 text-accent font-normal">
                    Live Demo
                  </span>
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-elevated transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-border/60 bg-base/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Algorithm Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-card border border-border/80">
                {(['bubble', 'selection', 'insertion'] as AlgorithmType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (!isRunning) {
                        setAlgo(type)
                        resetArray()
                      }
                    }}
                    disabled={isRunning}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                      algo === type
                        ? 'bg-accent text-white font-medium shadow-sm'
                        : 'text-secondary hover:text-primary disabled:opacity-50'
                    }`}
                  >
                    {ALGO_DETAILS[type].name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={resetArray}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-elevated text-xs font-mono text-secondary hover:text-primary transition-colors disabled:opacity-50"
                  title="Shuffle Array"
                >
                  <Shuffle size={13} />
                  <span>Shuffle</span>
                </button>

                <button
                  onClick={handleStart}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium text-white transition-all shadow-md ${
                    isRunning
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                      : isSorted
                      ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                      : 'bg-accent hover:bg-accent/90 shadow-accent/25'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause size={13} />
                      <span>Pause</span>
                    </>
                  ) : isSorted ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Sorted! Run again</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} />
                      <span>Sort</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="flex flex-wrap items-center justify-between text-xs text-secondary gap-2 font-mono">
              <div className="flex items-center gap-3">
                <span>
                  Time: <strong className="text-accent">{ALGO_DETAILS[algo].time}</strong>
                </span>
                <span>
                  Space: <strong className="text-accent">{ALGO_DETAILS[algo].space}</strong>
                </span>
                <span>
                  Comparisons: <strong className="text-primary">{comparisonsCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted">Speed:</span>
                <input
                  type="range"
                  min="20"
                  max="140"
                  step="10"
                  value={160 - speed}
                  onChange={(e) => setSpeed(160 - Number(e.target.value))}
                  disabled={isRunning}
                  className="w-16 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>
          </div>

          {/* Visualizer Canvas Bars */}
          <div className="p-5 sm:p-8 flex items-end justify-center gap-1 sm:gap-2 h-56 sm:h-64 bg-card/40">
            {array.map((val, idx) => {
              const heightPercent = Math.round((val / maxVal) * 100)
              const isComp = comparing && (comparing[0] === idx || comparing[1] === idx)
              const isSwap = swapping && (swapping[0] === idx || swapping[1] === idx)
              const isDone = sortedIndices.includes(idx)

              let barColor = 'bg-slate-700/80 border-slate-600'
              if (isDone) barColor = 'bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
              else if (isSwap) barColor = 'bg-accent border-accent/80 shadow-[0_0_12px_rgba(224,122,60,0.4)]'
              else if (isComp) barColor = 'bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-[9px] sm:text-[10px] font-mono text-muted mb-1 hidden xs:block">
                    {val}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all duration-150 border-t border-x ${barColor}`}
                  />
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 border-t border-border/60 bg-elevated/40 flex items-center justify-between text-[11px] sm:text-xs text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sorted &bull;{' '}
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Comparing &bull;{' '}
              <span className="w-2 h-2 rounded-full bg-accent" /> Swapping
            </span>
            <span className="text-muted font-mono hidden sm:inline">
              Built with React & State Hooks
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
