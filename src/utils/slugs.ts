export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with dash
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
    .replace(/--+/g, '-'); // Replace multiple dashes with single dash
}

export function createBoardSlug(manufacturer: string, boardName: string): string {
  return `${createSlug(manufacturer)}-${createSlug(boardName)}`;
}
