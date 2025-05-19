module.exports = {
  theme: {
    extend: {
      keyframes: {
        bounceOnce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
      },
      animation: {
        bounceOnce: 'bounceOnce 0.6s ease-in-out',
      },
    },
  },
};
