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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
      {pending ? "Saving..." : "Save Changes"}
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
  const [name, setName] = useState("");
  const [command, setCommand] = useState("");
  const [argsString, setArgsString] = useState("[]");

  useEffect(() => {
    if (server) {
      setName(server.name);
      setCommand(server.command);
      if (server.Args && server.Args.length > 0) {
        try {
          setArgsString(JSON.stringify(server.Args));
        } catch (e) {
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

    let processedArgsString = "";
    if (argsString.trim() !== "" && argsString.trim() !== "[]") {
      try {
        const parsedArgs = JSON.parse(argsString);
        if (Array.isArray(parsedArgs)) {
          processedArgsString = parsedArgs
            .map((arg) => String(arg))
            .join(",");
        } else {
          toast.error(
            'Arguments must be a valid JSON array. e.g., ["--port", "8080"]',
          );
          return;
        }
      } catch (e) {
        toast.error(
          "Invalid JSON format for Arguments. Please check your input.",
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", server.id);
    formData.append("name", name);
    formData.append("command", command);
    formData.append("argsString", processedArgsString);

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
                {formState.errors.name.join(", ")}
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
                {formState.errors.command.join(", ")}
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
              Enter arguments as a valid JSON array of strings. For example:{" "}
              <code>{`["arg1", "arg2 with spaces", "--flag"]`}</code>
            </p>
            {formState.errors?.argsString && (
              <p className="mt-1 text-sm text-red-500">
                {formState.errors.argsString.join(", ")}
              </p>
            )}
          </div>

          {formState.errors?._form && (
            <p className="text-center text-sm text-red-500">
              {formState.errors._form.join(", ")}
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
}