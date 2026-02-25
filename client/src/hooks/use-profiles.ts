import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type UserProfile, type CreateUserProfileRequest, type UpdateUserProfileRequest } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const idToFetch = userId || user?.id;

  return useQuery({
    queryKey: [api.userProfiles.get.path, idToFetch],
    queryFn: async () => {
      if (!idToFetch) return null;
      const url = buildUrl(api.userProfiles.get.path, { userId: idToFetch });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.userProfiles.get.responses[200].parse(await res.json());
    },
    enabled: !!idToFetch,
  });
}

export function useAllUserProfiles() {
  return useQuery({
    queryKey: [api.userProfiles.list.path],
    queryFn: async () => {
      const res = await fetch(api.userProfiles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return api.userProfiles.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateUserProfileRequest & { userId: string }) => {
      const url = buildUrl(api.userProfiles.update.path, { userId: data.userId });
      const res = await fetch(url, {
        method: api.userProfiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.userProfiles.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.userProfiles.get.path, variables.userId] });
      queryClient.invalidateQueries({ queryKey: [api.userProfiles.get.path, user?.id] });
      queryClient.invalidateQueries({ queryKey: [api.userProfiles.list.path] });
    },
  });
}
