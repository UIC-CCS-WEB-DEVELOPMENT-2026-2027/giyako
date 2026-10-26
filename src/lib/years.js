// Year level: required on every profile and shown wherever a person appears.
// The stored value is the id; use yearLabel() for display.
export const YEARS = [
  { id: "1", label: "1st year" },
  { id: "2", label: "2nd year" },
  { id: "3", label: "3rd year" },
  { id: "4", label: "4th year" },
  { id: "5", label: "5th year+" },
];

export const yearLabel = (id) => YEARS.find((y) => y.id === id)?.label ?? "";
export const isYear = (id) => YEARS.some((y) => y.id === id);
