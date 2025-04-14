
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FlatFileConfigProps {
  config: {
    fileName: string;
    delimiter: string;
  };
  onChange: (config: any) => void;
}

const FlatFileConfig = ({ config, onChange }: FlatFileConfigProps) => {
  const [fileName, setFileName] = useState<string>("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onChange({ ...config, fileName: file.name });
    }
  };
  
  const handleDelimiterChange = (value: string) => {
    onChange({ ...config, delimiter: value });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <div className="flex items-center">
          <Input
            id="fileName"
            value={fileName}
            readOnly
            placeholder="No file selected"
            className="rounded-r-none"
          />
          <Button
            type="button"
            className="rounded-l-none"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse
          </Button>
          <Input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.tsv,.txt"
          />
        </div>
        <p className="text-sm text-gray-500">Supported formats: CSV, TSV, TXT</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="delimiter">Delimiter</Label>
        <Select 
          value={config.delimiter} 
          onValueChange={handleDelimiterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select delimiter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=",">Comma (,)</SelectItem>
            <SelectItem value="\t">Tab</SelectItem>
            <SelectItem value=";">Semicolon (;)</SelectItem>
            <SelectItem value="|">Pipe (|)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FlatFileConfig;
