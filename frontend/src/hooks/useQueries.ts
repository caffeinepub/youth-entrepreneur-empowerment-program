import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Entrepreneur,
  SuccessStory,
  TrainingResource,
  CommunityPost,
} from '../backend';

// ─── Entrepreneurs ───────────────────────────────────────────────────────────

export function useListEntrepreneurs() {
  const { actor, isFetching } = useActor();
  return useQuery<Entrepreneur[]>({
    queryKey: ['entrepreneurs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEntrepreneurs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntrepreneur(principalStr: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Entrepreneur>({
    queryKey: ['entrepreneur', principalStr],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      const { Principal } = await import('@dfinity/principal');
      return actor.getEntrepreneur(Principal.fromText(principalStr));
    },
    enabled: !!actor && !isFetching && !!principalStr,
  });
}

export function useRegisterEntrepreneur() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entrepreneur: Entrepreneur) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.registerEntrepreneur(entrepreneur);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entrepreneurs'] });
    },
  });
}

// ─── Success Stories ─────────────────────────────────────────────────────────

export function useListSuccessStories() {
  const { actor, isFetching } = useActor();
  return useQuery<SuccessStory[]>({
    queryKey: ['successStories'],
    queryFn: async () => {
      if (!actor) return [];
      const stories = await actor.listSuccessStories();
      return [...stories].sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSuccessStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (story: SuccessStory) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addSuccessStory(story);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['successStories'] });
    },
  });
}

// ─── Training Resources ───────────────────────────────────────────────────────

export function useListTrainingResources() {
  const { actor, isFetching } = useActor();
  return useQuery<TrainingResource[]>({
    queryKey: ['trainingResources'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTrainingResources();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTrainingResource() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resource: TrainingResource) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addTrainingResource(resource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingResources'] });
    },
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function useListCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.listCommunityPosts();
      return [...posts].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: CommunityPost) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addCommunityPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}
