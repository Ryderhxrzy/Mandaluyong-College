import { Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function News() {
  const newsArticles = [
    {
      id: 1,
      title: 'Mandaluyong College Wins National Award for Educational Excellence',
      excerpt:
        'Our institution has been recognized for outstanding contributions to quality education...',
      date: 'March 10, 2024',
      author: 'Admin',
      category: 'Awards',
    },
    {
      id: 2,
      title: 'New IT Laboratory Opens with State-of-the-Art Equipment',
      excerpt:
        'Students now have access to the latest technology and tools for learning and innovation...',
      date: 'March 5, 2024',
      author: 'Tech Department',
      category: 'Facilities',
    },
    {
      id: 3,
      title: 'Alumni Success Stories: Where Are They Now?',
      excerpt:
        'Meet some of our successful alumni making a difference in their respective fields...',
      date: 'February 28, 2024',
      author: 'Alumni Office',
      category: 'Alumni',
    },
    {
      id: 4,
      title: 'Spring Semester Admissions Now Open',
      excerpt:
        'Apply now for our spring semester programs. Limited slots available for all courses...',
      date: 'February 20, 2024',
      author: 'Admissions',
      category: 'Admissions',
    },
    {
      id: 5,
      title: 'Faculty Research Initiative Funds Five New Projects',
      excerpt:
        'Our faculty members have been selected to conduct groundbreaking research in various fields...',
      date: 'February 15, 2024',
      author: 'Research Office',
      category: 'Research',
    },
    {
      id: 6,
      title: 'Student Organizations Host Annual Leadership Summit',
      excerpt:
        'Over 200 students gathered to learn about leadership, innovation, and community service...',
      date: 'February 10, 2024',
      author: 'Student Affairs',
      category: 'Events',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">News & Events</h1>
          <p className="text-xl text-blue-100">
            Stay updated with the latest from Mandaluyong College
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {newsArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-40"></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      {article.author}
                    </div>
                  </div>
                  <Link
                    href="#"
                    className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-2"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Upcoming Events
          </h2>
          <div className="space-y-4">
            {[
              { date: 'March 20, 2024', event: 'Spring Semester Orientation', time: '8:00 AM - 5:00 PM' },
              { date: 'March 25, 2024', event: 'College Fair 2024', time: '9:00 AM - 3:00 PM' },
              { date: 'April 5, 2024', event: 'Faculty Lecture Series', time: '2:00 PM - 4:00 PM' },
              { date: 'April 15, 2024', event: 'Student Awards Night', time: '6:00 PM - 9:00 PM' },
            ].map((event, index) => (
              <div
                key={index}
                className="bg-white border-l-4 border-blue-600 p-6 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-600 text-sm mb-1">{event.date}</p>
                  <h3 className="text-xl font-bold text-gray-900">{event.event}</h3>
                  <p className="text-gray-600 text-sm mt-1">{event.time}</p>
                </div>
                <Link
                  href="#"
                  className="text-blue-600 font-semibold hover:text-blue-800 transition"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
