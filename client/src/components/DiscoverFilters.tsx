import { useState } from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
  role?: string;
  experienceLevel?: string;
  lookingFor?: string;
  bodyType?: string;
  drinking?: string;
  smoking?: string;
  fitnessLevel?: string;
  minCompatibility?: number;
}

interface DiscoverFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  activeFilterCount: number;
}

export function DiscoverFilters({ filters, onFiltersChange, activeFilterCount }: DiscoverFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      minAge: 21,
      maxAge: 99,
      maxDistance: 1000,
      minCompatibility: 0,
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          data-testid="button-filters"
        >
          <Filter className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
              data-testid="badge-filter-count"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto z-[1000] p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base mb-3">
            <Filter className="w-4 h-4 text-primary" />
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Age Range */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Age</Label>
            <Slider
              min={21}
              max={99}
              step={1}
              value={[localFilters.minAge || 21, localFilters.maxAge || 99]}
              onValueChange={([min, max]) => {
                updateFilter('minAge', min);
                updateFilter('maxAge', max);
              }}
              className="w-full"
              data-testid="slider-age-range"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{localFilters.minAge || 21}</span>
              <span>{localFilters.maxAge || 99}</span>
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Max Distance</Label>
            <Slider
              min={1}
              max={1000}
              step={1}
              value={[localFilters.maxDistance || 1000]}
              onValueChange={([value]) => updateFilter('maxDistance', value)}
              className="w-full"
              data-testid="slider-distance"
            />
            <div className="text-xs text-muted-foreground">
              {localFilters.maxDistance === 1000
                ? 'Any distance' 
                : `${localFilters.maxDistance} mile${localFilters.maxDistance === 1 ? '' : 's'}`}
            </div>
          </div>

          {/* Minimum Compatibility */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Min Compatibility</Label>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[localFilters.minCompatibility || 0]}
              onValueChange={([value]) => updateFilter('minCompatibility', value)}
              className="w-full"
              data-testid="slider-compatibility"
            />
            <div className="text-xs text-muted-foreground">
              {localFilters.minCompatibility || 0}%+
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Role</Label>
            <Select
              value={localFilters.role || "all"}
              onValueChange={(value) => updateFilter('role', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-role" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Dominant">Dominant</SelectItem>
                <SelectItem value="Submissive">Submissive</SelectItem>
                <SelectItem value="Switch">Switch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Experience</Label>
            <Select
              value={localFilters.experienceLevel || "all"}
              onValueChange={(value) => updateFilter('experienceLevel', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-experience" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Looking For */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Looking For</Label>
            <Select
              value={localFilters.lookingFor || "all"}
              onValueChange={(value) => updateFilter('lookingFor', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-looking-for" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Long-term">Long-term</SelectItem>
                <SelectItem value="Exploring">Exploring</SelectItem>
                <SelectItem value="Friends">Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Body Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Body Type</Label>
            <Select
              value={localFilters.bodyType || "all"}
              onValueChange={(value) => updateFilter('bodyType', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-body-type" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Slim">Slim</SelectItem>
                <SelectItem value="Athletic">Athletic</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Curvy">Curvy</SelectItem>
                <SelectItem value="Plus-size">Plus-size</SelectItem>
                <SelectItem value="Muscular">Muscular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drinking */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Drinking</Label>
            <Select
              value={localFilters.drinking || "all"}
              onValueChange={(value) => updateFilter('drinking', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-drinking" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Socially">Socially</SelectItem>
                <SelectItem value="Regularly">Regularly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Smoking */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Smoking</Label>
            <Select
              value={localFilters.smoking || "all"}
              onValueChange={(value) => updateFilter('smoking', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-smoking" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Socially">Socially</SelectItem>
                <SelectItem value="Regularly">Regularly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Level */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Fitness</Label>
            <Select
              value={localFilters.fitnessLevel || "all"}
              onValueChange={(value) => updateFilter('fitnessLevel', value === "all" ? undefined : value)}
            >
              <SelectTrigger data-testid="select-fitness" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Sedentary">Sedentary</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Very Active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t mt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 h-8 text-xs"
            data-testid="button-reset-filters"
          >
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 h-8 text-xs"
            data-testid="button-apply-filters"
          >
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
