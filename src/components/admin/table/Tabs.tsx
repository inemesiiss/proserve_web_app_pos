import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsHeaderProps {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}

export default function TabsHeader({ tabs, value, onChange }: TabsHeaderProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
