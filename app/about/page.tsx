export const metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About FleaHub</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What is FleaHub?</h2>
        <p className="text-gray-600 mb-4">
          FleaHub is a dedicated online marketplace designed specifically for
          university students to buy and sell second-hand items within their
          campus community. Our platform provides a safe, convenient, and
          efficient way to connect buyers and sellers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Trade</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">1.</span>
            <p className="text-gray-600">
              Sellers list their items with photos and details
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">2.</span>
            <p className="text-gray-600">
              Buyers browse or search for items they&apos;re interested in
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">3.</span>
            <p className="text-gray-600">
              Buyers contact sellers through our chat system
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">4.</span>
            <p className="text-gray-600">
              Arrange meetup at designated campus locations
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">5.</span>
            <p className="text-gray-600">
              Complete the face-to-face transaction safely
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Quick Location Selection</h3>
            <p className="text-gray-600">
              Choose from popular campus meetup spots for safe transactions
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Get instant updates on item availability and status
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Simple Appointment System</h3>
            <p className="text-gray-600">
              Easily schedule and manage your meetups
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Basic Chat Function</h3>
            <p className="text-gray-600">
              Communicate directly with buyers/sellers
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Category Filtering</h3>
            <p className="text-gray-600">
              Find what you need quickly with organized categories
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Safe Meeting Points</h2>
        <p className="text-gray-600 mb-2">
          For your safety and convenience, we recommend meeting at these
          locations:
        </p>
        <ul className="list-disc list-inside text-gray-600 ml-4">
          <li>University Library Entrance</li>
          <li>Student Center</li>
          <li>Main Campus Square</li>
          <li>Cafeteria</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Join Our Community</h2>
        <p className="text-gray-600 mb-4">
          Connect with us and other users through our social channels:
        </p>
        <div className="space-y-2">
          <p className="text-gray-600">🔗 Facebook Group</p>
          <p className="text-gray-600">🔗 INS</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-600">
          Have questions or suggestions? Feel free to reach out:
          <br />
          📧 support@fleahub.com
        </p>
      </section>
    </div>
  );
}
