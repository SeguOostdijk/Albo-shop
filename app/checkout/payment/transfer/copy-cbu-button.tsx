"use client"

export default function CopyCbuButton() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("0110464040046411693330")
      alert("CBU copiado")
    } catch {
      alert("No se pudo copiar el CBU")
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full mb-4 rounded-md border py-2 text-sm"
    >
      Copiar CBU
    </button>
  )
}