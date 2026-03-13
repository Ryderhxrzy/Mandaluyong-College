interface AboutMissionVisionProps {
  mission?: string
  vision?: string
}

export default function AboutMissionVision({
  mission = 'To cultivate a culture of excellence in Science and Technology pursuing the improvement of the quality of life of every Mandaleño to bring about the city\'s sustainable development and resiliency towards nation building.',
  vision = 'A college of distinction in Science and Technology committed to produce high caliber and employable graduates.',
}: AboutMissionVisionProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {mission}
            </p>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {vision}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
