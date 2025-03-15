export function StatsCard() {
    return (
      <div className="bg-gradient-to-r from-[#e2105d] to-[#fca534] max-w-4xl text-white px-8 py-20 rounded-xl h-full">
        <h3 className="text-2xl font-semibold h-20 mb-4 text-center">
          Your Brand Deserves a Bold Online Presence
        </h3>
        <p className="text-normal mb-8 text-center ">
          In today's digital world, standing out is essential. We create websites that are not only beautiful but also
          built to grow with your business and engage your audience.
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">5.6M+</div>
            <div className="text-sm opacity-90">Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold">3.2+</div>
            <div className="text-sm opacity-90">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold">4.9</div>
            <div className="text-sm opacity-90">Ratings</div>
          </div>
        </div>
      </div>
    )
  }
  
  