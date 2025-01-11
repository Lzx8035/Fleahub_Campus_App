import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package2, Calendar } from "lucide-react";

type StatusItem = {
  status: string;
  count: number;
  color: string;
};

type StatusBarProps = {
  title: string;
  items: StatusItem[];
  type: "items" | "appointments";
};

const StatusBar = ({ title, items, type }: StatusBarProps) => {
  const Icon = type === "items" ? Package2 : Calendar;

  return (
    <Card className="w-full bg-slate-50">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-medium text-slate-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.status} className="flex items-center gap-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${item.color}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">{item.status}</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {item.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBar;
