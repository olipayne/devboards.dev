'use client';

import Script from 'next/script';
import { ClientPage, BoardCard } from '@/components/ClientPage';
import Link from 'next/link';
import { createBoardSlug } from '@/utils/slugs';
import { filterBoards, FilterState } from '@/utils/filters';
import { useState } from 'react';
import { Board } from '@/types/board';

interface HomePageProps {
  initialBoards: Board[];
}

export function HomePage({ initialBoards }: HomePageProps) {
  const [filterState, setFilterState] = useState<FilterState>({
    cpu: [],
    usb: [],
    connectivity: [],
    sensors: [],
    power: [],
    display: [],
    interfaces: [],
    searchQuery: "",
  });
  
  const filteredBoards = filterBoards(initialBoards, filterState);
  
  // Create structured data for search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': filteredBoards.map((board, index) => ({
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
      <ClientPage 
        showFilter={true} 
        boards={initialBoards}
        filterState={filterState}
        onFilterChange={setFilterState}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
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
