
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Database, FileText } from "lucide-react";

interface SourceSelectionProps {
  type: "source" | "target";
  selected: "clickhouse" | "flatfile" | null;
  onChange: (type: "clickhouse" | "flatfile") => void;
  disabledOption: "clickhouse" | "flatfile" | null;
}

const SourceSelection = ({ type, selected, onChange, disabledOption }: SourceSelectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select {type === "source" ? "Source" : "Target"} Type:</h3>
      <RadioGroup
        value={selected || ""}
        onValueChange={(value) => onChange(value as "clickhouse" | "flatfile")}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="clickhouse" 
            id={`${type}-clickhouse`} 
            disabled={disabledOption === "clickhouse"}
          />
          <Label htmlFor={`${type}-clickhouse`} className="flex items-center cursor-pointer">
            <Database className="h-5 w-5 mr-2" />
            ClickHouse
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="flatfile" 
            id={`${type}-flatfile`} 
            disabled={disabledOption === "flatfile"}
          />
          <Label htmlFor={`${type}-flatfile`} className="flex items-center cursor-pointer">
            <FileText className="h-5 w-5 mr-2" />
            Flat File
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SourceSelection;
