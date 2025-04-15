import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableSelectionProps {
  tables: string[];
  selectedTables: string[];
  onSelect: (tables: string[]) => void;
}

export function TableSelection({
  tables,
  selectedTables,
  onSelect,
}: TableSelectionProps) {
  const handleTableToggle = (table: string) => {
    const newSelectedTables = selectedTables.includes(table)
      ? selectedTables.filter((t) => t !== table)
      : [...selectedTables, table];
    onSelect(newSelectedTables);
  };

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {tables.map((table) => (
          <div key={table} className="flex items-center space-x-2">
            <Checkbox
              id={table}
              checked={selectedTables.includes(table)}
              onCheckedChange={() => handleTableToggle(table)}
            />
            <label
              htmlFor={table}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {table}
            </label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
