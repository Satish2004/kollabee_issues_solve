interface ProgressCardProps {
  title: string;
  percentage: number;
  amount: number;
  gradient?: boolean;
}

export function ProgressCard({
  title,
  percentage,
  amount,
  gradient = true,
}: ProgressCardProps) {
  return (
    <div
      className={`p-6 rounded-lg ${
        gradient ? "bg-[#EA3D4F] text-white" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={gradient ? "rgba(255, 255, 255, 0.2)" : "#eee"}
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={gradient ? "#fff" : "#ff4d4d"}
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {percentage}%
          </div>
        </div>
        <div className="text-right">
          <h3 className={gradient ? "text-white/80" : "text-[#78787a]"}>
            {title}
          </h3>
          <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
