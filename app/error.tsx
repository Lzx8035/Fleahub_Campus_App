"use client";

// 这两个参数是 Next.js 的错误处理机制自动提供的。在 Next.js 中，error.tsx 是一个特殊的错误边界文件，它会自动捕获同级目录及其子目录中所有组件的错误。
// 当发生错误时，Next.js 会：

// error 参数: 自动传入捕获到的错误对象，包含错误信息
// reset 参数: 自动传入一个重置函数，调用它可以尝试重新渲染出错的组件

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
