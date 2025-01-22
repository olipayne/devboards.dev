import fs from 'fs';
import path from 'path';
import { Board } from '../types/board';
import Script from 'next/script';
import { ClientPage, BoardCard } from '@/components/ClientPage';
import Link from 'next/link';
import { createBoardSlug } from '@/utils/slugs';

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
  
  // Create structured data for search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': boards.map((board, index) => ({
      '@type': 'Product',
      'position': index + 1,
      'name': board.name,
      'description': `${board.name} development board with ${board.cpu.model} processor`,
      'brand': {
        '@type': 'Brand',
        'name': board.manufacturer
      },
      ...(board.price && {
        'offers': {
          '@type': 'Offer',
          'price': board.price.toFixed(2),
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': board.urls.purchase
        }
      })
    }))
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ClientPage showFilter={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={`${board.manufacturer}-${board.name}`}
              href={`/board/${createBoardSlug(board.manufacturer, board.name)}`}
              className="group"
            >
              <BoardCard board={board} />
            </Link>
          ))}
        </div>
      </ClientPage>
    </>
  );
}
