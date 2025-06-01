<<<<<<< HEAD
"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Server } from "@/lib/generated/prisma";
=======
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Server } from '@/lib/generated/prisma';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)

const addServerFormSchema = z.object({
  name: z
    .string()
<<<<<<< HEAD
    .min(3, "Name must be at least 3 characters long.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Name can only contain letters, numbers, underscores, and hyphens.",
    ),
  command: z.string().min(1, "Command is required."),
=======
    .min(3, 'Name must be at least 3 characters long.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Name can only contain letters, numbers, underscores, and hyphens.',
    ),
  command: z.string().min(1, 'Command is required.'),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  argsString: z.string().optional(),
});

export type AddServerFormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    command?: string[];
    argsString?: string[];
    _form?: string[];
  };
  success: boolean;
  server?: Server | null;
};

export async function addServerAction(
<<<<<<< HEAD
  prevState: AddServerFormState,
  formData: FormData,
): Promise<AddServerFormState> {
  const validatedFields = addServerFormSchema.safeParse({
    name: formData.get("name"),
    command: formData.get("command"),
    argsString: formData.get("argsString"),
=======
  formData: FormData,
): Promise<AddServerFormState> {
  const validatedFields = addServerFormSchema.safeParse({
    name: formData.get('name'),
    command: formData.get('command'),
    argsString: formData.get('argsString'),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
<<<<<<< HEAD
      message: "Validation failed. Please check the fields.",
=======
      message: 'Validation failed. Please check the fields.',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      success: false,
    };
  }

  const { name, command, argsString } = validatedFields.data;

  const args = argsString
    ? argsString
<<<<<<< HEAD
        .split(",")
        .map((arg) => arg.trim())
        .filter((arg) => arg !== "")
=======
        .split(',')
        .map((arg) => arg.trim())
        .filter((arg) => arg !== '')
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    : [];

  try {
    const existingServer = await prisma.server.findUnique({
      where: { name },
    });

    if (existingServer) {
      return {
<<<<<<< HEAD
        message: "A server with this name already exists.",
        success: false,
        errors: { name: ["This server name is already taken."] },
=======
        message: 'A server with this name already exists.',
        success: false,
        errors: { name: ['This server name is already taken.'] },
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      };
    }

    const newServer = await prisma.server.create({
      data: {
        name,
        command,
        Args: args,
      },
    });

<<<<<<< HEAD
    revalidatePath("/");
=======
    revalidatePath('/');
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    return {
      message: `Server "${name}" added successfully!`,
      success: true,
      server: newServer,
    };
  } catch (error) {
<<<<<<< HEAD
    let errorMessage = "An unexpected error occurred while adding the server.";
=======
    let errorMessage = 'An unexpected error occurred while adding the server.';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      success: false,
      errors: { _form: [errorMessage] },
    };
  }
}

const editServerFormSchema = z.object({
<<<<<<< HEAD
  id: z.string().min(1, "Server ID is required."),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Name can only contain letters, numbers, underscores, and hyphens.",
    ),
  command: z.string().min(1, "Command is required."),
=======
  id: z.string().min(1, 'Server ID is required.'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Name can only contain letters, numbers, underscores, and hyphens.',
    ),
  command: z.string().min(1, 'Command is required.'),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  argsString: z.string().optional(),
});

export type EditServerFormState = {
  message?: string | null;
  errors?: {
    id?: string[];
    name?: string[];
    command?: string[];
    argsString?: string[];
    _form?: string[];
  };
  success: boolean;
};

export async function editServerAction(
<<<<<<< HEAD
  prevState: EditServerFormState,
  formData: FormData,
): Promise<EditServerFormState> {
  const validatedFields = editServerFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    command: formData.get("command"),
    argsString: formData.get("argsString"),
=======
  formData: FormData,
): Promise<EditServerFormState> {
  const validatedFields = editServerFormSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    command: formData.get('command'),
    argsString: formData.get('argsString'),
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
<<<<<<< HEAD
      message: "Validation failed. Please check the fields.",
=======
      message: 'Validation failed. Please check the fields.',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      success: false,
    };
  }

  const { id: serverId, name, command, argsString } = validatedFields.data;

  const args = argsString
    ? argsString
<<<<<<< HEAD
        .split(",")
        .map((arg) => arg.trim())
        .filter((arg) => arg !== "")
=======
        .split(',')
        .map((arg) => arg.trim())
        .filter((arg) => arg !== '')
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    : [];

  try {
    const serverToUpdate = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!serverToUpdate) {
      return {
<<<<<<< HEAD
        message: "Server not found.",
        success: false,
        errors: { _form: ["Server not found."] },
=======
        message: 'Server not found.',
        success: false,
        errors: { _form: ['Server not found.'] },
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      };
    }

    // Check if the new name is already taken by another server
    if (name !== serverToUpdate.name) {
      const existingServerWithNewName = await prisma.server.findFirst({
        where: {
          name,
          NOT: {
            id: serverId,
          },
        },
      });

      if (existingServerWithNewName) {
        return {
<<<<<<< HEAD
          message: "A server with this name already exists.",
          success: false,
          errors: { name: ["This server name is already taken."] },
=======
          message: 'A server with this name already exists.',
          success: false,
          errors: { name: ['This server name is already taken.'] },
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
        };
      }
    }

    await prisma.server.update({
      where: { id: serverId },
      data: {
        name,
        command,
        Args: args,
      },
    });

<<<<<<< HEAD
    revalidatePath("/"); // Or a more specific path if applicable
=======
    revalidatePath('/'); // Or a more specific path if applicable
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    return {
      message: `Server "${name}" updated successfully!`,
      success: true,
    };
  } catch (error) {
    let errorMessage =
<<<<<<< HEAD
      "An unexpected error occurred while updating the server.";
=======
      'An unexpected error occurred while updating the server.';
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      success: false,
      errors: { _form: [errorMessage] },
    };
  }
}

export async function getServersAction(): Promise<Server[]> {
  try {
    const servers = await prisma.server.findMany({
      orderBy: {
<<<<<<< HEAD
        createdAt: "desc",
=======
        createdAt: 'desc',
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
      },
    });
    return servers;
  } catch (error) {
<<<<<<< HEAD
    console.error("Failed to fetch servers via action:", error);
    return [];
  }
}
=======
    console.error('Failed to fetch servers via action:', error);
    return [];
  }
}
>>>>>>> 2820091 (Feat: add husky, lint staged and biome)
