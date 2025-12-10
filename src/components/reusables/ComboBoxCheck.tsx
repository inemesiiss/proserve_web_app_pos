import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState, useMemo } from "react";

export function ComboBoxCheck({
  label,
  list,
  values = [],
  onChange,
  disabled = false,
}: any) {
  const [open, setOpen] = useState(false);

  const allSelected = values.length === list.length;
  const partiallySelected = values.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(list.map((i: any) => i.id));
    }
  };

  const toggleItem = (id: any) => {
    if (values.includes(id)) {
      onChange(values.filter((v: any) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const labelText = useMemo(() => {
    if (values.length === 0) return `Select ${label.toLowerCase()}...`;
    if (values.length === 1) {
      return list.find((i: any) => i.id === values[0])?.name;
    }
    return `${values.length} selected`;
  }, [values, list, label]);

  return (
    <div className="grid gap-1">
      <label className="font-semibold">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between"
          >
            {labelText}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>

              <CommandGroup>
                {/* SELECT ALL */}
                <CommandItem
                  onSelect={toggleSelectAll}
                  value="__all__"
                  className="flex items-center gap-2"
                >
                  <div
                    className={`border w-4 h-4 rounded-sm flex items-center justify-center
                    ${allSelected ? "bg-primary text-primary-foreground" : ""}
                    ${partiallySelected ? "bg-muted" : ""}
                    `}
                  >
                    {(allSelected || partiallySelected) && <Check size={14} />}
                  </div>
                  <span>Select All</span>
                </CommandItem>

                {/* ITEM LIST */}
                {list.map((item: any) => {
                  const checked = values.includes(item.id);
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => toggleItem(item.id)}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`border w-4 h-4 rounded-sm flex items-center justify-center
                          ${checked ? "bg-primary text-primary-foreground" : ""}
                        `}
                      >
                        {checked && <Check size={14} />}
                      </div>
                      <span>{item.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
