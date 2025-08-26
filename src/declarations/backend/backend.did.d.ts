import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CanisterMetrics {
  'storage_used_bytes' : bigint,
  'total_queries' : bigint,
  'total_users' : bigint,
  'learning_events' : bigint,
  'uptime_start' : bigint,
  'knowledge_nodes_created' : bigint,
  'total_cycles_consumed' : bigint,
}
export interface CommunicationStyle {
  'formality_level' : FormalityLevel,
  'technical_level' : TechnicalLevel,
  'emoji_usage' : boolean,
  'detail_preference' : DetailLevel,
  'humor_preference' : boolean,
}
export interface ConsentLink {
  'id' : string,
  'access_level' : string,
  'name' : string,
  'created_at' : bigint,
  'is_active' : boolean,
  'expires_at' : [] | [bigint],
}
export interface ConversationContext {
  'topic' : string,
  'last_message_timestamp' : bigint,
  'user_sentiment' : Sentiment,
  'ongoing_tasks' : Array<Task>,
  'related_memories' : Array<string>,
  'mentioned_entities' : Array<Entity>,
  'thread_id' : string,
}
export interface ConversationPatterns {
  'question_types' : Array<[string, number]>,
  'avg_session_length' : number,
  'common_topics' : Array<string>,
  'time_patterns' : Uint32Array | number[],
}
export type DetailLevel = { 'Detailed' : null } |
  { 'Comprehensive' : null } |
  { 'Brief' : null } |
  { 'Moderate' : null };
export interface EnhancedChatMessage {
  'ii_verified' : [] | [boolean],
  'content' : string,
  'provider' : string,
  'context_thread_id' : [] | [string],
  'role' : string,
  'user_sentiment' : [] | [Sentiment],
  'extracted_facts' : Array<ExtractedFact>,
  'referenced_memories' : Array<string>,
  'learned_preferences' : Array<LearnedPreference>,
  'timestamp' : bigint,
  'cycles_cost' : [] | [bigint],
  'response_strategy' : [] | [ResponseStrategy],
  'content_stored_on_chain' : [] | [boolean],
}
export interface Entity {
  'context' : string,
  'name' : string,
  'entity_type' : EntityType,
}
export type EntityType = { 'Date' : null } |
  { 'Company' : null } |
  { 'Person' : null } |
  { 'Technology' : null } |
  { 'Location' : null } |
  { 'Project' : null } |
  { 'Other' : null };
export interface ExtractedFact {
  'fact_type' : FactType,
  'fact' : string,
  'confidence' : number,
  'should_remember' : boolean,
}
export type FactType = { 'Goal' : null } |
  { 'Knowledge' : null } |
  { 'Experience' : null } |
  { 'Preference' : null } |
  { 'PersonalInfo' : null } |
  { 'Relationship' : null };
export type FormalityLevel = { 'VeryFormal' : null } |
  { 'Formal' : null } |
  { 'Verycasual' : null } |
  { 'Casual' : null };
export interface ImportantEvent {
  'date' : bigint,
  'importance' : number,
  'event' : string,
  'category' : string,
}
export interface KnowledgeEdge {
  'from_node' : string,
  'to_node' : string,
  'created_at' : bigint,
  'relationship_type' : RelationshipType,
  'strength' : number,
}
export interface LearnedPreference {
  'preference' : string,
  'category' : string,
  'confidence' : number,
}
export interface LearningHistory {
  'interaction_count' : number,
  'last_major_update' : bigint,
  'topics_discussed' : Array<[string, number]>,
  'preferred_response_length' : ResponseLength,
  'question_asking_frequency' : number,
  'learning_speed' : number,
}
export interface MemoryNode {
  'id' : string,
  'node_type' : MemoryNodeType,
  'content' : string,
  'tags' : Array<string>,
  'created_at' : bigint,
  'last_accessed' : bigint,
  'related_conversations' : Array<string>,
  'importance_score' : number,
  'access_count' : number,
}
export type MemoryNodeType = { 'Fact' : null } |
  { 'Goal' : null } |
  { 'Knowledge' : null } |
  { 'Experience' : null } |
  { 'Preference' : null } |
  { 'Context' : null } |
  { 'Relationship' : null };
export interface MilestoneCapsule {
  'id' : string,
  'title' : string,
  'content' : string,
  'unlock_date' : bigint,
  'tags' : Array<string>,
  'created_at' : bigint,
  'is_unlocked' : boolean,
}
export interface PersonalGoal {
  'goal' : string,
  'importance' : number,
  'progress' : number,
  'category' : string,
  'target_date' : [] | [bigint],
}
export interface PersonalKnowledgeGraph {
  'learning_patterns' : LearningHistory,
  'last_updated' : bigint,
  'relationships' : Array<KnowledgeEdge>,
  'context_threads' : Array<[string, ConversationContext]>,
  'memory_nodes' : Array<[string, MemoryNode]>,
  'user_profile' : UserProfile,
}
export interface PersonalRelationship {
  'context' : string,
  'name' : string,
  'importance' : number,
  'relationship_type' : string,
}
export type RelationshipType = { 'PartOf' : null } |
  { 'Related' : null } |
  { 'UsedFor' : null } |
  { 'OppositeOf' : null } |
  { 'ExampleOf' : null } |
  { 'LeadsTo' : null } |
  { 'CausedBy' : null };
export type ResponseLength = { 'Short' : null } |
  { 'Long' : null } |
  { 'Medium' : null } |
  { 'Variable' : null };
export interface ResponsePreferences {
  'autopilot_enabled' : boolean,
  'prefers_step_by_step' : boolean,
  'prefers_detailed_explanations' : boolean,
  'prefers_quick_answers' : boolean,
  'prefers_examples' : boolean,
}
export type ResponseStrategy = {
    'InquiryFirst' : { 'question' : string, 'why_asking' : string }
  } |
  {
    'PartialAnswer' : { 'partial_info' : string, 'follow_up_needed' : string }
  } |
  { 'BoostedAnswer' : null } |
  { 'ConfidentAnswer' : { 'sources' : Array<string>, 'confidence' : number } } |
  { 'LearningOpportunity' : { 'suggestion' : string } };
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : UserDataExport } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Array<string> } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Array<ConsentLink> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : UserDashboard } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Array<MilestoneCapsule> } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Array<SmartRoutine> } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<MemoryNode> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : null } |
  { 'Err' : string };
export type Sentiment = { 'Negative' : null } |
  { 'Excited' : null } |
  { 'Curious' : null } |
  { 'Frustrated' : null } |
  { 'Positive' : null } |
  { 'Neutral' : null };
export interface SmartRoutine {
  'id' : string,
  'last_completed' : [] | [bigint],
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'category' : string,
  'is_active' : boolean,
  'frequency' : string,
}
export type SubscriptionTier = {
    'Premium' : { 'cycles_included' : bigint, 'priority_access' : boolean }
  } |
  {
    'Enterprise' : {
      'cycles_included' : bigint,
      'private_models' : boolean,
      'custom_endpoints' : boolean,
    }
  } |
  { 'Basic' : { 'cycles_included' : bigint } };
export interface Task {
  'status' : TaskStatus,
  'description' : string,
  'created_at' : bigint,
  'due_date' : [] | [bigint],
}
export type TaskStatus = { 'Paused' : null } |
  { 'Active' : null } |
  { 'Cancelled' : null } |
  { 'Completed' : null };
export type TechnicalLevel = { 'Beginner' : null } |
  { 'Advanced' : null } |
  { 'Intermediate' : null } |
  { 'Expert' : null };
export interface UserDashboard {
  'cycles_balance' : bigint,
  'days_since_first_interaction' : bigint,
  'total_cycles_spent' : bigint,
  'knowledge_nodes_count' : bigint,
  'learning_progress' : number,
  'stored_content_count' : bigint,
  'memory_strength' : number,
  'subscription_tier' : [] | [SubscriptionTier],
  'token_balance' : bigint,
  'conversation_count' : bigint,
}
export interface UserDataExport {
  'knowledge_graph' : PersonalKnowledgeGraph,
  'exported_at' : bigint,
  'user_id' : string,
  'conversations' : Array<EnhancedChatMessage>,
}
export interface UserProfile {
  'preferred_name' : [] | [string],
  'personality_traits' : Array<string>,
  'interests' : Array<string>,
  'auto_transcribe' : [] | [boolean],
  'name' : [] | [string],
  'response_preferences' : ResponsePreferences,
  'voice_language' : [] | [string],
  'work_context' : [] | [WorkContext],
  'knowledge_domains' : Array<[string, number]>,
  'goals' : Array<PersonalGoal>,
  'important_dates' : Array<ImportantEvent>,
  'expertise_areas' : Array<string>,
  'relationships' : Array<PersonalRelationship>,
  'conversation_patterns' : ConversationPatterns,
  'voice_commands_enabled' : [] | [boolean],
  'communication_style' : CommunicationStyle,
}
export interface UserProfileUpdate {
  'interests' : [] | [Array<string>],
  'name' : [] | [string],
  'response_preferences' : [] | [ResponsePreferences],
  'goals' : [] | [Array<PersonalGoal>],
}
export interface VoiceNote {
  'id' : string,
  'content' : string,
  'owner' : Principal,
  'duration_seconds' : number,
  'created_at' : bigint,
  'transcript' : [] | [string],
}
export interface WorkContext {
  'job_title' : [] | [string],
  'company' : [] | [string],
  'current_projects' : Array<string>,
  'skills' : Array<string>,
  'industry' : [] | [string],
}
export interface _SERVICE {
  'boost_response_with_cycles' : ActorMethod<[string, bigint], Result>,
  'create_consent_link' : ActorMethod<[Principal, ConsentLink], Result>,
  'create_milestone_capsule' : ActorMethod<
    [Principal, MilestoneCapsule],
    Result
  >,
  'create_smart_routine' : ActorMethod<[Principal, SmartRoutine], Result>,
  'export_user_data' : ActorMethod<[Principal], Result_1>,
  'get_ai_coach_suggestions' : ActorMethod<[Principal, string], Result_2>,
  'get_available_providers' : ActorMethod<[], Array<string>>,
  'get_canister_metrics' : ActorMethod<[], CanisterMetrics>,
  'get_documents' : ActorMethod<[Principal], Array<VoiceNote>>,
  'get_user_consent_links' : ActorMethod<[Principal], Result_3>,
  'get_user_conversations' : ActorMethod<
    [Principal],
    Array<EnhancedChatMessage>
  >,
  'get_user_cycles_balance' : ActorMethod<[Principal], bigint>,
  'get_user_dashboard' : ActorMethod<[Principal], Result_4>,
  'get_user_knowledge_graph' : ActorMethod<
    [Principal],
    [] | [PersonalKnowledgeGraph]
  >,
  'get_user_memories' : ActorMethod<
    [Principal, [] | [number]],
    Array<MemoryNode>
  >,
  'get_user_milestone_capsules' : ActorMethod<[Principal], Result_5>,
  'get_user_routines' : ActorMethod<[Principal], Result_6>,
  'greet' : ActorMethod<[string], string>,
  'icp_ai_prompt' : ActorMethod<
    [string, [] | [string], [] | [string], [] | [boolean]],
    Result
  >,
  'memory_mind_prompt' : ActorMethod<
    [string, Array<string>, Array<boolean>],
    Result
  >,
  'process_voice_input' : ActorMethod<
    [Principal, Uint8Array | number[], string, string],
    Result
  >,
  'prompt' : ActorMethod<[string], Result>,
  'save_conversation' : ActorMethod<[Principal, EnhancedChatMessage], Result>,
  'search_user_memories' : ActorMethod<
    [Principal, string, [] | [number]],
    Result_7
  >,
  'set_api_key' : ActorMethod<[string], undefined>,
  'update_user_preferences' : ActorMethod<
    [Principal, ResponsePreferences],
    Result
  >,
  'update_user_profile' : ActorMethod<[Principal, UserProfileUpdate], Result>,
  'update_voice_preferences' : ActorMethod<
    [Principal, string, boolean, boolean],
    Result_8
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
