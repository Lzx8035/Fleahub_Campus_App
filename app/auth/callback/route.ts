import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/database.types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect");

  if (!code) {
    console.error("No code in callback");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(
      new URL(redirect || "/", request.url)
    );

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !session?.user.email) {
      console.error("Session exchange error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select()
      .eq("email", session.user.email)
      .maybeSingle();

    let avatarUrl = session.user.user_metadata.avatar_url;

    if (avatarUrl) {
      try {
        if (existingUser?.avatar_url) {
          const oldAvatarPath = existingUser.avatar_url.split("/").pop();
          console.log(oldAvatarPath);
          if (oldAvatarPath) {
            const { error: deleteError } = await supabase.storage
              .from("avatars")
              .remove([oldAvatarPath]);

            if (deleteError) {
              console.error("Error deleting old avatar:", deleteError);
            }
          }
        }

        const response = await fetch(avatarUrl);
        const blob = await response.blob();

        const fileName = `avatar_${session.user.id}_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, blob, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("avatars").getPublicUrl(fileName);

          avatarUrl = publicUrl;

          if (existingUser) {
            await supabase
              .from("users")
              .update({ avatar_url: avatarUrl })
              .eq("email", session.user.email);
          }
        } else {
          console.error("Error uploading avatar:", uploadError);
        }
      } catch (error) {
        console.error("Error processing avatar:", error);
      }
    }

    if (!existingUser && !userError) {
      const { data: maxIdResult } = await supabase
        .from("users")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      const nextId = (maxIdResult?.id || 0) + 1;

      const { error: createError } = await supabase
        .from("users")
        .insert({
          id: nextId,
          name:
            session.user.user_metadata.full_name ||
            session.user.email?.split("@")[0],
          email: session.user.email,
          avatar_url: avatarUrl,
          auth_id: session.user.id,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating user:", createError);
      }
    }

    return response;
  } catch (error) {
    console.error("Unexpected error in callback:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
