<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddServerDialog } from "./AddServerDialog";
import { PlusCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle"; 
=======
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddServerDialog } from './AddServerDialog';
import { PlusCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

export function AddServerDialogWrapper() {
  const [isAddServerModalOpen, setIsAddServerModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => setIsAddServerModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add MCP Server
      </Button>
      <AddServerDialog
        isOpen={isAddServerModalOpen}
        onOpenChangeAction={setIsAddServerModalOpen}
      />
<<<<<<< HEAD
      <ThemeToggle  />{" "}
    </div>
  );
}
=======
      <ThemeToggle />{' '}
    </div>
  );
}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
