import { FontPairingSuggester } from "@/components/font-pairing-suggester"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Font Pairing Suggester</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a primary font and discover complementary pairings that work well together for your design projects.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Fonts are loaded dynamically from Google Fonts for preview purposes.
          </p>
        </header>
        <FontPairingSuggester />
      </div>
    </main>
  )
}

