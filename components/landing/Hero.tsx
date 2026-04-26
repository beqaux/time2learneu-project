import Link from 'next/link';
import Button from '../ui/Button';

export default function Hero() {
  const stars = Array.from({ length: 12 }, (_, i) => i);
  const radius = 90;

  return (
    <section className="relative overflow-hidden gradient-hero min-h-screen flex items-center justify-center">
      {/* Stars pattern overlay */}
      <div className="absolute inset-0 stars-pattern opacity-40" />

      {/* Floating EU star ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-10">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {stars.map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
            const cx = 200 + radius * Math.cos(angle);
            const cy = 200 + radius * Math.sin(angle);
            return (
              <text
                key={i}
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="28"
                fill="#FFCC00"
              >
                ★
              </text>
            );
          })}
        </svg>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-slide-up">
        {/* EU Flag stars decoration */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              {stars.map((_, i) => {
                const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
                const cx = 50 + 38 * Math.cos(angle);
                const cy = 50 + 38 * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="14"
                    fill="#FFCC00"
                  >
                    ★
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
          Time2Learn<span className="text-[#FFCC00]">EU</span>
        </h1>

        <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium">
          Avrupa Birliği hakkında ne kadar bilgi sahibisin?
        </p>

        <p className="text-base md:text-lg text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Çoktan seçmeli, serbest metin ve eşleştirme sorularıyla AB tarihini, kurumlarını,
          antlaşmalarını ve üye ülkelerini öğren. Kayıt gerekmez!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/play">
            <Button size="lg" variant="primary" className="animate-pulse-gold !bg-[#FFCC00] !text-[#001a4d] hover:!bg-[#FFD700] shadow-2xl">
              🎮 Oyuna Başla
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { label: 'Kategori', value: '5' },
            { label: 'Soru Tipi', value: '3' },
            { label: 'Zorluk', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-[#FFCC00]">{stat.value}</div>
              <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
