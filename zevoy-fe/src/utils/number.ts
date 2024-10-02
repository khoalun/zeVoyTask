export function formatAmount(num: number): string {
  if (num < 1_000_000_000) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else if (num < 1_000_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(0)}B`; // Format in billions
  } else {
    return `${(num / 1_000_000_000_000).toFixed(0)}T`; // Format in trillions
  }
}
