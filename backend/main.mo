import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Gender = {
    #male;
    #female;
    #other;
  };

  type BusinessCategory = {
    #agriculture;
    #food;
    #environment;
    #sustainability;
    #other;
  };

  type ResourceType = {
    #course;
    #guide;
    #tool;
    #video;
  };

  type ResourceCategory = {
    #agriculture;
    #food;
    #environment;
    #sustainability;
    #general;
  };

  type Entrepreneur = {
    id : Principal;
    fullName : Text;
    age : Nat;
    gender : Gender;
    village : Text;
    panchayat : Text;
    district : Text;
    state : Text;
    contactInfo : Text;
    businessCategory : BusinessCategory;
    skills : [Text];
    bio : Text;
  };

  type SuccessStory = {
    id : Nat;
    title : Text;
    content : Text;
    authorName : Text;
    village : Text;
    category : BusinessCategory;
    date : Time.Time;
  };

  type TrainingResource = {
    id : Nat;
    title : Text;
    description : Text;
    resourceType : ResourceType;
    category : ResourceCategory;
    url : Text;
  };

  type CommunityPost = {
    id : Nat;
    author : Principal;
    message : Text;
    village : Text;
    panchayat : Text;
    category : BusinessCategory;
    timestamp : Time.Time;
  };

  module Entrepreneur {
    public func compare(e1 : Entrepreneur, e2 : Entrepreneur) : Order.Order {
      Text.compare(e1.fullName, e2.fullName);
    };
  };

  module SuccessStory {
    public func compareByDate(s1 : SuccessStory, s2 : SuccessStory) : Order.Order {
      Int.compare(s1.date, s2.date);
    };
  };

  module TrainingResource {
    public func compare(t1 : TrainingResource, t2 : TrainingResource) : Order.Order {
      Text.compare(t1.title, t2.title);
    };
  };

  module CommunityPost {
    public func compareByTimestamp(p1 : CommunityPost, p2 : CommunityPost) : Order.Order {
      Int.compare(p1.timestamp, p2.timestamp);
    };
  };

  let entrepreneurs = Map.empty<Principal, Entrepreneur>();
  let successStories = Map.empty<Nat, SuccessStory>();
  let trainingResources = Map.empty<Nat, TrainingResource>();
  let communityPosts = Map.empty<Nat, CommunityPost>();

  var storyIdCounter = 0;
  var resourceIdCounter = 0;
  var postIdCounter = 0;

  // Entrepreneur operations
  public shared ({ caller }) func registerEntrepreneur(entrepreneur : Entrepreneur) : async () {
    entrepreneurs.add(caller, entrepreneur);
  };

  public query ({ caller }) func getEntrepreneur(user : Principal) : async Entrepreneur {
    switch (entrepreneurs.get(user)) {
      case (null) { Runtime.trap("Entrepreneur does not exist") };
      case (?entrepreneur) { entrepreneur };
    };
  };

  public query ({ caller }) func listEntrepreneurs() : async [Entrepreneur] {
    entrepreneurs.values().toArray().sort();
  };

  // Success Stories operations
  public shared ({ caller }) func addSuccessStory(story : SuccessStory) : async () {
    let newStory = { story with id = storyIdCounter };
    successStories.add(storyIdCounter, newStory);
    storyIdCounter += 1;
  };

  public query ({ caller }) func listSuccessStories() : async [SuccessStory] {
    successStories.values().toArray().sort(SuccessStory.compareByDate);
  };

  // Training Resources operations
  public shared ({ caller }) func addTrainingResource(resource : TrainingResource) : async () {
    let newResource = { resource with id = resourceIdCounter };
    trainingResources.add(resourceIdCounter, newResource);
    resourceIdCounter += 1;
  };

  public query ({ caller }) func listTrainingResources() : async [TrainingResource] {
    trainingResources.values().toArray().sort();
  };

  // Community Posts operations
  public shared ({ caller }) func addCommunityPost(post : CommunityPost) : async () {
    let newPost = { post with id = postIdCounter };
    communityPosts.add(postIdCounter, newPost);
    postIdCounter += 1;
  };

  public query ({ caller }) func listCommunityPosts() : async [CommunityPost] {
    communityPosts.values().toArray().sort(CommunityPost.compareByTimestamp);
  };
};
