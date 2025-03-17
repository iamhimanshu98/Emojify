export const HinglishConverter = (text: string): string => {
    const translitMap: { [key: string]: string } = {
      "नमस्ते": "namaste",
      "कैसे हो": "kaise ho",
      "मैं ठीक हूँ": "mein thik hu",
      "आप कैसे हैं": "aap kaise hain",
      "मुझे अच्छा लग रहा है": "mujhe accha lag raha hai",
      "धन्यवाद": "dhanyavad",
      "हैलो":"hello",
    };
  
    return text
      .split(" ")
      .map((word) => translitMap[word] || word) // Replace Hindi with Hinglish
      .join(" ");
  };
  