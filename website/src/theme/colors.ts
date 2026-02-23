const colors = {
	// Theme
	themeColor: '#16a34a',
	themeColorLight: '#22c55e',
	themeColorDark: '#15803d',

	// Neutrals
	white: '#ffffff',
	black: '#000000',
	gray: '#9ca3af',
	lightGray: '#e2e8f0',
	slateGray: '#64748b',
	mutedGrey: '#9e9e9e',
	disGray: '#bdbdbd',
	steelGray: '#607d8b',

	// Status
	red: '#ef4444',
	blue: '#3b82f6',
	green: '#16a34a',
	yellow: '#f59e0b',
} as const

export type ColorKey = keyof typeof colors

export default colors
