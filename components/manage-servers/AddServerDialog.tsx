<<<<<<< HEAD
"use client";

import React from "react";
=======
'use client';

import React from 'react';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
<<<<<<< HEAD
} from "@/components/ui/dialog";
import { AddServerForm } from "./AddServerForm";
=======
} from '@/components/ui/dialog';
import { AddServerForm } from './AddServerForm';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

interface AddServerDialogProps {
  isOpen: boolean;
  onOpenChangeAction: (isOpen: boolean) => void;
}

export function AddServerDialog({
  isOpen,
  onOpenChangeAction,
}: AddServerDialogProps) {
  const handleFormSuccess = () => {
    onOpenChangeAction(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New MCP Server</DialogTitle>
          <DialogDescription>
            Define a new server. The server name will be used in connection URLs
            and must be unique.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddServerForm onFormSubmitSuccess={handleFormSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
