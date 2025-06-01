<<<<<<< HEAD

import React from "react";
import { ServerListDisplayWrapper } from "@/components/manage-servers/ServerListDisplayWrapper";
import { AddServerDialogWrapper } from "@/components/manage-servers/AddServerDialogWrapper";
import { Separator } from "@/components/ui/separator";
import { getServersAction } from "@/lib/actions/serverActions";
import { Server } from "@/lib/generated/prisma";
=======
import React from 'react';
import { ServerListDisplayWrapper } from '@/components/manage-servers/ServerListDisplayWrapper';
import { AddServerDialogWrapper } from '@/components/manage-servers/AddServerDialogWrapper';
import { Separator } from '@/components/ui/separator';
import { getServersAction } from '@/lib/actions/serverActions';
import { Server } from '@/lib/generated/prisma';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

export default async function HomePage() {
  const servers: Server[] = await getServersAction();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Servers</h1>
          <p className="text-muted-foreground">
            Manage and connect to your MCP server instances.
          </p>
        </div>
        <AddServerDialogWrapper />
      </header>

      <Separator className="my-6" />

      <section>
        <ServerListDisplayWrapper initialServers={servers} />
      </section>
    </div>
  );
}
