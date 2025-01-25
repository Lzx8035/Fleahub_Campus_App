"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Item } from "@/app/_types";
import { getImageUrls } from "../_lib/utils";
import Image from "next/image";
import { EditOrCreateMyItemAction } from "@/app/_lib/action";

interface ItemFormProps {
  initialData: Item | null;
}

const categories = [
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "supplies", label: "Supplies" },
  { value: "others", label: "Others" },
] as const;

export default function MyItemForm({ initialData }: ItemFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    getImageUrls(initialData?.images || "") || []
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (!initialData?.categories) return "";
    const [mainCategory] = initialData.categories.split("/");
    return mainCategory || "";
  });
  const [customCategory, setCustomCategory] = useState<string>(() => {
    if (!initialData?.categories) return "";
    const parts = initialData.categories.split("/");
    return parts[1] || "";
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // 基本信息
    formData.append("title", title);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("categories", `${selectedCategory}/${customCategory}`);

    // 图片处理
    formData.append("existingImages", JSON.stringify(imageUrls));
    images.forEach((image) => {
      formData.append("images", image);
    });

    // 如果是编辑模式，添加ID
    if (initialData?.id) {
      formData.append("id", initialData.id.toString());
    }

    // 调用 Server Action
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    const success = await EditOrCreateMyItemAction(formData);
    if (success) {
      router.push("/account/my_items");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      const newUrls = newImages.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <Label>Images</Label>
        <div className="mt-2 grid grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                priority={index === 0}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ImagePlus className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Add Images</span>
            </div>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter item title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            className="pl-7"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your item..."
          className=""
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
          {initialData ? "Update Item" : "Create Item"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
