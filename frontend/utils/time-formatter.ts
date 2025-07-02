export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return ""

  const now = new Date()
  const diffMs = now.getTime() - lastSaved.getTime()
  const diffMins = Math.round(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins === 1) return "1 minute ago"
  if (diffMins < 60) return `${diffMins} minutes ago`

  const hours = lastSaved.getHours()
  const minutes = lastSaved.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`
}
