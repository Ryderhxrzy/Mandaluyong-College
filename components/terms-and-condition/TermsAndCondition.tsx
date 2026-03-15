import TermsHeroSection from '@/components/terms-and-condition/TermsHeroSection'

export default function TermsAndCondition() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="-mt-14 md:-mt-16">
        <TermsHeroSection />
      </div>

      {/* Content Section */}
      <div className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          {/* Content */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <p>
              By accessing or using the official website of Mandaluyong College of Science and Technology, you agree to comply with and be bound by these terms and conditions. Please read them carefully before using our services.
            </p>

            <p>
              All content, graphics, and materials on this website are the intellectual property of Mandaluyong College of Science and Technology and are protected by applicable copyright laws. You may not reproduce, modify, distribute, or republish content without prior written permission.
            </p>

            <p>
              The university reserves the right to change, suspend, or discontinue any aspect of the website at any time without notice. We may also modify these terms at any time and your continued use constitutes acceptance of those changes.
            </p>

            <p>
              Users must not misuse this website. Engaging in illegal activities, unauthorized access, or transmitting harmful software is strictly prohibited.
            </p>

            <p>
              While we strive to maintain accurate and updated information, Mandaluyong College of Science and Technology does not guarantee completeness or accuracy. We are not liable for any loss or damage arising from your reliance on the content.
            </p>

            <p>
              These terms are governed by Philippine law. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the Philippine courts.
            </p>

            <p>
              If you have questions about our terms, please reach out at:{' '}
              <a href="mailto:registrarsoffice@mcst.edu.ph" className="text-primary hover:underline">
                registrarsoffice@mcst.edu.ph
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
