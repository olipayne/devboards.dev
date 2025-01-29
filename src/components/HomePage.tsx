'use client';

import Script from 'next/script';
import { ClientPage, BoardCard } from '@/components/ClientPage';
import Link from 'next/link';
import { createBoardSlug } from '@/utils/slugs';
import { filterBoards, FilterState } from '@/utils/filters';
import { useState, useEffect } from 'react';
import { Board } from '@/types/board';

interface HomePageProps {
  initialBoards: Board[];
}

// Helper functions for URL hash management
function encodeFilterState(state: FilterState): string {
  const cleanState = Object.fromEntries(
    Object.entries(state).filter(([ , value]) => {
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    })
  );
  return Object.keys(cleanState).length ? `#${btoa(JSON.stringify(cleanState))}` : '';
}

function decodeFilterState(hash: string): FilterState | null {
  if (!hash || hash === '#') return null;
  try {
    const decoded = JSON.parse(atob(hash.slice(1)));
    return {
      cpu: decoded.cpu || [],
      usb: decoded.usb || [],
      connectivity: decoded.connectivity || [],
      sensors: decoded.sensors || [],
      power: decoded.power || [],
      display: decoded.display || [],
      interfaces: decoded.interfaces || [],
      searchQuery: decoded.searchQuery || "",
    };
  } catch (e) {
    console.error('Failed to decode filter state from URL:', e);
    return null;
  }
}

export function HomePage({ initialBoards }: HomePageProps) {
  const [filterState, setFilterState] = useState<FilterState>(() => {
    // Initialize from URL hash if present
    if (typeof window !== 'undefined') {
      const hashState = decodeFilterState(window.location.hash);
      if (hashState) return hashState;
    }
    return {
      cpu: [],
      usb: [],
      connectivity: [],
      sensors: [],
      power: [],
      display: [],
      interfaces: [],
      searchQuery: "",
    };
  });

  // Update URL hash when filter state changes
  useEffect(() => {
    const newHash = encodeFilterState(filterState);
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash || window.location.pathname);
    }
  }, [filterState]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hashState = decodeFilterState(window.location.hash);
      if (hashState) {
        setFilterState(hashState);
      }
    };

    window.addEventListener('popstate', handleHashChange);
    return () => window.removeEventListener('popstate', handleHashChange);
  }, []);

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
