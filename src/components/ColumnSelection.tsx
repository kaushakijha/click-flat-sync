
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColumnSelectionProps {
  columns: { name: string; selected: boolean }[];
  onToggle: (columnName: string) => void;
}

const ColumnSelection = ({ columns, onToggle }: ColumnSelectionProps) => {
  return (
    <div>
      {columns.length === 0 ? (
        <p className="text-gray-500">No columns available. Please select a table.</p>
      ) : (
        <>
          <div className="mb-2 flex items-center gap-2">
            <Checkbox 
              id="select-all"
              checked={columns.every(col => col.selected)}
              onCheckedChange={() => {
                const allSelected = columns.every(col => col.selected);
                columns.forEach(col => {
                  if (allSelected) onToggle(col.name);
                });
                if (!allSelected) {
                  columns.forEach(col => {
                    if (!col.selected) onToggle(col.name);
                  });
                }
              }}
            />
            <Label htmlFor="select-all">Select All</Label>
          </div>
          
          <ScrollArea className="h-60 rounded-md border">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {columns.map((column) => (
                <div key={column.name} className="flex items-center space-x-2">
                  <Checkbox 
                    id={column.name}
                    checked={column.selected}
                    onCheckedChange={() => onToggle(column.name)}
                  />
                  <Label htmlFor={column.name} className="cursor-pointer">{column.name}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default ColumnSelection;
