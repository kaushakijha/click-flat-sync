
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClickHouseConfigProps {
  config: {
    host: string;
    port: string;
    database: string;
    user: string;
    jwtToken: string;
  };
  onChange: (config: any) => void;
}

const ClickHouseConfig = ({ config, onChange }: ClickHouseConfigProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...config, [name]: value });
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            name="host"
            value={config.host}
            onChange={handleInputChange}
            placeholder="e.g., localhost"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            name="port"
            value={config.port}
            onChange={handleInputChange}
            placeholder="e.g., 9440 (https) or 8123 (http)"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>
        <Input
          id="database"
          name="database"
          value={config.database}
          onChange={handleInputChange}
          placeholder="Database name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user">User</Label>
        <Input
          id="user"
          name="user"
          value={config.user}
          onChange={handleInputChange}
          placeholder="Username"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="jwtToken">JWT Token</Label>
        <Input
          id="jwtToken"
          name="jwtToken"
          value={config.jwtToken}
          onChange={handleInputChange}
          type="password"
          placeholder="JWT Token for authentication"
        />
      </div>
    </div>
  );
};

export default ClickHouseConfig;
