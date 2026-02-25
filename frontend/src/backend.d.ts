import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SuccessStory {
    id: bigint;
    title: string;
    content: string;
    date: Time;
    authorName: string;
    village: string;
    category: BusinessCategory;
}
export type Time = bigint;
export interface TrainingResource {
    id: bigint;
    url: string;
    title: string;
    description: string;
    resourceType: ResourceType;
    category: ResourceCategory;
}
export interface Entrepreneur {
    id: Principal;
    age: bigint;
    bio: string;
    contactInfo: string;
    businessCategory: BusinessCategory;
    fullName: string;
    district: string;
    state: string;
    panchayat: string;
    village: string;
    gender: Gender;
    skills: Array<string>;
}
export interface CommunityPost {
    id: bigint;
    author: Principal;
    panchayat: string;
    message: string;
    village: string;
    timestamp: Time;
    category: BusinessCategory;
}
export enum BusinessCategory {
    other = "other",
    food = "food",
    environment = "environment",
    sustainability = "sustainability",
    agriculture = "agriculture"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum ResourceCategory {
    food = "food",
    environment = "environment",
    general = "general",
    sustainability = "sustainability",
    agriculture = "agriculture"
}
export enum ResourceType {
    video = "video",
    tool = "tool",
    guide = "guide",
    course = "course"
}
export interface backendInterface {
    addCommunityPost(post: CommunityPost): Promise<void>;
    addSuccessStory(story: SuccessStory): Promise<void>;
    addTrainingResource(resource: TrainingResource): Promise<void>;
    getEntrepreneur(user: Principal): Promise<Entrepreneur>;
    listCommunityPosts(): Promise<Array<CommunityPost>>;
    listEntrepreneurs(): Promise<Array<Entrepreneur>>;
    listSuccessStories(): Promise<Array<SuccessStory>>;
    listTrainingResources(): Promise<Array<TrainingResource>>;
    registerEntrepreneur(entrepreneur: Entrepreneur): Promise<void>;
}
