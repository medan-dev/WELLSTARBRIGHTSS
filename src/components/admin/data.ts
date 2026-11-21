// Clean zero-data baseline for standard multi-tenant demonstration & onboarded instances

export const students: any[] = [];
export const teachers: any[] = [];
export const classes: any[] = [];
export const classSubjects: Record<string, string[]> = {};
export const attendance: any[] = [];
export const fees: any[] = [];
export const applications: any[] = [];

export const siteContent = {
  testimonials: [] as { name: string; role: string; quote: string; rating: number }[],
  stats: [] as { value: number; label: string; suffix?: string }[],
};
