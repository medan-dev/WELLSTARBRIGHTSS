"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Check,
  ChevronDown,
  Plus,
  ShieldCheck,
  Layers,
  MapPin,
  Users,
  AlertCircle,
  Loader2,
  Phone,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getCampusesAction,
  getActiveCampusIdAction,
  setActiveCampusAction,
  createCampusAction,
} from "@/lib/campus-actions";
import { CampusTelemetry } from "@/lib/campus-service";

export function CampusSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [campuses, setCampuses] = useState<CampusTelemetry[]>([]);
  const [maxLimit, setMaxLimit] = useState<number>(20);
  const [activeCampusId, setActiveCampusId] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // New Campus Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    headteacher: "",
    contactPhone: "+256 758 611 414",
    contactEmail: "",
  });

  // Load campuses and active selection on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [campusRes, activeId] = await Promise.all([
          getCampusesAction(),
          getActiveCampusIdAction(),
        ]);

        if (campusRes.success && campusRes.data) {
          setCampuses(campusRes.data.campuses);
          setMaxLimit(campusRes.data.maxLimit);
        }
        setActiveCampusId(activeId);
      } catch (err) {
        console.error("Failed to load campus switcher data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedCampus = campuses.find((c) => c.id === activeCampusId);
  const totalStudents = campuses.reduce((sum, c) => sum + c.studentCount, 0);

  const handleSelectCampus = (campusId: string) => {
    setActiveCampusId(campusId);
    startTransition(async () => {
      await setActiveCampusAction(campusId);
      router.refresh();
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!formData.name.trim() || !formData.code.trim()) {
      setCreateError("Campus Name and Campus Code are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCampusAction({
        name: formData.name,
        code: formData.code.toUpperCase(),
        location: formData.location,
        headteacher: formData.headteacher,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
      });

      if (!res.success) {
        setCreateError(res.error || "Failed to create campus.");
        return;
      }

      // Refresh list
      const updated = await getCampusesAction();
      if (updated.success && updated.data) {
        setCampuses(updated.data.campuses);
      }

      // Switch to newly created campus
      if (res.data?.id) {
        handleSelectCampus(res.data.id);
      }

      setIsCreateOpen(false);
      setFormData({
        name: "",
        code: "",
        location: "",
        headteacher: "",
        contactPhone: "+256 701 116 781",
        contactEmail: "",
      });
    } catch (err: any) {
      setCreateError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAtLimit = campuses.length >= maxLimit;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 bg-secondary/40 hover:bg-secondary border-border/80 text-foreground flex items-center gap-2.5 rounded-xl transition-all shadow-xs"
            disabled={loading}
          >
            <div className="size-6 rounded-lg bg-primary/10 text-primary grid place-items-center">
              {activeCampusId === "ALL" ? (
                <Layers className="size-3.5" />
              ) : (
                <Building2 className="size-3.5" />
              )}
            </div>

            <div className="flex flex-col items-start text-left leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Campus
              </span>
              <span className="text-xs font-bold truncate max-w-[140px] md:max-w-[200px]">
                {loading
                  ? "Loading..."
                  : activeCampusId === "ALL"
                  ? "Main Campus"
                  : selectedCampus?.name || "Main Campus"}
              </span>
            </div>

            <ChevronDown className="size-3.5 text-muted-foreground ml-0.5 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-80 p-2 shadow-xl border-border bg-popover rounded-2xl"
        >
          {/* Organization Banner */}
          <DropdownMenuLabel className="p-2 pb-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Institutional Campuses</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-normal mt-0.5">
              Select or manage campuses for your institution.
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Consolidated Group View */}
          <DropdownMenuItem
            onClick={() => handleSelectCampus("ALL")}
            className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-secondary/70 focus:bg-secondary/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                <Layers className="size-4" />
              </div>
              <div>
                <div className="font-semibold text-xs flex items-center gap-1.5">
                  All Campuses (Consolidated)
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {campuses.length} active campuses &bull; {totalStudents} total students
                </div>
              </div>
            </div>
            {activeCampusId === "ALL" && (
              <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Campus List */}
          <div className="max-h-64 overflow-y-auto space-y-1 py-1">
            {campuses.map((campus) => {
              const isSelected = activeCampusId === campus.id;
              return (
                <DropdownMenuItem
                  key={campus.id}
                  onClick={() => handleSelectCampus(campus.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-secondary/70 focus:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`size-8 rounded-lg grid place-items-center shrink-0 ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <Building2 className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                        <span className="truncate">{campus.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-[9px] py-0 px-1 font-mono font-bold shrink-0"
                        >
                          {campus.code}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Users className="size-3" />
                          {campus.studentCount} students
                        </span>
                        {campus.location && (
                          <span className="flex items-center gap-0.5 truncate max-w-[110px]">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{campus.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
                </DropdownMenuItem>
              );
            })}
          </div>

          <DropdownMenuSeparator />

          {/* Campus Quota & Add Action */}
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span>Campus Allocation</span>
              <span className="font-semibold text-foreground">
                {campuses.length} / {maxLimit} Used
              </span>
            </div>
            {/* Visual Quota Progress Bar */}
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isAtLimit
                    ? "bg-red-500"
                    : campuses.length / maxLimit > 0.75
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(100, (campuses.length / maxLimit) * 100)}%` }}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold rounded-xl h-8 gap-1.5 mt-1 border-dashed"
              disabled={isAtLimit}
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="size-3.5" />
              {isAtLimit ? "20/20 Limit Reached (Maxed)" : "Add New Campus Branch"}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Campus Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 bg-card border-border">
          <DialogHeader>
            <div className="size-10 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-2">
              <Building2 className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Register New Campus Branch</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add a branch campus to the institution. Enforces strict isolation with
              dedicated fee schedules, staff, classes, and admissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            {createError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="campus-name" className="text-xs font-semibold">
                Campus Official Name *
              </Label>
              <Input
                id="campus-name"
                placeholder="e.g. Entebbe Lakeside Campus"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="campus-code" className="text-xs font-semibold">
                  Campus Code *
                </Label>
                <Input
                  id="campus-code"
                  placeholder="e.g. ENT-03"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                  className="rounded-xl text-xs h-9 font-mono uppercase"
                  maxLength={10}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campus-head" className="text-xs font-semibold">
                  Headteacher / Director
                </Label>
                <Input
                  id="campus-head"
                  placeholder="e.g. Mrs. Sarah Namutebi"
                  value={formData.headteacher}
                  onChange={(e) => setFormData({ ...formData, headteacher: e.target.value })}
                  className="rounded-xl text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campus-location" className="text-xs font-semibold">
                Location & Physical Address
              </Label>
              <Input
                id="campus-location"
                placeholder="e.g. Plot 14, Airport Road, Entebbe"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="rounded-xl text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="campus-phone" className="text-xs font-semibold">
                  Official Phone
                </Label>
                <Input
                  id="campus-phone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campus-email" className="text-xs font-semibold">
                  Official Email
                </Label>
                <Input
                  id="campus-email"
                  type="email"
                  placeholder="branch@yourschool.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="rounded-none text-xs h-9"
                />
              </div>
            </div>

            <div className="p-3 bg-secondary/50 rounded-none flex items-center justify-between text-xs text-muted-foreground border border-border/50">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-emerald-600" />
                Current Capacity
              </span>
              <span className="font-semibold text-foreground">
                {campuses.length + 1} of {maxLimit} Campuses
              </span>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl text-xs h-9"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-xl text-xs h-9 gap-1.5 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Provisioning Campus...
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    Register Campus
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
