import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PREFERENCES = {
  pushNotifications: false,
  biometricsEnabled: false,
  theme: "light",
} as const;

type PreferenceUpdate = Partial<typeof DEFAULT_PREFERENCES>;

function getUserId() {
  return headers().get("x-user-id");
}

function isValidUpdate(value: unknown): value is PreferenceUpdate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const update = value as Record<string, unknown>;
  const allowedKeys = ["pushNotifications", "biometricsEnabled", "theme"];
  const keys = Object.keys(update);

  return (
    keys.length > 0 &&
    keys.every((key) => allowedKeys.includes(key)) &&
    (update.pushNotifications === undefined ||
      typeof update.pushNotifications === "boolean") &&
    (update.biometricsEnabled === undefined ||
      typeof update.biometricsEnabled === "boolean") &&
    (update.theme === undefined ||
      (typeof update.theme === "string" &&
        ["light", "dark"].includes(update.theme)))
  );
}

export async function GET() {
  try {
    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await prisma.userPreference.findUnique({
      where: { userId },
      select: {
        pushNotifications: true,
        biometricsEnabled: true,
        theme: true,
      },
    });

    return NextResponse.json({
      data: preferences ?? DEFAULT_PREFERENCES,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to load preferences" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update: unknown = await request.json();
    if (!isValidUpdate(update)) {
      return NextResponse.json(
        {
          error:
            "Provide one or more valid preferences: pushNotifications, biometricsEnabled, theme (light or dark)",
        },
        { status: 400 },
      );
    }

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      create: { userId, ...DEFAULT_PREFERENCES, ...update },
      update,
      select: {
        pushNotifications: true,
        biometricsEnabled: true,
        theme: true,
      },
    });

    return NextResponse.json({ message: "Preferences saved", data: preferences });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to save preferences" },
      { status: 500 },
    );
  }
}
