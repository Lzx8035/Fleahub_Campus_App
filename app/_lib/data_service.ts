import {
  CategoryCount,
  Item,
  ItemDetail,
  MyAppointment,
  MyItem,
} from "../_types";
// Public
import { createClient as createBrowserClient } from "./supabase/client";
// With auth
import { createClient as createServerClient } from "./supabase/server";

/////////////////////////////////////////////////////////////////
// Item Page
/////////////////////////////////////////////////////////////////

export async function getMainCategoriesCount(): Promise<
  CategoryCount[] | null
> {
  const supabaseClient = createBrowserClient();
  const { data: itemCount, error } = await supabaseClient.rpc(
    "get_main_categories_count" as never
  );

  if (error) {
    console.error(error);
    return null;
  }

  return itemCount;
}

export async function getItemsBySearchParams(
  page: number = 1,
  category: string = "all",
  sort: string = "newest"
): Promise<{ items: Item[] | null; totalPages: number }> {
  const supabaseClient = createBrowserClient();

  const pageSize = 16;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseClient
    .from("items")
    .select("*", { count: "exact" })
    .eq("status", "available");

  if (category !== "all") {
    query = query.ilike("categories", `${category}/%`);
  }

  switch (sort) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: items, error, count } = await query.range(from, to);

  if (error) {
    console.error(error);
    return { items: null, totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return {
    items,
    totalPages,
  };
}

/////////////////////////////////////////////////////////////////
// Item Detail Page
/////////////////////////////////////////////////////////////////

// I don't want to change this 💩
export async function getItemDetail(
  id: number,
  userId: number
): Promise<ItemDetail | null> {
  const supabaseClient = createBrowserClient();

  const { data: appointmentData, error: appointmentError } =
    await supabaseClient
      .from("appointments")
      .select("buyer_id")
      .eq("item_id", id)
      .eq("buyer_id", userId)
      .maybeSingle();

  const isBuyer = !!appointmentData;

  if (appointmentError) {
    console.error("Error checking buyer status:", appointmentError.message);
    return null;
  }

  let query = supabaseClient
    .from("items")
    .select(
      `
      *,
      seller:users!seller_id (*),
      appointments (buyer_id)
    `
    )
    .eq("id", id);

  if (isBuyer) {
  } else if (userId) {
    query = query.or(`status.eq.available,seller_id.eq.${userId}`);
  } else {
    query = query.eq("status", "available");
  }

  const { data: item, error } = await query.maybeSingle();

  if (error) {
    console.error(
      "Error while fetching item details:",
      error.message,
      error.hint
    );
    return null;
  }

  return item;
}

/////////////////////////////////////////////////////////////////
// Wishlist Page
/////////////////////////////////////////////////////////////////

// include sold/reserve items
export async function getUserWishlist() {
  const supabaseServer = await createServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseServer.auth.getUser();

  if (!user?.email) {
    // console.error("No authenticated user or email found");
    return null;
  }

  if (userError) {
    // console.error("There are some error with user");
    return null;
  }

  if (!user) {
    // console.error("No authenticated user found");
    return null;
  }

  const { data: existingUser, error: userDbError } = await supabaseServer
    .from("users")
    .select("id")
    .eq("email", user.email)
    .single();

  if (userDbError) {
    console.error("There are some error with user database");
    return null;
  }

  if (!existingUser) {
    console.error("User not found in database");
    return null;
  }

  const { data: wishlistItems, error } = await supabaseServer
    .from("wishlist")
    .select(
      `
      id,
      created_at,
      item_id,
      user_id,
      items:item_id (
        id,
        title,
        price,
        images,
        status,
        description
      )
    `
    )
    .eq("user_id", existingUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }

  return wishlistItems;
}

/////////////////////////////////////////////////////////////////
// Accnout Page TODO
/////////////////////////////////////////////////////////////////

// Dashboard

export async function getDashboardStats(userId: number) {
  const supabase = await createServerClient();

  type AppointmentStatus = {
    buyer_status: "pending" | "confirmed" | "canceled";
    seller_status: "pending" | "confirmed" | "canceled";
    overall_status: "pending" | "completed" | "canceled";
    buyer_confirmed_at?: string | null;
    seller_confirmed_at?: string | null;
  };

  const { data: itemStats, error: itemError } = await supabase
    .from("items")
    .select("status")
    .eq("seller_id", userId);

  if (itemError) throw itemError;

  const { data: appointmentStats, error: appointmentError } = await supabase
    .from("appointments")
    .select("status")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

  if (appointmentError) throw appointmentError;

  const itemCounts = {
    Available:
      itemStats?.filter((item) => item.status === "available").length || 0,
    Sold: itemStats?.filter((item) => item.status === "sold").length || 0,
    Reserved:
      itemStats?.filter((item) => item.status === "reserved").length || 0,
  };

  const appointmentCounts = {
    Pending:
      appointmentStats?.filter(
        (app) => (app.status as AppointmentStatus).overall_status === "pending"
      ).length || 0,
    Completed:
      appointmentStats?.filter(
        (app) =>
          (app.status as AppointmentStatus).overall_status === "completed"
      ).length || 0,
    Canceled:
      appointmentStats?.filter(
        (app) => (app.status as AppointmentStatus).overall_status === "canceled"
      ).length || 0,
  };

  return {
    items: itemCounts,
    appointments: appointmentCounts,
  };
}

// My Items

export async function getSupabaseUserData() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, name, avatar_url")
    .eq("email", user.email!)
    .single();

  if (userError) throw userError;
  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

export async function getMyItems(userId: number) {
  const supabase = await createServerClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("*, seller:users!seller_id(*)")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching items:", error);
    throw error;
  }

  return items as unknown as MyItem[];
}

export async function getMyItemDetail(itemId: number, userId: number) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .eq("seller_id", userId)
    .single();

  if (error) throw error;
  return data as Item;
}

// My Appointments
export async function getMyAppointments(userId: number) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      items(*),
      buyer:users!buyer_id(*),
      seller:users!seller_id(*)
    `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }

  return data as unknown as MyAppointment[];
}

export async function getMyAppointmentDetail(
  appointmentId: number,
  userId: number
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      items (*),
      buyer:users!buyer_id(*),
      seller:users!seller_id(*)
    `
    )
    .eq("id", appointmentId)
    .or(`buyer_id.eq.${userId}, seller_id.eq.${userId}`)
    .single();

  if (error) throw error;

  return data as MyAppointment;
}

////

export async function getUserById(userId: number) {
  const supabase = await createServerClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
  return user;
}
