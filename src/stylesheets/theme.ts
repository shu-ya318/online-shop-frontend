export const vuetifyConfig = {
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // White
          background: '#FFFFFF',
          surface: '#FCFCFC',
          // Gray
          primary: '#191919', // Gray-9
          secondary: '#666666', //Gray-6
          info: '#999999', //Gray-4
          // Green
          accent: '#2C742F', // Dark
          success: '#17b71d', // Light
          // Orange
          warning: '#FF8A00',
          // Red
          error: '#EA4B48',
        },
      },
    },
  },
  defaults: {
    global: {
      style: `font-family: '"Roboto", "Noto Sans TC", sans-serif'`,
    },
    // Button
    VBtn: {
      block: false,
      variant: 'flat',
      rounded: 'xl',
      style: `
        font-size: 1rem;
        font-weight: 500;
        text-transform: none;
      `,
    },
    // Card
    VCard: {
      rounded: 'lg',
      color: 'surface',
      elevation: 0,
    },
    VCardTitle: {
      class: 'text-primary',
      style: 'padding: 0;',
    },
    VCardText: {
      class: 'text-body-1 text-secondary',
      style: 'padding: 0;',
    },
    VCardActions: {
      VBtn: {
        variant: 'flat',
        style: `padding: 0;
        text-transform: none; `,
      },
    },
    // Dialog
    VDialog: {
      rounded: 'lg',
    },
    // Menu list item
    VListItem: {
      color: 'info',
      style: `
        font-size: 1rem;
        font-weight: 400;
      `,
    },
    VListItemTitle: {
      style: `
        font-size: 1rem;
        font-weight: 400;
      `,
    },
  },
}
