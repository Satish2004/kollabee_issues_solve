const ProfileChart = () => {
  return (
    <div className="border rounded-md p-6 relative tour-profile-strength">
      <div className="mb-4">
        <h3 className="text-base font-medium mb-5">List to updates</h3>

        <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="15" />
          <circle cx="50" cy="50" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="15"
            stroke="#4338ca"
            strokeDasharray="251.2"
            strokeDashoffset="67.8"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="15"
            stroke="#e11d48"
            strokeDasharray="251.2"
            strokeDashoffset="67.8"
            transform="rotate(30 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="15"
            stroke="#fbbf24"
            strokeDasharray="251.2"
            strokeDashoffset="188.4"
            transform="rotate(190 50 50)"
          />
          <text x="50" y="55" textAnchor="middle" className="text-xl font-semibold">
            73%
          </text>
        </svg>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-900 mr-2"></div>
          <div className="text-sm">Company Details</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-700 mr-2"></div>
          <div className="text-sm">Personal Information</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-600 mr-2"></div>
          <div className="text-sm">Describe your brand</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-pink-600 mr-2"></div>
          <div className="text-sm">Certifications</div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 mr-2"></div>
          <div className="text-sm">Add details</div>
        </div>
      </div>
    </div>
  )
}

export default ProfileChart

