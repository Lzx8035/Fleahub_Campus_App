"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ImagePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardContent className="p-6 space-y-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Profile</h2>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/api/placeholder/80/80" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Change Avatar
                </Button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="username" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-xl font-semibold">Preferences</h2>

            {/* Language */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="light">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-xl font-semibold">Notifications</h2>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-slate-500">
                    Receive email about your account activity
                  </p>
                </div>
                <Switch />
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-slate-500">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t">
            <Button className="bg-indigo-500 hover:bg-indigo-600">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
