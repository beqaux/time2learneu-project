const features = [
  {
    icon: '🏛️',
    title: 'AB Tarihi',
    description: 'Kuruluştan günümüze Avrupa Birliği\'nin tarihi yolculuğunu keşfet.',
  },
  {
    icon: '🧠',
    title: 'Fuzzy Eşleşme',
    description: 'Serbest metin sorularında yazım hatalarına karşı toleranslı akıllı değerlendirme.',
  },
  {
    icon: '🔀',
    title: 'Sürükle & Bırak',
    description: 'Eşleştirme sorularında interaktif sürükle-bırak deneyimi.',
  },
  {
    icon: '📊',
    title: 'Anlık Puanlama',
    description: 'Her doğru cevap için puan kazan. MC: 10p, Serbest: 25p, Eşleştirme: 5p/çift.',
  },
  {
    icon: '🌍',
    title: '5 Kategori',
    description: 'Tarih, kurumlar, antlaşmalar, kültür ve coğrafya kategorilerinden seç.',
  },
  {
    icon: '⭐',
    title: '3 Zorluk',
    description: 'Kolay\'dan Zor\'a kademeli öğrenme deneyimi.',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20 px-4 bg-[#f0f4ff]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1a1a2e] mb-4">
          Neden Time2LearnEU?
        </h2>
        <p className="text-center text-[#6b7280] mb-12 text-lg max-w-2xl mx-auto">
          AB'yi öğrenmenin en eğlenceli ve etkili yolu
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-md border border-[#d1d9e6] card-hover"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{feature.title}</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
