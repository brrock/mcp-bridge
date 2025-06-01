"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Server } from "@/lib/generated/prisma";

const addServerFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Name can only contain letters, numbers, underscores, and hyphens.",
    ),
  command: z.string().min(1, "Command is required."),
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
    name: formData.get("name"),
    command: formData.get("command"),
    argsString: formData.get("argsString"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
      success: false,
    };
  }

  const { name, command, argsString } = validatedFields.data;

  const args = argsString
    ? argsString
        .split(",")
        .map((arg) => arg.trim())
        .filter((arg) => arg !== "")
    : [];

  try {
    const existingServer = await prisma.server.findUnique({
      where: { name },
    });

    if (existingServer) {
      return {
        message: "A server with this name already exists.",
        success: false,
        errors: { name: ["This server name is already taken."] },
      };
    }

    const newServer = await prisma.server.create({
      data: {
        name,
        command,
        Args: args,
      },
    });

    revalidatePath("/");
    return {
      message: `Server "${name}" added successfully!`,
      success: true,
      server: newServer,
    };
  } catch (error) {
    let errorMessage = "An unexpected error occurred while adding the server.";
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
        createdAt: "desc",
      },
    });
    return servers;
  } catch (error) {
    console.error("Failed to fetch servers via action:", error);
    return [];
  }
}
