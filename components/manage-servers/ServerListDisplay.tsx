"use client";
import React, { useState } from "react";
import { Server } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Settings2, PlugZap } from "lucide-react";
import { EditServerModal } from "./EditServerModal";
interface ServerListDisplayProps {
  servers: Server[];
  onConnectAction: (server: Server) => void;
}

export function ServerListDisplay({
  servers,
  onConnectAction,
}: ServerListDisplayProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);

  const handleEditClick = (server: Server) => {
    setEditingServer(server);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingServer(null);
  };

  if (servers.length === 0) {
    return (
      <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-muted-foreground">
          No MCP Servers Found
        </h3>
        <p className="mt-1 text-muted-foreground">
          Click the "Add MCP Server" button to configure your first server.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {servers.map((server) => (
          <Card key={server.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">
                  {server.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditClick(server)}
                  className="h-7 w-7 flex-shrink-0 p-0" // Adjusted for better fit
                >
                  <Settings2 className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <CardDescription className="mt-1">
                Runs: <Badge variant="outline">{server.command}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {server.Args && server.Args.length > 0 ? (
                <div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    Arguments:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {server.Args.map((arg, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="max-w-[150px] truncate text-xs"
                        title={arg}
                      >
                        {arg}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No arguments.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => onConnectAction(server)}
              >
                <PlugZap className="mr-2 h-4 w-4" /> Connect
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingServer && (
        <EditServerModal
          server={editingServer}
          isOpen={isEditModalOpen}
          onCloseAction={handleCloseEditModal}
        />
      )}
    </>
  );
}