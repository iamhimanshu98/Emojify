interface MoodFact {
  fact: string;
  source?: string;
}

interface MoodFactsProps {
  emotion: string | null;
}

const moodFacts: Record<string, MoodFact[]> = {
  happy: [
    {
      fact: "Smiling can boost your immune system and reduce stress hormones.",
      source: "Psychology Today",
    },
    {
      fact: "Happy people tend to have stronger social connections and relationships.",
      source: "Harvard Health",
    },
  ],
  sad: [
    {
      fact: "Sadness can actually improve memory and judgment in certain situations.",
      source: "Psychological Science",
    },
    {
      fact: "Expressing sadness through art or writing can have therapeutic benefits.",
      source: "Journal of Psychology",
    },
  ],
  angry: [
    {
      fact: "The body's fight-or-flight response during anger can last up to 30 minutes.",
      source: "American Psychological Association",
    },
    {
      fact: "Controlled anger can sometimes motivate positive social change.",
      source: "Social Psychology Quarterly",
    },
  ],
  neutral: [
    {
      fact: "A neutral emotional state can enhance logical decision-making.",
      source: "Cognitive Science Journal",
    },
    {
      fact: "Emotional neutrality is valued differently across cultures.",
      source: "Cultural Psychology Review",
    },
  ],
  // Add facts for other emotions
};

export function MoodFacts({ emotion }: MoodFactsProps) {
  const currentFacts = emotion ? moodFacts[emotion.toLowerCase()] || moodFacts.neutral : moodFacts.neutral;

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Did You Know?</h3>
      <div className="space-y-4">
        {currentFacts.map((fact, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-200">{fact.fact}</p>
            {fact.source && (
              <p className="text-sm text-gray-400 mt-2">Source: {fact.source}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}