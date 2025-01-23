"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";

/////////////////////////////////////////////////////////////////
// Wishlist Button
/////////////////////////////////////////////////////////////////

export async function ToggleWishlistItemAction(itemId: number) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("Unauthorized");
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    // 检查是否在wishlist中
    const { data: wishlistCheck, error: checkError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("item_id", itemId)
      .eq("user_id", userData.id);

    if (checkError) throw checkError;

    if (wishlistCheck.length > 0) {
      // 删除
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("item_id", itemId)
        .eq("user_id", userData.id);

      if (deleteError) throw deleteError;
      return false;
    } else {
      // 获取最大 id
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("wishlist")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (maxIdError && maxIdError.code !== "PGRST116") throw maxIdError;

      const newId = (maxIdData?.id || 0) + 1;

      // 插入新记录
      const { error: insertError } = await supabase.from("wishlist").insert({
        id: newId,
        item_id: itemId,
        user_id: userData.id,
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }
      return true;
    }
  } catch (error) {
    const err = error as {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    };
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      details: err.details,
      hint: err.hint,
    });
    throw error;
  } finally {
    revalidatePath("/items");
    revalidatePath("/wishlist");
  }
}

/////////////////////////////////////////////////////////////////
// Account Page TODO
/////////////////////////////////////////////////////////////////

// My Items

export async function EditOrCreateMyItemAction() {}

export async function toggleMyItemReserveAction(
  itemId: number
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("Unauthorized");
    }

    // 获取当前item状态
    const { data: itemData, error: itemError } = await supabase
      .from("items")
      .select("status")
      .eq("id", itemId)
      .single();

    if (itemError) throw itemError;
    if (!itemData) throw new Error("Item not found");

    const newStatus = itemData.status === "reserved" ? "available" : "reserved";

    // 更新状态
    const { error: updateError } = await supabase
      .from("items")
      .update({ status: newStatus })
      .eq("id", itemId);

    if (updateError) throw updateError;

    // 成功更新
    revalidatePath("/items");
    revalidatePath("/account/my_items");
    return true;
  } catch (error) {
    const err = error as {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    };
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      details: err.details,
      hint: err.hint,
    });
    throw error;
  }
}

export async function deleteMyItemAction(itemId: number): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("Unauthorized");
    }

    // 获取用户ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    // 验证物品属于当前用户
    const { data: itemData, error: itemError } = await supabase
      .from("items")
      .select("seller_id")
      .eq("id", itemId)
      .single();

    if (itemError) throw itemError;
    if (!itemData) throw new Error("Item not found");
    if (itemData.seller_id !== userData.id) throw new Error("Unauthorized");

    // 删除物品
    const { error: deleteError } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("seller_id", userData.id);

    if (deleteError) throw deleteError;

    revalidatePath("/account/my_items");
    return true;
  } catch (error) {
    const err = error as {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    };
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      details: err.details,
      hint: err.hint,
    });
    return false;
  }
}

// My Appointments

export async function EditOrCreateMyAppointmentAction() {}

export async function CancelAppointment() {}

// ??? seller and buyer both agreed?
export async function CompleteAppointment() {}
