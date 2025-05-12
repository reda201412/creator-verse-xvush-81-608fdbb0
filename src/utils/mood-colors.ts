export const moodColors = {
  energetic: {
    primary: 'rgba(255, 124, 67, VAR_OPACITY)',
    secondary: 'rgba(255, 186, 71, VAR_OPACITY)',
    accent: 'rgba(255, 149, 0, VAR_OPACITY)',
  },
  calm: {
    primary: 'rgba(67, 182, 212, VAR_OPACITY)',
    secondary: 'rgba(107, 196, 255, VAR_OPACITY)',
    accent: 'rgba(142, 209, 252, VAR_OPACITY)',
  },
  creative: {
    primary: 'rgba(174, 122, 250, VAR_OPACITY)',
    secondary: 'rgba(238, 109, 220, VAR_OPACITY)',
    accent: 'rgba(218, 143, 255, VAR_OPACITY)',
  },
  focused: {
    primary: 'rgba(76, 110, 219, VAR_OPACITY)',
    secondary: 'rgba(90, 97, 195, VAR_OPACITY)',
    accent: 'rgba(43, 108, 176, VAR_OPACITY)',
  },
};

export const getMoodColors = (mood: string | null, opacityValue: number) => {
  const colorWithOpacity = (color: string) => {
    return color.replace('VAR_OPACITY', opacityValue.toString());
  };
  if (mood && moodColors[mood]) {
    return {
      primary: colorWithOpacity(moodColors[mood].primary),
      secondary: colorWithOpacity(moodColors[mood].secondary),
      accent: colorWithOpacity(moodColors[mood].accent),
    };
  } else {
    // Fallback colors if mood is not available or invalid
    return {
      primary: 'rgba(128, 128, 128, 0.8)',
      secondary: 'rgba(192, 192, 192, 0.8)',
      accent: 'rgba(211, 211, 211, 0.8)',
    };
  }
};
