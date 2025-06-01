"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, BotIcon, Cpu, Pointer, Check } from "lucide-react";
import { baseUrl } from "@/lib/getBaseUrl";
import Image from "next/image";

interface ConnectModalProps {
  isOpen: boolean;
  onOpenChangeAction: (isOpen: boolean) => void;
  serverName: string;
}

type AppType = "mcp-client" | "claude-desktop" | "cursor";
type CommandRunner = "npx" | "bunx";

export function ConnectModal({
  isOpen,
  onOpenChangeAction,
  serverName,
}: ConnectModalProps) {
  const [selectedApp, setSelectedApp] = useState<AppType>("mcp-client");
  const [commandRunner, setCommandRunner] = useState<CommandRunner>("npx");
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${fieldName} copied to clipboard!`);
        setCopiedStates((prev) => ({ ...prev, [fieldName]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [fieldName]: false }));
        }, 2000);
      })
      .catch((err) => {
        toast.error("Could not copy text to clipboard.");
        console.error("Failed to copy text: ", err);
      });
  };

  const connectionConfig = useMemo(() => {
    if (!baseUrl || !serverName) return null;

    const mcpSseUrl = `${baseUrl}/mcp/${serverName}/sse`;
    const mcpBaseUrlForRemote = `${baseUrl}/mcp/${serverName}`;

    switch (selectedApp) {
      case "mcp-client":
        return {
          title: "MCP Client Chatbot",
          icon: <BotIcon className="mr-2 h-5 w-5" />,
          instructions: [
            {
              label: "Configuration JSON:",
              content: JSON.stringify({ url: mcpSseUrl }, null, 2),
              type: "code" as const,
            },
          ],
        };
      case "claude-desktop":
        return {
          title: "Claude Desktop",
          icon: (
            <Image
              src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/claude-icon.svg"
              alt="Claude Desktop Logo"
              width={20}
              height={20}
              className="mr-2 h-5 w-5"
            />
          ),
          instructions: [
            {
              label: "Configuration File Paths:",
              content:
                "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json\nWindows: %APPDATA%\\Claude\\claude_desktop_config.json",
              type: "filePath" as const,
            },
            {
              label: "Note:",
              content:
                "If the file or 'mcpRemoteLanguageServers' key does not exist yet, you may need to enable MCP server integration under Settings > Developer in Claude Desktop, or create them manually.",
              type: "note" as const,
            },
            {
              label: `Add to 'mcpRemoteLanguageServers' in claude_desktop_config.json:`,
              content: JSON.stringify(
                {
                  [serverName]: {
                    command: commandRunner,
                    args: ["mcp-remote", mcpBaseUrlForRemote],
                  },
                },
                null,
                2,
              ),
              type: "code" as const,
            },
          ],
        };
      case "cursor":
        return {
          title: "Cursor",
          icon: (
            <Image
              src="https://www.cursor.com/favicon.svg"
              alt="Cursor Logo"
              width={20}
              height={20}
              className="mr-2 h-5 w-5"
            />
          ),
          instructions: [
            {
              label: "Configuration Location:",
              content:
                "Find MCP server configuration in Cursor settings (often in settings.json under a key like 'cursor.mcpServers' or via the UI if available).",
              type: "note" as const,
            },
            {
              label: "Add to MCP Servers configuration:",
              content: JSON.stringify(
                {
                  mcpServers: {
                    [serverName]: {
                      url: mcpSseUrl,
                    },
                  },
                },
                null,
                2,
              ),
              type: "code" as const,
            },
          ],
        };
      default:
        return null;
    }
  }, [selectedApp, serverName, baseUrl, commandRunner]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Connect to "{serverName}"</DialogTitle>
          <DialogDescription>
            Select an application to view connection instructions. The base URL
            used is:{" "}
            <code className="rounded bg-muted px-1 font-mono">
              {baseUrl || "Loading..."}
            </code>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="app-select" className="col-span-1 text-right">
              Application
            </Label>
            <Select
              value={selectedApp}
              onValueChange={(value) => setSelectedApp(value as AppType)}
            >
              <SelectTrigger id="app-select" className="col-span-3">
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcp-client">
                  <div className="flex items-center">
                    <BotIcon className="mr-2 h-4 w-4" /> MCP Client Chatbot
                  </div>
                </SelectItem>
                <SelectItem value="claude-desktop">
                  <div className="flex items-center">
                    <Image
                      src="https://raw.githubusercontent.com/gilbarbara/logos/refs/heads/main/logos/claude-icon.svg"
                      alt="Claude Desktop Logo"
                      width={16}
                      height={16}
                      className="mr-2 h-4 w-4"
                    />{" "}
                    Claude Desktop
                  </div>
                </SelectItem>
                <SelectItem value="cursor">
                  <div className="flex items-center">
                    <Image
                      src="https://www.cursor.com/favicon.svg"
                      alt="Cursor Logo"
                      width={16}
                      height={16}
                      className="mr-2 h-4 w-4"
                    />{" "}
                    Cursor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedApp === "claude-desktop" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="command-runner" className="col-span-1 text-right">
                Runner
              </Label>
              <Select
                value={commandRunner}
                onValueChange={(value) =>
                  setCommandRunner(value as CommandRunner)
                }
              >
                <SelectTrigger id="command-runner" className="col-span-3">
                  <SelectValue placeholder="Select command runner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="npx">npx</SelectItem>
                  <SelectItem value="bunx">bunx</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {connectionConfig && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center text-lg font-semibold">
                {connectionConfig.icon} {connectionConfig.title}
              </div>
              {connectionConfig.instructions.map((item, index) => {
                const isCopied = copiedStates[item.label];
                return (
                  <div key={index} className="space-y-1">
                    <Label className="text-sm font-medium">{item.label}</Label>
                    {item.type === "code" ? (
                      <div className="group relative">
                        <pre className="overflow-x-auto rounded-md bg-muted p-3 pr-10 font-mono text-sm">
                          <code>{item.content}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-7 w-7 opacity-50 transition-opacity group-hover:opacity-100"
                          onClick={() =>
                            copyToClipboard(item.content, item.label)
                          }
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {isCopied ? "Copied" : "Copy"}
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                        {item.content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
