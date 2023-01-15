export const asyncDelayMs = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
