<<<<<<< HEAD
"use client";

import React, {
  useEffect,
  useState,
  useActionState,
  startTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { Server } from "@/lib/generated/prisma";
import {
  editServerAction,
  EditServerFormState,
} from "@/lib/actions/serverActions";
=======
'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Server } from '@/lib/generated/prisma';
import {
  editServerAction,
  EditServerFormState,
} from '@/lib/actions/serverActions';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
<<<<<<< HEAD
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
=======
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

interface EditServerModalProps {
  server: Server | null;
  isOpen: boolean;
  onCloseAction: () => void;
}

const initialState: EditServerFormState = {
  message: null,
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
<<<<<<< HEAD
      {pending ? "Saving..." : "Save Changes"}
=======
      {pending ? 'Saving...' : 'Save Changes'}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    </Button>
  );
}

export function EditServerModal({
  server,
  isOpen,
  onCloseAction,
}: EditServerModalProps) {
  const [formState, formAction] = useActionState(
    editServerAction,
    initialState,
  );
<<<<<<< HEAD
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const [argsString, setArgsString] = useState("[]");
=======
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [argsString, setArgsString] = useState('[]');
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

  useEffect(() => {
    if (server) {
      setName(server.name);
      setCommand(server.command);
      if (server.Args && server.Args.length > 0) {
        try {
          setArgsString(JSON.stringify(server.Args));
        } catch (e) {
<<<<<<< HEAD
          setArgsString("[]");
          toast.error(
            "Failed to parse existing arguments. Please review them.",
          );
        }
      } else {
        setArgsString("[]");
      }
    } else {
      setName("");
      setCommand("");
      setArgsString("[]");
=======
          setArgsString('[]');
          toast.error(
            'Failed to parse existing arguments. Please review them.',
          );
          return e as Error;
        }
      } else {
        setArgsString('[]');
      }
    } else {
      setName('');
      setCommand('');
      setArgsString('[]');
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    }
  }, [server]);

  useEffect(() => {
    if (formState.success) {
      if (formState.message) {
        toast.success(formState.message);
      }
      onCloseAction();
    } else if (formState.message && !formState.errors?._form) {
      toast.error(formState.message);
    }
  }, [formState, onCloseAction]);

  if (!isOpen || !server) {
    return null;
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onCloseAction();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!server) return;

<<<<<<< HEAD
    let processedArgsString = "";
    if (argsString.trim() !== "" && argsString.trim() !== "[]") {
      try {
        const parsedArgs = JSON.parse(argsString);
        if (Array.isArray(parsedArgs)) {
          processedArgsString = parsedArgs
            .map((arg) => String(arg))
            .join(",");
=======
    let processedArgsString = '';
    if (argsString.trim() !== '' && argsString.trim() !== '[]') {
      try {
        const parsedArgs = JSON.parse(argsString);
        if (Array.isArray(parsedArgs)) {
          processedArgsString = parsedArgs.map((arg) => String(arg)).join(',');
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
        } else {
          toast.error(
            'Arguments must be a valid JSON array. e.g., ["--port", "8080"]',
          );
          return;
        }
      } catch (e) {
        toast.error(
<<<<<<< HEAD
          "Invalid JSON format for Arguments. Please check your input.",
        );
        return;
=======
          'Invalid JSON format for Arguments. Please check your input.',
        );
        return e;
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      }
    }

    const formData = new FormData();
<<<<<<< HEAD
    formData.append("id", server.id);
    formData.append("name", name);
    formData.append("command", command);
    formData.append("argsString", processedArgsString);
=======
    formData.append('id', server.id);
    formData.append('name', name);
    formData.append('command', command);
    formData.append('argsString', processedArgsString);
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Server</DialogTitle>
          <DialogDescription>
            Make changes to your server configuration. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} key={server.id} className="space-y-4">
          <div>
            <Label htmlFor={`edit-name-${server.id}`}>Name</Label>
            <Input
              id={`edit-name-${server.id}`}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
            {formState.errors?.name && (
              <p className="mt-1 text-sm text-red-500">
<<<<<<< HEAD
                {formState.errors.name.join(", ")}
=======
                {formState.errors.name.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`edit-command-${server.id}`}>Command</Label>
            <Input
              id={`edit-command-${server.id}`}
              name="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              required
              className="mt-1"
            />
            {formState.errors?.command && (
              <p className="mt-1 text-sm text-red-500">
<<<<<<< HEAD
                {formState.errors.command.join(", ")}
=======
                {formState.errors.command.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`edit-argsString-${server.id}`}>
              Arguments (JSON array of strings)
            </Label>
            <Textarea
              id={`edit-argsString-${server.id}`}
              name="argsString"
              value={argsString}
              onChange={(e) => setArgsString(e.target.value)}
              placeholder='e.g., ["--port", "8080", "-v", "my value"]'
              rows={3}
              className="mt-1"
              aria-describedby={`edit-argsString-desc-${server.id}`}
            />
            <p
              id={`edit-argsString-desc-${server.id}`}
              className="mt-1 text-xs text-muted-foreground"
            >
<<<<<<< HEAD
              Enter arguments as a valid JSON array of strings. For example:{" "}
=======
              Enter arguments as a valid JSON array of strings. For example:{' '}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
              <code>{`["arg1", "arg2 with spaces", "--flag"]`}</code>
            </p>
            {formState.errors?.argsString && (
              <p className="mt-1 text-sm text-red-500">
<<<<<<< HEAD
                {formState.errors.argsString.join(", ")}
=======
                {formState.errors.argsString.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
              </p>
            )}
          </div>

          {formState.errors?._form && (
            <p className="text-center text-sm text-red-500">
<<<<<<< HEAD
              {formState.errors._form.join(", ")}
=======
              {formState.errors._form.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
            </p>
          )}
          {formState.message &&
            !formState.success &&
            !formState.errors?._form && (
              <p className="text-center text-sm text-red-500">
                {formState.message}
              </p>
            )}

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
