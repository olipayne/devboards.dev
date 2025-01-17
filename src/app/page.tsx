import fs from 'fs';
import path from 'path';
import { Board } from '../types/board';
import { MainContent } from '../components/MainContent';

function getBoards(): Board[] {
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

export default function Home() {
  const boards = getBoards();
  
  return <MainContent initialBoards={boards} />;
}
