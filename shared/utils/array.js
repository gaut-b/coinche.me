export const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const random = a => {
  return a[Math.floor(Math.random() * a.length)];
}

export const first = a => a[0];
export const last = a => a[a.length - 1];