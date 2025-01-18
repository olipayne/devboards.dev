import { Board } from "@/types/board";
import { FilterState, filterBoards } from "@/utils/filters";
import { BoardCard } from "@/components/BoardCard";

interface MainContentProps {
  boards: Board[];
  filters: FilterState;
}

export function MainContent({ boards = [], filters }: MainContentProps) {
  const filteredBoards = filterBoards(boards, filters);

  if (boards.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground dark:text-muted-foreground-dark">
        Loading boards...
      </div>
    );
  }

  if (filteredBoards.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground dark:text-muted-foreground-dark">
        No boards match your filters. Try adjusting your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredBoards.map((board) => (
        <BoardCard 
          key={`${board.manufacturer}-${board.name}`} 
          board={board} 
        />
      ))}
    </div>
  );
}
