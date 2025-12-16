import { useQuery } from "@tanstack/react-query"

// This hook would need additional API routes for staff management
// Keeping it minimal for now
export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      // TODO: Implement staff API route if needed
      return []
    },
    enabled: false,
  })
}
