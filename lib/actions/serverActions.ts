'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Server } from '@/lib/generated/prisma';

const addServerFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Name can only contain letters, numbers, underscores, and hyphens.',
    ),
  command: z.string().min(1, 'Command is required.'),
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
  prevState: AddServerFormState,
  formData: FormData,
): Promise<AddServerFormState> {
  const validatedFields = addServerFormSchema.safeParse({
    name: formData.get('name'),
    command: formData.get('command'),
    argsString: formData.get('argsString'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
      server: null,
    };
  }

  const { name, command, argsString } = validatedFields.data;

  const args = argsString
    ? argsString
        .split(',')
        .map((arg) => arg.trim())
        .filter((arg) => arg !== '')
    : [];

  try {
    const existingServer = await prisma.server.findUnique({
      where: { name },
    });

    if (existingServer) {
      return {
        ...prevState,
        message: 'A server with this name already exists.',
        success: false,
        errors: { name: ['This server name is already taken.'] },
        server: null,
      };
    }

    const newServer = await prisma.server.create({
      data: {
        name,
        command,
        Args: args,
      },
    });

    revalidatePath('/');
    return {
      ...prevState,
      message: `Server "${name}" added successfully!`,
      success: true,
      server: newServer,
      errors: {},
    };
  } catch (error) {
    let errorMessage = 'An unexpected error occurred while adding the server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      ...prevState,
      message: errorMessage,
      success: false,
      errors: { _form: [errorMessage] },
      server: null,
    };
  }
}

const editServerFormSchema = z.object({
  id: z.string().min(1, 'Server ID is required.'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Name can only contain letters, numbers, underscores, and hyphens.',
    ),
  command: z.string().min(1, 'Command is required.'),
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
  _prevState: EditServerFormState,
  formData: FormData,
): Promise<EditServerFormState> {
  const validatedFields = editServerFormSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    command: formData.get('command'),
    argsString: formData.get('argsString'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  const { id: serverId, name, command, argsString } = validatedFields.data;

  const args = argsString
    ? argsString
        .split(',')
        .map((arg) => arg.trim())
        .filter((arg) => arg !== '')
    : [];

  try {
    const serverToUpdate = await prisma.server.findUnique({
      where: { id: serverId },
    });

    if (!serverToUpdate) {
      return {
        message: 'Server not found.',
        success: false,
        errors: { _form: ['Server not found.'] },
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
          message: 'A server with this name already exists.',
          success: false,
          errors: { name: ['This server name is already taken.'] },
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

    revalidatePath('/'); // Or a more specific path if applicable
    return {
      message: `Server "${name}" updated successfully!`,
      success: true,
    };
  } catch (error) {
    let errorMessage =
      'An unexpected error occurred while updating the server.';
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
        createdAt: 'desc',
      },
    });
    return servers;
  } catch (error) {
    console.error('Failed to fetch servers via action:', error);
    return [];
  }
}
