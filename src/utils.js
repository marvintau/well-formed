export const colorToStyle = (color) => {

    return color
    ? {
      borderColor: `var(--${color})`,
      color: `var(--${color})`,
      background: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), var(--${color}) `,
    }
    : {};
  }
  