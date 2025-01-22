import fs from 'fs';
import path from 'path';
import { Board } from '../types/board';
import { HomePage } from '@/components/HomePage';

async function getBoards(): Promise<Board[]> {
  const boardsDir = path.join(process.cwd(), 'src', 'data', 'boards');
  const files = fs.readdirSync(boardsDir);
  
  const boards: Board[] = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(boardsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });

  return boards;
}

export const dynamic = 'force-static';
export const revalidate = false;

export default async function Home() {
  const boards = await getBoards();
  
  return <HomePage initialBoards={boards} />;
}
