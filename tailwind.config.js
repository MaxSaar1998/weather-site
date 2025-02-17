export default {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Ensure these paths match your project structure
    ],
    mode: 'jit',
    theme: {
      extend: {
        colors: {
          // These arent working for some reason
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          backgroundLight:'var(--background-light-color)',
          backgroundDark:'var(--background-dark-color)',
          //backgroundBox:'var(--background-box-color)',
        },
        /*screens: {
          'xs': '480px', // Not working for some reason
        }*/
      },
    },
    plugins: [],
  };