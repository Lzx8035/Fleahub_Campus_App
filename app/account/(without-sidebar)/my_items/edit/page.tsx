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

const categories = [
  { value: "books", label: "Books" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "supplies", label: "Supplies" },
  { value: "others", label: "Others" },
] as const;

export default function EditItemPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      // 创建预览URL
      const newUrls = newImages.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    // 清理预览URL
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-12">
      <h1 className="text-2xl font-bold mb-8">Create New Item</h1>

      <form className="space-y-8">
        {/* 图片上传区域 */}
        <div>
          <Label>Images</Label>
          <div className="mt-2 grid grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
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

        {/* 标题输入 */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter item title" />
        </div>

        {/* 价格输入 */}
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
            />
          </div>
        </div>

        {/* 描述文本区域 */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your item..."
            className="min-h-[150px]"
          />
        </div>

        {/* 分类选择 */}
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
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
            {selectedCategory === "others" && (
              <Input
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">
            Create Item
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
