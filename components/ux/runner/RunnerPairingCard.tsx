import { Copy } from "lucide-react";
import { Button } from "../../ui/button.tsx";

export interface RunnerPairingCardProps {
  command: string;
  code?: string;
  expiresAt?: string;
  onCopy: () => void;
}

export function RunnerPairingCard({
  command,
  code,
  expiresAt,
  onCopy,
}: RunnerPairingCardProps) {
  return (
    <div className="bg-muted mt-4 space-y-2 rounded-md border p-3">
      <p className="text-sm font-medium">Run this command on your device</p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="bg-background min-w-0 flex-1 overflow-x-auto rounded border px-3 py-2 text-xs">
          {command}
        </code>
        <Button type="button" size="sm" variant="outline" onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </div>
      {code && (
        <p className="text-muted-foreground text-xs">
          Code {code}
          {expiresAt
            ? ` expires ${new Date(expiresAt).toLocaleTimeString()}.`
            : "."}
        </p>
      )}
    </div>
  );
}
