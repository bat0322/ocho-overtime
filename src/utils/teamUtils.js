export const getTeamColors = (teamName) => {
  const colorMap = {
    'Bonnies NIL Collective': { primary: '#66372B', secondary: '#E6CA97' }, // Brown/Gold
    'Chickenhawks': { primary: '#4C7239', secondary: '#FFFFFF' }, // Green/White
    'Frankchester United': { primary: '#ED88E1', secondary: '#FBE64D' }, // Pink/Yellow
    'Herbstreit Vick Pet Clinic': { primary: '#001F5D', secondary: '#ECCF65' }, // Blue/Yellow
    'Hive Mind': { primary: '#F4CB54', secondary: '#000000' }, // Gold/Black
    'Humongous Melonheads': { primary: '#39C3A4', secondary: '#C6EBB0' }, // Teal/Light Green
    'Hypnotoads': { primary: '#6A288B', secondary: '#3D1848' }, // Purple/Dark Purple
    'Lick My Qualls': { primary: '#EA3324', secondary: '#FFFFFF' }, // Red/White
    'Mentally Illest': { primary: '#EA983F', secondary: '#FFFFFF' }, // Orange/White
    'Night Pandas': { primary: '#000000', secondary: '#65A542' }, // Black/Green
    'Pool Boy': { primary: '#A32E2D', secondary: '#0E224A' }, // Red/Dark Blue
    'Scarlet Knights': { primary: '#CE4146', secondary: '#D1D1D1' }, // Red/Light Gray
    'Simple Jacks': { primary: '#882111', secondary: '#F5C242' } // Dark Red/Gold
  };
  return colorMap[teamName] || { primary: '#3498db', secondary: '#2980b9' };
};

export const getTeamLogo = (teamName) => {
  const logoMap = {
    'Bonnies NIL Collective': 'bonnies_nil_collective_logo.png',
    'Chickenhawks': 'chickenhawks_logo.png',
    'Frankchester United': 'frankchester_logo.png',
    'Herbstreit Vick Pet Clinic': 'herbstreit_vick_pet_clinic_logo.png',
    'Hive Mind': 'hive_mind_logo.png',
    'Humongous Melonheads': 'humongous_melonheads_logo.png',
    'Hypnotoads': 'hypnotoads_logo.png',
    'Lick My Qualls': 'lick_my_qualls_logo.png',
    'Mentally Illest': 'mentally_illest_logo.png',
    'Night Pandas': 'night_pandas_logo.png',
    'Pool Boy': 'pool_boy_logo.png',
    'Scarlet Knights': 'scarlet_knights_logo.png',
    'Simple Jacks': 'simple_jacks_logo.png'
  };
  return logoMap[teamName] || null;
};

// Convert hex color to RGB values
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
};
