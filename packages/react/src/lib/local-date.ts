export function normalizeLocalDate(value: Date | null | undefined): Date | null {
  if (value == null || Number.isNaN(value.getTime())) return null;

  return createLocalDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
}

export function createLocalDate(year: number, month: number, day: number): Date {
  const value = new Date(0);
  value.setHours(0, 0, 0, 0);
  value.setFullYear(year, month - 1, day);
  return value;
}

export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = createLocalDate(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function formatLocalDate(value: Date | null | undefined): string {
  const date = normalizeLocalDate(value);
  if (!date) return '';

  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function compareLocalDates(left: Date, right: Date): number {
  const leftKey = formatLocalDate(left);
  const rightKey = formatLocalDate(right);
  return leftKey.localeCompare(rightKey);
}

export function isSameLocalDate(
  left: Date | null | undefined,
  right: Date | null | undefined,
): boolean {
  return formatLocalDate(left) === formatLocalDate(right);
}
