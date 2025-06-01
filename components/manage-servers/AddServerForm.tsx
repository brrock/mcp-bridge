<<<<<<< HEAD
"use client";

import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  addServerAction,
  AddServerFormState,
} from "@/lib/actions/serverActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
=======
'use client';

import React, { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  addServerAction,
  AddServerFormState,
} from '@/lib/actions/serverActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

interface AddServerFormProps {
  onFormSubmitSuccess?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding Server...
        </>
      ) : (
<<<<<<< HEAD
        "Add Server"
=======
        'Add Server'
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      )}
    </Button>
  );
}

export function AddServerForm({ onFormSubmitSuccess }: AddServerFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: AddServerFormState = {
    message: null,
    errors: {},
    success: false,
  };

  const [state, formAction] = React.useActionState(
<<<<<<< HEAD
    addServerAction,
=======
    (_: any, payload: FormData) => addServerAction(payload),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    initialState,
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      formRef.current?.reset();
      if (onFormSubmitSuccess) {
        onFormSubmitSuccess();
      }
    } else if (!state.success && (state.message || state.errors?._form)) {
      toast.error(
        state.message ||
<<<<<<< HEAD
          state.errors?._form?.join(", ") ||
          "An unknown error occurred.",
=======
          state.errors?._form?.join(', ') ||
          'An unknown error occurred.',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      );
    }
  }, [state, onFormSubmitSuccess]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
<<<<<<< HEAD
    const argsJsonStringValue = formData.get("argsString");

    const argsJsonString =
      typeof argsJsonStringValue === "string" ? argsJsonStringValue : "";

    if (argsJsonString.trim() !== "") {
      try {
        const argsArray = JSON.parse(argsJsonString);
        if (Array.isArray(argsArray)) {
          const transformedArgs = argsArray.join(",");
          formData.set("argsString", transformedArgs);
        } else {
          toast.error(
            "Command Arguments must be a valid JSON array. e.g., [\"--port\", \"8080\"]",
=======
    const argsJsonStringValue = formData.get('argsString');

    const argsJsonString =
      typeof argsJsonStringValue === 'string' ? argsJsonStringValue : '';

    if (argsJsonString.trim() !== '') {
      try {
        const argsArray = JSON.parse(argsJsonString);
        if (Array.isArray(argsArray)) {
          const transformedArgs = argsArray.join(',');
          formData.set('argsString', transformedArgs);
        } else {
          toast.error(
            'Command Arguments must be a valid JSON array. e.g., ["--port", "8080"]',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          );
          return;
        }
      } catch (error) {
        toast.error(
<<<<<<< HEAD
          "Invalid JSON format for Command Arguments. Please check your input.",
        );
        return; 
      }
    } else {
      formData.set("argsString", "");
=======
          'Invalid JSON format for Command Arguments. Please check your input.',
        );
        return error;
      }
    } else {
      formData.set('argsString', '');
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    }

    formAction(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Server Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., my-llm-server"
          aria-describedby="name-error"
          required
        />
        {state.errors?.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
<<<<<<< HEAD
            {state.errors.name.join(", ")}
=======
            {state.errors.name.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="command">Server's Execution Command</Label>
        <Input
          id="command"
          name="command"
          placeholder="e.g., python, docker, /usr/local/bin/my-app"
          aria-describedby="command-error"
          required
        />
        {state.errors?.command && (
          <p id="command-error" className="mt-1 text-sm text-red-600">
<<<<<<< HEAD
            {state.errors.command.join(", ")}
=======
            {state.errors.command.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="argsString">
          Command Arguments (JSON array of strings)
        </Label>
        <Textarea
          id="argsString"
          name="argsString"
          placeholder='e.g., ["--port", "8080", "-v", "my value"]'
          aria-describedby="argsString-desc argsString-error"
        />
        <p id="argsString-desc" className="mt-1 text-xs text-muted-foreground">
<<<<<<< HEAD
          Enter arguments as a valid JSON array of strings. For example:{" "}
=======
          Enter arguments as a valid JSON array of strings. For example:{' '}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          <code>{`["arg1", "arg2 with spaces", "--flag"]`}</code>
        </p>
        {state.errors?.argsString && (
          <p id="argsString-error" className="mt-1 text-sm text-red-600">
<<<<<<< HEAD
            {state.errors.argsString.join(", ")}
=======
            {state.errors.argsString.join(', ')}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
