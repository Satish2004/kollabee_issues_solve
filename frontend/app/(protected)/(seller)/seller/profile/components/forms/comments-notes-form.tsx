"use client"

import { Textarea } from "@/components/ui/textarea"

type CommentsNotesFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const CommentsNotesForm = ({ formState, onChange, onSave, hasChanges, isSaving }: CommentsNotesFormProps) => {
  const handleNotesChange = (value: string) => {
    onChange({ ...formState, notes: value })
  }

  return (
    <div className="mb-4">
      <div className="flex items-center font-semibold">
        <h3 className="text-sm">Enter Notes</h3>
        <span className="text-red-500 ml-0.5">*</span>
      </div>
      <Textarea
        placeholder="Type Here"
        value={formState.notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        className="border border-gray-200 p-2 w-full rounded text-sm min-h-[150px]"
      />
    </div>
  )
}

export default CommentsNotesForm

