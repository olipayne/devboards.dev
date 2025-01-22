import fs from 'fs';
import path from 'path';
import { Board } from '@/types/board';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createBoardSlug } from '@/utils/slugs';
import { ClientPage } from '@/components/ClientPage';
import { Metadata } from 'next';

async function getAllBoards(): Promise<Board[]> {
  const boardsDir = path.join(process.cwd(), 'src', 'data', 'boards');
  const files = fs.readdirSync(boardsDir);
  
  return files
    .filter(file => file.endsWith('.json') && file !== 'template.json')
    .map(file => {
      const filePath = path.join(boardsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });
}

async function getBoard(slug: string): Promise<Board | null> {
  const boards = await getAllBoards();
  return boards.find(board => 
    createBoardSlug(board.manufacturer, board.name) === decodeURIComponent(slug)
  ) || null;
}

export async function generateStaticParams() {
  const boards = await getAllBoards();
  
  return boards.map((board) => ({
    slug: createBoardSlug(board.manufacturer, board.name),
  }));
}

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  // Await the params object
  const { params } = await Promise.resolve(props);
  const board = await getBoard(params.slug);
  
  if (!board) {
    return {
      title: 'Board Not Found',
    };
  }

  return {
    title: `${board.name} by ${board.manufacturer}`,
    description: `${board.name} development board with ${board.cpu.model} processor. Learn about specifications, features, and where to buy.`,
    openGraph: {
      title: `${board.name} by ${board.manufacturer}`,
      description: `${board.name} development board with ${board.cpu.model} processor. Learn about specifications, features, and where to buy.`,
    },
  };
}

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BoardPage(props: PageProps) {
  // Await the params object
  const { params } = await Promise.resolve(props);
  const board = await getBoard(params.slug);
  
  if (!board) {
    notFound();
  }

  return (
    <ClientPage showFilter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {board.urls?.image && (
              <div className="relative aspect-square">
                <Image
                  src={board.urls.image}
                  alt={`${board.name} development board`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-2">{board.name}</h1>
            <p className="text-xl text-muted-foreground mb-6">by {board.manufacturer}</p>
            
            {board.price && (
              <p className="text-2xl font-semibold mb-6">${board.price.toFixed(2)}</p>
            )}
            
            {board.urls?.purchase && (
              <a
                href={board.urls.purchase}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors mb-8"
              >
                Buy Now
              </a>
            )}
            
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">CPU Specifications</h2>
                <dl className="grid grid-cols-2 gap-2">
                  <dt className="font-medium">Model</dt>
                  <dd>{board.cpu.model}</dd>
                  <dt className="font-medium">Architecture</dt>
                  <dd>{board.cpu.architecture}</dd>
                  <dt className="font-medium">Frequency</dt>
                  <dd>{board.cpu.frequency}MHz</dd>
                  <dt className="font-medium">Cores</dt>
                  <dd>{board.cpu.cores}</dd>
                </dl>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">Memory</h2>
                <dl className="grid grid-cols-2 gap-2">
                  <dt className="font-medium">RAM</dt>
                  <dd>{board.memory.ram}KB</dd>
                  <dt className="font-medium">Flash</dt>
                  <dd>{board.memory.flash}KB</dd>
                </dl>
              </section>
              
              {board.features && board.features.length > 0 && (
                <section>
                  <h2 className="text-2xl font-semibold mb-3">Features</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {board.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </section>
              )}
              
              {board.description && (
                <section>
                  <h2 className="text-2xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground">{board.description}</p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientPage>
  );
}
