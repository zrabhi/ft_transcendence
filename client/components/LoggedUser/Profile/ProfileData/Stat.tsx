// Stat.js
import Image from 'next/image';

export default function Stat({ icon, label, value }: any) {
  return (
    <div className="flex gap-8 p-8 items-center rounded-[.3rem] bg-purple-400 bg-opacity-10 hover:bg-opacity-40 transition-all duration-100">
      <div className="stat-img">
        <Image src={icon} alt={label} width={60} height={60} />
      </div>
      <div className="stat-text">
        <p className="text-slate-100">{label}: {value}</p>
      </div>
    </div>
  );
}
