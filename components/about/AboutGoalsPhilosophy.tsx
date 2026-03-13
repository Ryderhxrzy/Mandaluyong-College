import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export default function AboutGoalsPhilosophy() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Goals */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Goals</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700">Provide Mandaleño access to quality higher education.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700">Support optimum advancement in instruction, technology, research, innovation, and resource generation.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700">Collaborate with various educational, technical, and professional stakeholders for genuine public service.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700">Foster institutional effectiveness and efficiency for continuous improvement and total quality management.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <CheckCircle className="text-primary flex-shrink-0" size={16} />
                  <span className="text-gray-700">Produce graduates who are locally and internationally competent with a high sense of nationalism.</span>
                </li>
              </ul>
            </div>

            {/* Philosophy */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Philosophy</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Mandaluyong College of Science and Technology advocates the culture of excellence in science and technology that is anchored on the principles of quality instruction, dynamic research and innovation, continuous improvement, public service, and nationalism.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-gray-200 shadow-lg">
            <Image src="/goals.jpg" alt="MCST Goals" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
