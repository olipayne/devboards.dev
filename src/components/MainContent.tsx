import { Board } from '@/types/board';
import { BoardCard } from './BoardCard';
import { FilterState, filterBoards } from '@/utils/filters';

interface MainContentProps {
  boards: Board[];
  filters: FilterState;
}

export function MainContent({ boards = [], filters }: MainContentProps) {
  const filteredBoards = filterBoards(boards || [], filters);
  
  if (!boards?.length) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">
          Loading boards...
        </p>
      </div>
    );
  }
  
  if (filteredBoards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">
          No boards match your current filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBoards.map((board) => (
          <BoardCard key={`${board.manufacturer}-${board.name}`} board={board} />
        ))}
      </div>
    </div>
  );
}
