import { createMcpHandler } from "@vercel/mcp-adapter";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z, ZodTypeAny, ZodRawShape } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import type { Server as PrismaServerType } from "@/lib/generated/prisma"; 

const CLIENT_APP_NAME_PREFIX = "mcp-bridge-dynamic";
const CLIENT_APP_VERSION = "1.0.0";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error(
    "REDIS_URL environment variable is not set. This is required.",
  );
}

interface FetchedTool {
  name: string;
  description: string;
  inputSchema: any;
}

const handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ serverName: string; t: string }> },
) => {
  const { serverName, t } = await params;
  logger.log(
    `Handler invoked for serverName: "${serverName}", transport segment: "${t}"`,
  );

  let serverConfig: PrismaServerType | null = null;
  try {
    serverConfig = await prisma.server.findUnique({
      where: { name: serverName },
    });
  } catch (dbError) {
    logger.error(
      `[${serverName}/${t}] Database error fetching server configuration:`,
      dbError,
    );
    return NextResponse.json(
      { error: "Database error while fetching server configuration." },
      { status: 500 },
    );
  }

  if (!serverConfig) {
    logger.warn(`[${serverName}/${t}] Configuration not found for serverName.`);
    return NextResponse.json(
      { error: `Server configuration for '${serverName}' not found.` },
      { status: 404 },
    );
  }

  logger.log(
    `[${serverName}/${t}] Found config: cmd="${serverConfig.command}", args="${serverConfig.Args.join(" ")}"`,
  );

  const mcpExternalClient = new Client({
    name: `${CLIENT_APP_NAME_PREFIX}-${serverName}-${t}`,
    version: CLIENT_APP_VERSION,
  });

  const externalServiceTransport = new StdioClientTransport({
    command: serverConfig.command,
    args: serverConfig.Args,
  });

  let fetchedExternalTools: FetchedTool[] = [];
  let isExternalClientInitialized = false;

  async function initializeThisExternalClient(): Promise<void> {
    isExternalClientInitialized = false;
    fetchedExternalTools = [];
    try {
      logger.log(
        `[${serverName}/${t}] Connecting: ${serverConfig!.command} ${serverConfig!.Args.join(" ")}`,
      );
      await mcpExternalClient.connect(externalServiceTransport);
      logger.log(
        `[${serverName}/${t}] Successfully connected to external MCP service.`,
      );

      const toolsResult = await mcpExternalClient.listTools();
      logger.log(
        `[${serverName}/${t}] External service provides ${toolsResult.tools.length} tool(s).`,
      );

      fetchedExternalTools = toolsResult.tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      if (fetchedExternalTools.length > 0) {
        logger.log(
          `[${serverName}/${t}] Fetched ${fetchedExternalTools.length} tools. Example: ${fetchedExternalTools[0].name}`,
        );
      } else {
        logger.log(
          `[${serverName}/${t}] No tools fetched from external service.`,
        );
      }
      isExternalClientInitialized = true;
    } catch (error) {
      logger.error(
        `[${serverName}/${t}] Failed to initialize/communicate with external service:`,
        error,
      );
      isExternalClientInitialized = false;
    }
  }

  await initializeThisExternalClient();

  const currentBasePath = `/mcp/${serverName}`;

  return createMcpHandler(
    async (server) => {
      if (!isExternalClientInitialized) {
        logger.warn(
          `[${serverName}/${t}] External client not initialized. No tools exposed.`,
        );
        return;
      }
      if (fetchedExternalTools.length === 0) {
        logger.log(`[${serverName}/${t}] No external tools fetched to expose.`);
        return;
      }

      logger.log(
        `[${serverName}/${t}] Registering ${fetchedExternalTools.length} tools...`,
      );

      for (const tool of fetchedExternalTools) {
        try {
          let zodShapeForAdapter: ZodRawShape = {};
          let paramsTransformer = (params: any) => params;

          if (
            tool.inputSchema &&
            typeof tool.inputSchema === "object" &&
            tool.inputSchema.type === "object" &&
            tool.inputSchema.properties &&
            typeof tool.inputSchema.properties === "object"
          ) {
            const properties = tool.inputSchema.properties;
            const requiredProperties = new Set(
              Array.isArray(tool.inputSchema.required)
                ? tool.inputSchema.required
                : [],
            );
            for (const key in properties) {
              if (Object.prototype.hasOwnProperty.call(properties, key)) {
                const propertyJsonSchema = properties[key];
                let fieldSchema: ZodTypeAny;
                if (
                  propertyJsonSchema &&
                  typeof propertyJsonSchema === "object"
                ) {
                  switch (propertyJsonSchema.type) {
                    case "string":
                      fieldSchema = z.string();
                      break;
                    case "number":
                      fieldSchema = z.number();
                      break;
                    case "integer":
                      fieldSchema = z.number().int();
                      break;
                    case "boolean":
                      fieldSchema = z.boolean();
                      break;
                    case "array":
                      fieldSchema = z.array(z.any());
                      break;
                    case "object":
                      fieldSchema = z.record(z.string(), z.any());
                      break;
                    default:
                      logger.warn(
                        `[${serverName}/${t}] Tool "${tool.name}", prop "${key}": Unhandled JSON type "${propertyJsonSchema.type}". Defaulting to z.any().`,
                      );
                      fieldSchema = z.any();
                      break;
                  }
                } else {
                  logger.warn(
                    `[${serverName}/${t}] Tool "${tool.name}", prop "${key}": Invalid schema. Defaulting to z.any().`,
                  );
                  fieldSchema = z.any();
                }
                if (requiredProperties.has(key)) {
                  zodShapeForAdapter[key] = fieldSchema;
                } else {
                  zodShapeForAdapter[key] = fieldSchema.optional();
                }
              }
            }
          } else if (
            tool.inputSchema &&
            typeof tool.inputSchema === "object" &&
            tool.inputSchema.type
          ) {
            logger.warn(
              `[${serverName}/${t}] Tool "${tool.name}" non-object input type: "${tool.inputSchema.type}". Wrapping as 'value'.`,
            );
            let primitiveSchema: ZodTypeAny;
            switch (tool.inputSchema.type) {
              case "string":
                primitiveSchema = z.string();
                break;
              case "number":
                primitiveSchema = z.number();
                break;
              case "integer":
                primitiveSchema = z.number().int();
                break;
              case "boolean":
                primitiveSchema = z.boolean();
                break;
              case "array":
                primitiveSchema = z.array(z.any());
                break;
              default:
                logger.warn(
                  `[${serverName}/${t}] Tool "${tool.name}": Unhandled primitive type "${tool.inputSchema.type}". Defaulting to z.any().`,
                );
                primitiveSchema = z.any();
                break;
            }
            zodShapeForAdapter = { value: primitiveSchema };
            paramsTransformer = (p: any) =>
              p && typeof p === "object" && "value" in p ? p.value : p;
          } else if (tool.inputSchema) {
            logger.error(
              `[${serverName}/${t}] Tool "${
                tool.name
              }" unrecognized schema. Empty shape. Schema: ${JSON.stringify(
                tool.inputSchema,
              )}`,
            );
          } else {
            logger.log(
              `[${serverName}/${t}] Tool "${tool.name}" no input schema. Empty shape.`,
            );
          }

          server.tool(
            tool.name,
            tool.description,
            zodShapeForAdapter,
            async (toolParams: any) => {
              logger.log(
                `[${serverName}/${t}] Executing "${tool.name}". Raw:`,
                JSON.stringify(toolParams),
              );
              const actualArgs = paramsTransformer(toolParams);
              logger.log(
                `[${serverName}/${t}] Transformed Args for "${tool.name}":`,
                JSON.stringify(actualArgs),
              );
              try {
                const result = await mcpExternalClient.callTool({
                  name: tool.name,
                  arguments: actualArgs,
                  context: {
                    serverName: serverName,
                    transport: t,
                    source: "mcp-bridge-api-dynamic",
                  },
                });
                return result;
              } catch (executionError) {
                logger.error(
                  `[${serverName}/${t}] Error executing "${tool.name}":`,
                  executionError,
                );
                if (
                  executionError instanceof Error &&
                  (executionError.message.includes("disconnected") ||
                    executionError.message.includes("not connected"))
                ) {
                  logger.warn(
                    `[${serverName}/${t}] Client disconnected. Reconnecting for "${tool.name}"...`,
                  );
                  await initializeThisExternalClient();
                  if (!isExternalClientInitialized) {
                    throw new Error(
                      `[${serverName}/${t}] Reconnect/re-init failed for "${tool.name}".`,
                    );
                  }
                  logger.log(
                    `[${serverName}/${t}] Reconnected. Retrying "${tool.name}"...`,
                  );
                  return await mcpExternalClient.callTool({
                    name: tool.name,
                    arguments: actualArgs,
                    context: {
                      serverName: serverName,
                      transport: t,
                      source: "mcp-bridge-api-dynamic-retry",
                    },
                  });
                }
                throw executionError;
              }
            },
          );
          logger.log(
            `[${serverName}/${t}] Registered dynamic tool "${tool.name}".`,
          );
        } catch (registrationError) {
          logger.error(
            `[${serverName}/${t}] Failed to register tool "${tool.name}":`,
            registrationError,
          );
        }
      }
    },
    {},
    {
      redisUrl: REDIS_URL,
      basePath: currentBasePath,
      verboseLogs: process.env.NODE_ENV === "development",
      // verboseLogs: false,
      maxDuration: 120,
    },
  )(req);
};

export {
  handler as GET,
  handler as POST,
  handler as DELETE,
  handler as PUT,
  handler as PATCH,
  handler as HEAD,
  handler as OPTIONS,
};
