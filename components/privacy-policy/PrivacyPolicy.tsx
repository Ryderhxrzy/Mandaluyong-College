import PrivacyHeroSection from '@/components/privacy-policy/PrivacyHeroSection'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="-mt-14 md:-mt-16">
        <PrivacyHeroSection />
      </div>

      {/* Content Section */}
      <div className="py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
          {/* Content */}
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <p>
              At Mandaluyong College of Science and Technology, we are committed to protecting your privacy and ensuring the security of any personal information you provide through our website. When you interact with us—such as enrolling, submitting forms, or reaching out—we may collect personal details including your name, email, contact number, and academic preferences.
            </p>

            <p>
              We also collect technical data such as your IP address, browser type, and behavior patterns using cookies to help improve our user experience and online services. This data is used to process requests, respond to inquiries, enhance academic services, and occasionally notify you of school events and updates (if you opted in).
            </p>

            <p>
              MCST implements strict security measures to safeguard your personal information. We do not sell or disclose your data to third parties, except trusted partners and systems essential for educational and operational functions, all under strict confidentiality.
            </p>

            <p>
              You have the right to access, modify, or request deletion of your information at any time by contacting our administrative office. Our website may contain links to other educational or government sites, and we are not responsible for their privacy practices.
            </p>

            <p>
              By continuing to use our services, you agree to the terms of this policy. We reserve the right to update this policy to reflect current practices and compliance requirements. Updates will be posted on this page.
            </p>

            <p>
              For any concerns regarding your data, please contact us at:{' '}
              <a href="tel:(02) 87160352" className="text-primary hover:underline">
                (02) 87160352
              </a>{' '}
              or email:{' '}
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
