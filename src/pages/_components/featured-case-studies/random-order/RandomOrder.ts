type RandomSource = () => number;

export function shuffled<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = result[index] as T;

    result[index] = result[swapIndex] as T;
    result[swapIndex] = current;
  }

  return result;
}
