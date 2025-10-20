import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectFilterProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value?: string;
}

export const SelectFilter = ({ 
  label, 
  placeholder, 
  options, 
  onChange, 
  value
}: SelectFilterProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select onValueChange={onChange} value={value || ""}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};