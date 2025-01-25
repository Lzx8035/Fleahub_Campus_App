"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "./supabase/server";
import { AppointmentStatus } from "../_types";
import { getImageUrls } from "./utils";

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

export async function EditOrCreateMyItemAction(
  formData: FormData
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) throw new Error("Unauthorized");

    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();
    if (!userData) throw new Error("User not found");

    const itemId = formData.get("id");
    const title = formData.get("title") as string;
    const price = Number(formData.get("price"));
    const description = formData.get("description") as string;
    const categories = formData.get("categories") as string;
    const existingImages = getImageUrls(
      formData.get("existingImages") as string
    );
    const newImages = formData.getAll("images") as File[];

    const imageUrls = [...existingImages].filter((url) =>
      url.startsWith("https://szlmetwvtwtkmsaupqaj.supabase.co")
    );
    for (const image of newImages) {
      const { data, error } = await supabase.storage
        .from("item-images")
        .upload(`${userData.id}/${Date.now()}-${image.name}`, image);
      if (error) throw error;

      const publicUrl = `https://szlmetwvtwtkmsaupqaj.supabase.co/storage/v1/object/public/item-images/${data.path}`;
      imageUrls.push(publicUrl);
    }

    const itemData = {
      title,
      price,
      description,
      categories,
      images: JSON.stringify(imageUrls),
      seller_id: userData.id,
      status: "available" as const,
      update_at: new Date().toISOString(),
    };

    if (itemId) {
      const { error } = await supabase
        .from("items")
        .update(itemData)
        .eq("id", itemId)
        .eq("seller_id", userData.id);
      if (error) throw error;
    } else {
      const { data: maxIdData } = await supabase
        .from("items")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      const newId = (maxIdData?.id || 0) + 1;

      const { error } = await supabase
        .from("items")
        .insert({ ...itemData, id: newId });
      if (error) throw error;
    }

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
    console.error("Full Error details:", {
      code: err.code,
      message: err.message,
      details: err.details,
      hint: err.hint,
    });
    return false;
  }
}

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

export async function updateMyAppointmentStatusAction(
  appointmentId: number,
  isBuyer: boolean,
  newStatus: "approved" | "canceled",
  itemId?: number
): Promise<{ success: boolean; updatedStatus?: AppointmentStatus }> {
  try {
    const supabase = await createClient();

    const { data: currentAppointment } = await supabase
      .from("appointments")
      .select("status")
      .eq("id", appointmentId)
      .single();

    if (!currentAppointment) throw new Error("Appointment not found");

    const currentStatus = currentAppointment.status as AppointmentStatus;

    const newBuyerStatus = isBuyer ? newStatus : currentStatus.buyer_status;
    const newSellerStatus = isBuyer ? currentStatus.seller_status : newStatus;

    const updatedStatus = {
      buyer_status: newBuyerStatus,
      seller_status: newSellerStatus,
      overall_status:
        newStatus === "canceled"
          ? "canceled"
          : newBuyerStatus === "approved" && newSellerStatus === "approved"
          ? "completed"
          : "pending",
      buyer_confirmed_at: currentStatus.buyer_confirmed_at,
      seller_confirmed_at: currentStatus.seller_confirmed_at,
    } as AppointmentStatus;

    const { error } = await supabase
      .from("appointments")
      .update({ status: updatedStatus })
      .eq("id", appointmentId);

    if (error) throw error;

    if (newStatus === "canceled" && itemId) {
      await supabase
        .from("items")
        .update({ status: "available" })
        .eq("id", itemId);
    }

    revalidatePath("/account/my_appointments");
    return { success: true, updatedStatus };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
