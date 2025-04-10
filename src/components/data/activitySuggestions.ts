interface Activity {
  title: string;
  description: string;
  time?: number;
}

const activitySuggestions: Record<string, Activity[]> = {
    happy: [
      {
        title: "Dance Party",
        description:
          "Turn up your favorite music and dance like nobody's watching!",
      },
      {
        title: "Gratitude Journal",
        description: "Write down 5 things you're grateful for today.",
      },
      {
        title: "Random Acts of Kindness",
        description: "Do something nice for someone else to spread the joy.",
      },
      {
        title: "Creative Project",
        description: "Start a fun art project or craft that makes you smile.",
      },
      {
        title: "Nature Walk",
        description: "Take a walk outside and appreciate the beauty around you.",
      },
      {
        title: "Call a Friend",
        description: "Share your good mood with someone you care about.",
      },
      {
        title: "Photo Album Time",
        description: "Look through old happy photos or create a new digital album.",
      },
      {
        title: "Compliment Chain",
        description: "Compliment three people today and watch the positivity spread.",
      },
      
    ],
    sad: [
      {
        title: "Comfort Movie",
        description: "Watch a favorite film that always lifts your spirits.",
      },
      {
        title: "Gentle Movement",
        description: "Try some light yoga or stretching to release tension.",
      },
      {
        title: "Cozy Reading",
        description: "Curl up with a good book and a warm drink.",
      },
      {
        title: "Mindful Breathing",
        description:
          "Practice deep breathing for a few minutes to center yourself.",
      },
      {
        title: "Soothing Music",
        description: "Listen to calming music that resonates with you.",
      },
      {
        title: "Warm Bath",
        description: "Take a relaxing bath with essential oils or bath salts.",
      },
      {
        title: "Tear It Out",
        description: "Let yourself cry. Tears are a natural way for the body to release sadness.",
      },
      {
        title: "Memory Lane Walk",
        description: "Take a walk to a place that holds a good memory and reflect gently.",
      },
      {
        title: "Self-Compassion Meditation",
        description: "Try a guided meditation focused on kindness toward yourself.",
      },
      {
        title: "Create a Comfort Box",
        description: "Fill a box with things that make you feel safe and supported — photos, scents, notes, or textures.",
      },
      {
        title: "Watch the Sky",
        description: "Sit somewhere quiet and just watch the clouds or stars — let your mind rest.",
      },
      
    ],
    angry: [
      {
        title: "Physical Release",
        description:
          "Go for a run or do some high-intensity exercise to release energy.",
      },
      {
        title: "Journaling",
        description: "Write down your thoughts to process your feelings.",
      },
      {
        title: "Stress Ball",
        description:
          "Squeeze a stress ball or punch a pillow to release tension safely.",
      },
      {
        title: "Deep Breathing",
        description: "Practice 4-7-8 breathing to calm your nervous system.",
      },
      {
        title: "Nature Break",
        description: "Step outside for fresh air and a change of scenery.",
      },
      {
        title: "Progressive Relaxation",
        description:
          "Tense and release each muscle group to release physical tension.",
      },
      {
        title: "Scream Therapy (Safely)",
        description: "Let out a scream into a pillow or secluded place to release anger.",
      },
      {
        title: "Cold Splash",
        description: "Splash cold water on your face to reset your body and mind.",
      },
      
    ],
    surprised: [
      {
        title: "Mindful Moment",
        description: "Take a moment to ground yourself and process the surprise.",
      },
      {
        title: "Creative Expression",
        description:
          "Channel your energy into drawing or writing about your feelings.",
      },
      {
        title: "Curiosity Exploration",
        description: "Learn something new about a topic that interests you.",
      },
      {
        title: "Spontaneous Adventure",
        description: "Do something unplanned but fun to embrace the unexpected.",
      },
      {
        title: "Photo Walk",
        description:
          "Take photos of interesting things you normally wouldn't notice.",
      },
      {
        title: "New Recipe",
        description: "Try cooking something you've never made before.",
      },
      {
        title: "Voice Memo Journaling",
        description: "Record your initial thoughts to process the moment.",
      },
      {
        title: "Surprise Someone Else",
        description: "Turn the energy around and plan a small surprise for a friend.",
      },
      
    ],
    neutral: [
      {
        title: "Skill Building",
        description:
          "Learn something new or practice a skill you've been wanting to improve.",
      },
      {
        title: "Declutter Space",
        description:
          "Organize a small area of your home for a sense of accomplishment.",
      },
      {
        title: "Mindful Walking",
        description: "Take a walk and pay attention to all your senses.",
      },
      {
        title: "Goal Setting",
        description: "Reflect on your goals and plan some next steps.",
      },
      {
        title: "Podcast Time",
        description: "Listen to an interesting podcast on a topic you enjoy.",
      },
      {
        title: "People Watching",
        description: "Sit in a public place and observe the world around you.",
      },
      {
        title: "Digital Detox",
        description: "Take a short break from screens to reset your mind.",
      },
      {
        title: "Tea Time",
        description: "Make a cup of tea and enjoy it with no distractions.",
      },
      
    ],

    fear: [
      {
        title: "Grounding Exercise",
        description:
          "Practice the 5-4-3-2-1 technique to ground yourself in the present.",
      },
      {
        title: "Calming Visualization",
        description: "Imagine a peaceful place where you feel safe and secure.",
      },
      {
        title: "Gentle Stretching",
        description: "Release tension with slow, gentle stretches.",
      },
      {
        title: "Support Call",
        description: "Call a trusted friend or family member for support.",
      },
      {
        title: "Comfort Object",
        description:
          "Hold or use an object that brings you comfort and security.",
      },
      {
        title: "Positive Affirmations",
        description: "Repeat calming affirmations that help you feel safe.",
      },
      {
        title: "Slow Rocking",
        description: "Sit and gently rock yourself to soothe your nervous system.",
      },
      {
        title: "Create a Safety Plan",
        description: "Write down steps that help you feel more in control.",
      },
      
    ],
    disgust: [
      {
        title: "Fresh Air",
        description:
          "Open windows or go outside for fresh air to clear your mind.",
      },
      {
        title: "Clean Space",
        description:
          "Tidy up your immediate environment to create a fresh feeling.",
      },
      {
        title: "Pleasant Scents",
        description: "Use essential oils or candles with scents you enjoy.",
      },
      {
        title: "Hand Washing Ritual",
        description: "Practice mindful hand washing as a cleansing ritual.",
      },
      {
        title: "Fresh Outfit",
        description: "Change into clean, comfortable clothes to refresh your body.",
      },
      {
        title: "Mental Cleanse",
        description: "Write down negative thoughts and rip up the paper to release them.",
      },      
      {
        title: "Sensory Reset",
        description:
          "Focus on pleasant textures, sounds, or visuals to reset your senses.",
      },
      {
        title: "Boundary Setting",
        description:
          "Reflect on and write down healthy boundaries you want to maintain.",
      },
    ],
  };
  
export default activitySuggestions;
  