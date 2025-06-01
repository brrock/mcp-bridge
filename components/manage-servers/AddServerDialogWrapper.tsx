"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddServerDialog } from "./AddServerDialog";
import { PlusCircle } from "lucide-react";

export function AddServerDialogWrapper() {
  const [isAddServerModalOpen, setIsAddServerModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsAddServerModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add MCP Server
      </Button>
      <AddServerDialog
        isOpen={isAddServerModalOpen}
        onOpenChangeAction={setIsAddServerModalOpen}
      />
    </>
  );
}
