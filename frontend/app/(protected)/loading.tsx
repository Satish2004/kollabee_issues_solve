import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  )
}
