type ThemeConfig = {
  colorScheme: 'dark'
  brandTokenName: string
  fontFamilies: {
    body: string
    display: string
  }
}

export const themeConfig = {
  colorScheme: 'dark',
  brandTokenName: '--color-brand',
  fontFamilies: {
    body: 'Barlow',
    display: 'Barlow Condensed',
  },
} satisfies ThemeConfig
