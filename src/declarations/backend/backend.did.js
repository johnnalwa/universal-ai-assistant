export const idlFactory = ({ IDL }) => {
  const CanisterMetrics = IDL.Record({
    'storage_used_bytes' : IDL.Nat64,
    'total_queries' : IDL.Nat64,
    'total_users' : IDL.Nat64,
    'learning_events' : IDL.Nat64,
    'uptime_start' : IDL.Nat64,
    'knowledge_nodes_created' : IDL.Nat64,
    'total_cycles_consumed' : IDL.Nat64,
  });
  const Sentiment = IDL.Variant({
    'Negative' : IDL.Null,
    'Excited' : IDL.Null,
    'Curious' : IDL.Null,
    'Frustrated' : IDL.Null,
    'Positive' : IDL.Null,
    'Neutral' : IDL.Null,
  });
  const FactType = IDL.Variant({
    'Goal' : IDL.Null,
    'Knowledge' : IDL.Null,
    'Experience' : IDL.Null,
    'Preference' : IDL.Null,
    'PersonalInfo' : IDL.Null,
    'Relationship' : IDL.Null,
  });
  const ExtractedFact = IDL.Record({
    'fact_type' : FactType,
    'fact' : IDL.Text,
    'confidence' : IDL.Float32,
    'should_remember' : IDL.Bool,
  });
  const LearnedPreference = IDL.Record({
    'preference' : IDL.Text,
    'category' : IDL.Text,
    'confidence' : IDL.Float32,
  });
  const ResponseStrategy = IDL.Variant({
    'InquiryFirst' : IDL.Record({
      'question' : IDL.Text,
      'why_asking' : IDL.Text,
    }),
    'PartialAnswer' : IDL.Record({
      'known_info' : IDL.Text,
      'clarification_needed' : IDL.Text,
    }),
    'ConfidentAnswer' : IDL.Record({
      'sources' : IDL.Vec(IDL.Text),
      'confidence' : IDL.Float32,
    }),
    'LearningOpportunity' : IDL.Record({ 'suggestion' : IDL.Text }),
  });
  const EnhancedChatMessage = IDL.Record({
    'ii_verified' : IDL.Opt(IDL.Bool),
    'content' : IDL.Text,
    'provider' : IDL.Text,
    'context_thread_id' : IDL.Opt(IDL.Text),
    'role' : IDL.Text,
    'user_sentiment' : IDL.Opt(Sentiment),
    'extracted_facts' : IDL.Vec(ExtractedFact),
    'referenced_memories' : IDL.Vec(IDL.Text),
    'learned_preferences' : IDL.Vec(LearnedPreference),
    'timestamp' : IDL.Nat64,
    'cycles_cost' : IDL.Opt(IDL.Nat64),
    'response_strategy' : IDL.Opt(ResponseStrategy),
    'content_stored_on_chain' : IDL.Opt(IDL.Bool),
  });
  const SubscriptionTier = IDL.Variant({
    'Premium' : IDL.Record({
      'cycles_included' : IDL.Nat64,
      'priority_access' : IDL.Bool,
    }),
    'Enterprise' : IDL.Record({
      'cycles_included' : IDL.Nat64,
      'private_models' : IDL.Bool,
      'custom_endpoints' : IDL.Bool,
    }),
    'Basic' : IDL.Record({ 'cycles_included' : IDL.Nat64 }),
  });
  const UserDashboard = IDL.Record({
    'cycles_balance' : IDL.Nat64,
    'days_since_first_interaction' : IDL.Nat64,
    'total_cycles_spent' : IDL.Nat64,
    'knowledge_nodes_count' : IDL.Nat64,
    'learning_progress' : IDL.Float32,
    'stored_content_count' : IDL.Nat64,
    'memory_strength' : IDL.Float32,
    'subscription_tier' : IDL.Opt(SubscriptionTier),
    'token_balance' : IDL.Nat64,
    'conversation_count' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : UserDashboard, 'Err' : IDL.Text });
  const ResponseLength = IDL.Variant({
    'Short' : IDL.Null,
    'Long' : IDL.Null,
    'Medium' : IDL.Null,
    'Variable' : IDL.Null,
  });
  const LearningHistory = IDL.Record({
    'interaction_count' : IDL.Nat32,
    'last_major_update' : IDL.Nat64,
    'topics_discussed' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32)),
    'preferred_response_length' : ResponseLength,
    'question_asking_frequency' : IDL.Float32,
    'learning_speed' : IDL.Float32,
  });
  const RelationshipType = IDL.Variant({
    'PartOf' : IDL.Null,
    'Related' : IDL.Null,
    'UsedFor' : IDL.Null,
    'OppositeOf' : IDL.Null,
    'ExampleOf' : IDL.Null,
    'LeadsTo' : IDL.Null,
    'CausedBy' : IDL.Null,
  });
  const KnowledgeEdge = IDL.Record({
    'from_node' : IDL.Text,
    'to_node' : IDL.Text,
    'created_at' : IDL.Nat64,
    'relationship_type' : RelationshipType,
    'strength' : IDL.Float32,
  });
  const TaskStatus = IDL.Variant({
    'Paused' : IDL.Null,
    'Active' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Completed' : IDL.Null,
  });
  const Task = IDL.Record({
    'status' : TaskStatus,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'due_date' : IDL.Opt(IDL.Nat64),
  });
  const EntityType = IDL.Variant({
    'Date' : IDL.Null,
    'Company' : IDL.Null,
    'Person' : IDL.Null,
    'Technology' : IDL.Null,
    'Location' : IDL.Null,
    'Project' : IDL.Null,
    'Other' : IDL.Null,
  });
  const Entity = IDL.Record({
    'context' : IDL.Text,
    'name' : IDL.Text,
    'entity_type' : EntityType,
  });
  const ConversationContext = IDL.Record({
    'topic' : IDL.Text,
    'last_message_timestamp' : IDL.Nat64,
    'user_sentiment' : Sentiment,
    'ongoing_tasks' : IDL.Vec(Task),
    'related_memories' : IDL.Vec(IDL.Text),
    'mentioned_entities' : IDL.Vec(Entity),
    'thread_id' : IDL.Text,
  });
  const MemoryNodeType = IDL.Variant({
    'Fact' : IDL.Null,
    'Goal' : IDL.Null,
    'Knowledge' : IDL.Null,
    'Experience' : IDL.Null,
    'Preference' : IDL.Null,
    'Context' : IDL.Null,
    'Relationship' : IDL.Null,
  });
  const MemoryNode = IDL.Record({
    'id' : IDL.Text,
    'node_type' : MemoryNodeType,
    'content' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'created_at' : IDL.Nat64,
    'last_accessed' : IDL.Nat64,
    'related_conversations' : IDL.Vec(IDL.Text),
    'importance_score' : IDL.Float32,
    'access_count' : IDL.Nat32,
  });
  const ResponsePreferences = IDL.Record({
    'autopilot_enabled' : IDL.Bool,
    'prefers_step_by_step' : IDL.Bool,
    'prefers_detailed_explanations' : IDL.Bool,
    'prefers_quick_answers' : IDL.Bool,
    'prefers_examples' : IDL.Bool,
  });
  const WorkContext = IDL.Record({
    'job_title' : IDL.Opt(IDL.Text),
    'company' : IDL.Opt(IDL.Text),
    'current_projects' : IDL.Vec(IDL.Text),
    'skills' : IDL.Vec(IDL.Text),
    'industry' : IDL.Opt(IDL.Text),
  });
  const PersonalGoal = IDL.Record({
    'goal' : IDL.Text,
    'importance' : IDL.Float32,
    'progress' : IDL.Float32,
    'category' : IDL.Text,
    'target_date' : IDL.Opt(IDL.Nat64),
  });
  const ImportantEvent = IDL.Record({
    'date' : IDL.Nat64,
    'importance' : IDL.Float32,
    'event' : IDL.Text,
    'category' : IDL.Text,
  });
  const PersonalRelationship = IDL.Record({
    'context' : IDL.Text,
    'name' : IDL.Text,
    'importance' : IDL.Float32,
    'relationship_type' : IDL.Text,
  });
  const ConversationPatterns = IDL.Record({
    'question_types' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat32)),
    'avg_session_length' : IDL.Float32,
    'common_topics' : IDL.Vec(IDL.Text),
    'time_patterns' : IDL.Vec(IDL.Nat32),
  });
  const FormalityLevel = IDL.Variant({
    'VeryFormal' : IDL.Null,
    'Formal' : IDL.Null,
    'Verycasual' : IDL.Null,
    'Casual' : IDL.Null,
  });
  const TechnicalLevel = IDL.Variant({
    'Beginner' : IDL.Null,
    'Advanced' : IDL.Null,
    'Intermediate' : IDL.Null,
    'Expert' : IDL.Null,
  });
  const DetailLevel = IDL.Variant({
    'Detailed' : IDL.Null,
    'Comprehensive' : IDL.Null,
    'Brief' : IDL.Null,
    'Moderate' : IDL.Null,
  });
  const CommunicationStyle = IDL.Record({
    'formality_level' : FormalityLevel,
    'technical_level' : TechnicalLevel,
    'emoji_usage' : IDL.Bool,
    'detail_preference' : DetailLevel,
    'humor_preference' : IDL.Bool,
  });
  const UserProfile = IDL.Record({
    'preferred_name' : IDL.Opt(IDL.Text),
    'personality_traits' : IDL.Vec(IDL.Text),
    'interests' : IDL.Vec(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'response_preferences' : ResponsePreferences,
    'work_context' : IDL.Opt(WorkContext),
    'knowledge_domains' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'goals' : IDL.Vec(PersonalGoal),
    'important_dates' : IDL.Vec(ImportantEvent),
    'expertise_areas' : IDL.Vec(IDL.Text),
    'relationships' : IDL.Vec(PersonalRelationship),
    'conversation_patterns' : ConversationPatterns,
    'communication_style' : CommunicationStyle,
  });
  const PersonalKnowledgeGraph = IDL.Record({
    'learning_patterns' : LearningHistory,
    'last_updated' : IDL.Nat64,
    'relationships' : IDL.Vec(KnowledgeEdge),
    'context_threads' : IDL.Vec(IDL.Tuple(IDL.Text, ConversationContext)),
    'memory_nodes' : IDL.Vec(IDL.Tuple(IDL.Text, MemoryNode)),
    'user_profile' : UserProfile,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const UserProfileUpdate = IDL.Record({
    'interests' : IDL.Opt(IDL.Vec(IDL.Text)),
    'name' : IDL.Opt(IDL.Text),
    'response_preferences' : IDL.Opt(ResponsePreferences),
    'goals' : IDL.Opt(IDL.Vec(PersonalGoal)),
  });
  return IDL.Service({
    'get_available_providers' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'get_canister_metrics' : IDL.Func([], [CanisterMetrics], ['query']),
    'get_user_conversations' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(EnhancedChatMessage)],
        ['query'],
      ),
    'get_user_dashboard' : IDL.Func([IDL.Principal], [Result], ['query']),
    'get_user_knowledge_graph' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(PersonalKnowledgeGraph)],
        ['query'],
      ),
    'get_user_memories' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat32)],
        [IDL.Vec(MemoryNode)],
        ['query'],
      ),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'icp_ai_prompt' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
        [Result_1],
        [],
      ),
    'memory_mind_prompt' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
        [Result_1],
        [],
      ),
    'prompt' : IDL.Func([IDL.Text], [Result_1], []),
    'set_api_key' : IDL.Func([IDL.Text], [], []),
    'update_user_profile' : IDL.Func(
        [IDL.Principal, UserProfileUpdate],
        [Result_1],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
