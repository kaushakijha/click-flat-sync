
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableSelectionProps {
  tables: string[];
  selectedTable: string;
  onSelect: (table: string) => void;
}

const TableSelection = ({ tables, selectedTable, onSelect }: TableSelectionProps) => {
  return (
    <div>
      {tables.length === 0 ? (
        <p className="text-gray-500">No tables available. Please check your connection.</p>
      ) : (
        <ScrollArea className="h-60 rounded-md border">
          <RadioGroup
            value={selectedTable}
            onValueChange={onSelect}
            className="p-4"
          >
            {tables.map((table) => (
              <div key={table} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={table} id={table} />
                <Label htmlFor={table} className="cursor-pointer">{table}</Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      )}
    </div>
  );
};

export default TableSelection;
