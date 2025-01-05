function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
