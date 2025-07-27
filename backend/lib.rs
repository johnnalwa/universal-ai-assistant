use candid::{CandidType, Nat, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

// MemoryMind Enhanced State with Personal Knowledge Graph
#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct State {
    // Original fields for backward compatibility
    api_key: String,
    api_keys: HashMap<String, String>,
    
    // MemoryMind Core: Personal Knowledge Graphs per user
    personal_knowledge_graphs: HashMap<Principal, PersonalKnowledgeGraph>,
    
    // Enhanced conversation storage with learning
    conversations: HashMap<Principal, Vec<EnhancedChatMessage>>,
    
    // ICP-specific features
    user_cycles_balance: HashMap<Principal, u64>,
    icrc_token_balances: HashMap<Principal, u64>,
    ai_content_storage: HashMap<String, AIContent>,
    canister_metrics: CanisterMetrics,
    subscription_tiers: HashMap<Principal, SubscriptionTier>,
}

// MemoryMind Core: Personal Knowledge Graph
#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct PersonalKnowledgeGraph {
    user_profile: UserProfile,
    memory_nodes: HashMap<String, MemoryNode>,
    relationships: Vec<KnowledgeEdge>,
    learning_patterns: LearningHistory,
    context_threads: HashMap<String, ConversationContext>,
    last_updated: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct UserProfile {
    // Basic Identity
    name: Option<String>,
    preferred_name: Option<String>,
    
    // Preferences & Style
    communication_style: CommunicationStyle,
    personality_traits: Vec<String>,
    interests: Vec<String>,
    expertise_areas: Vec<String>,
    
    // Personal Information
    goals: Vec<PersonalGoal>,
    important_dates: Vec<ImportantEvent>,
    relationships: Vec<PersonalRelationship>,
    work_context: Option<WorkContext>,
    
    // Learning Metadata
    knowledge_domains: HashMap<String, f32>, // domain -> expertise level
    conversation_patterns: ConversationPatterns,
    response_preferences: ResponsePreferences,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct MemoryNode {
    id: String,
    content: String,
    node_type: MemoryNodeType,
    importance_score: f32,
    created_at: u64,
    last_accessed: u64,
    access_count: u32,
    tags: Vec<String>,
    related_conversations: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum MemoryNodeType {
    Fact,
    Preference,
    Goal,
    Relationship,
    Experience,
    Knowledge,
    Context,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct KnowledgeEdge {
    from_node: String,
    to_node: String,
    relationship_type: RelationshipType,
    strength: f32,
    created_at: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum RelationshipType {
    Related,
    CausedBy,
    LeadsTo,
    PartOf,
    OppositeOf,
    ExampleOf,
    UsedFor,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct LearningHistory {
    interaction_count: u32,
    topics_discussed: HashMap<String, u32>,
    preferred_response_length: ResponseLength,
    question_asking_frequency: f32,
    learning_speed: f32,
    last_major_update: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct ConversationContext {
    thread_id: String,
    topic: String,
    related_memories: Vec<String>,
    user_sentiment: Sentiment,
    ongoing_tasks: Vec<Task>,
    mentioned_entities: Vec<Entity>,
    last_message_timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct EnhancedChatMessage {
    role: String,
    content: String,
    timestamp: u64,
    provider: String,
    
    // MemoryMind enhancements
    context_thread_id: Option<String>,
    extracted_facts: Vec<ExtractedFact>,
    referenced_memories: Vec<String>,
    learned_preferences: Vec<LearnedPreference>,
    user_sentiment: Option<Sentiment>,
    response_strategy: Option<ResponseStrategy>,
    
    // ICP features
    cycles_cost: Option<u64>,
    content_stored_on_chain: Option<bool>,
    ii_verified: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct ExtractedFact {
    fact: String,
    confidence: f32,
    fact_type: FactType,
    should_remember: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum FactType {
    PersonalInfo,
    Preference,
    Goal,
    Relationship,
    Experience,
    Knowledge,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct LearnedPreference {
    category: String,
    preference: String,
    confidence: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum ResponseStrategy {
    ConfidentAnswer { confidence: f32, sources: Vec<String> },
    InquiryFirst { question: String, why_asking: String },
    PartialAnswer { known_info: String, clarification_needed: String },
    LearningOpportunity { suggestion: String },
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum Sentiment {
    Positive,
    Neutral,
    Negative,
    Excited,
    Frustrated,
    Curious,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct CommunicationStyle {
    formality_level: FormalityLevel,
    detail_preference: DetailLevel,
    humor_preference: bool,
    technical_level: TechnicalLevel,
    emoji_usage: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum FormalityLevel {
    VeryFormal,
    Formal,
    Casual,
    Verycasual,
}

impl Default for FormalityLevel {
    fn default() -> Self {
        FormalityLevel::Casual
    }
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum DetailLevel {
    Brief,
    Moderate,
    Detailed,
    Comprehensive,
}

impl Default for DetailLevel {
    fn default() -> Self {
        DetailLevel::Moderate
    }
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum TechnicalLevel {
    Beginner,
    Intermediate,
    Advanced,
    Expert,
}

impl Default for TechnicalLevel {
    fn default() -> Self {
        TechnicalLevel::Intermediate
    }
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum ResponseLength {
    Short,
    Medium,
    Long,
    Variable,
}

impl Default for ResponseLength {
    fn default() -> Self {
        ResponseLength::Medium
    }
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct PersonalGoal {
    goal: String,
    category: String,
    target_date: Option<u64>,
    progress: f32,
    importance: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct ImportantEvent {
    event: String,
    date: u64,
    importance: f32,
    category: String,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct PersonalRelationship {
    name: String,
    relationship_type: String,
    context: String,
    importance: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct WorkContext {
    job_title: Option<String>,
    company: Option<String>,
    industry: Option<String>,
    current_projects: Vec<String>,
    skills: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct ConversationPatterns {
    avg_session_length: f32,
    common_topics: Vec<String>,
    question_types: HashMap<String, u32>,
    time_patterns: Vec<u32>, // Hours when user is most active
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct ResponsePreferences {
    prefers_examples: bool,
    prefers_step_by_step: bool,
    prefers_quick_answers: bool,
    prefers_detailed_explanations: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct Task {
    description: String,
    status: TaskStatus,
    created_at: u64,
    due_date: Option<u64>,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum TaskStatus {
    Active,
    Completed,
    Paused,
    Cancelled,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct Entity {
    name: String,
    entity_type: EntityType,
    context: String,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum EntityType {
    Person,
    Company,
    Project,
    Technology,
    Location,
    Date,
    Other,
}

// Keep existing structures for compatibility
#[derive(Serialize, Deserialize, Clone, CandidType)]
struct AIContent {
    content: String,
    content_type: String,
    creator: Principal,
    created_at: u64,
    size_bytes: u64,
    access_level: AccessLevel,
    cycles_cost_to_create: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum AccessLevel {
    Public,
    Private,
    Community,
    Premium,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
enum SubscriptionTier {
    Basic { cycles_included: u64 },
    Premium { cycles_included: u64, priority_access: bool },
    Enterprise { cycles_included: u64, private_models: bool, custom_endpoints: bool },
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct CanisterMetrics {
    total_queries: u64,
    total_cycles_consumed: u64,
    total_users: u64,
    storage_used_bytes: u64,
    uptime_start: u64,
    knowledge_nodes_created: u64,
    learning_events: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct UserDashboard {
    cycles_balance: u64,
    token_balance: u64,
    conversation_count: u64,
    stored_content_count: u64,
    subscription_tier: Option<SubscriptionTier>,
    total_cycles_spent: u64,
    
    // MemoryMind specific
    knowledge_nodes_count: u64,
    memory_strength: f32,
    learning_progress: f32,
    days_since_first_interaction: u64,
}

// Gemini API structures (unchanged)
#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<Content>,
}

#[derive(Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Serialize)]
struct Part {
    text: String,
}

#[derive(Deserialize, Debug)]
struct GeminiResponse {
    candidates: Vec<Candidate>,
}

#[derive(Deserialize, Debug)]
struct Candidate {
    content: ContentResponse,
}

#[derive(Deserialize, Debug)]
struct ContentResponse {
    parts: Vec<PartResponse>,
}

#[derive(Deserialize, Debug)]
struct PartResponse {
    text: String,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

// MemoryMind Core Functions

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}! I'm MemoryMind, your personal AI that learns and remembers. Let's build your knowledge graph together!", name)
}

#[ic_cdk::update]
fn set_api_key(key: String) {
    let caller = ic_cdk::caller();
    if ic_cdk::api::is_controller(&caller) {
        STATE.with(|state| {
            let mut state = state.borrow_mut();
            state.api_key = key.clone();
            state.api_keys.insert("gemini".to_string(), key);
        });
        ic_cdk::println!("API key set successfully");
    } else {
        ic_cdk::trap("Only a controller can set the API key.");
    }
}

// Enhanced MemoryMind AI Function
#[ic_cdk::update]
async fn memory_mind_prompt(
    prompt_text: String,
    context_thread_id: Option<String>,
    _learn_from_response: Option<bool>,
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Initialize user's knowledge graph if first time
    ensure_user_knowledge_graph(caller);
    
    // Extract context and memories
    let (user_context, relevant_memories) = get_user_context_and_memories(caller, &prompt_text, context_thread_id.clone());
    
    // Determine response strategy
    let response_strategy = determine_response_strategy(caller, &prompt_text, &relevant_memories);
    
    match &response_strategy {
        ResponseStrategy::InquiryFirst { question, why_asking } => {
            // Ask for clarification instead of assuming
            let response = format!("🤔 {}\n\n({})", question, why_asking);
            save_conversation_with_learning(caller, prompt_text.clone(), response.clone(), context_thread_id, response_strategy).await;
            Ok(response)
        },
        ResponseStrategy::PartialAnswer { known_info, clarification_needed } => {
            let response = format!("Based on what I know about you: {}\n\n❓ {}", known_info, clarification_needed);
            save_conversation_with_learning(caller, prompt_text.clone(), response.clone(), context_thread_id, response_strategy).await;
            Ok(response)
        },
        ResponseStrategy::ConfidentAnswer { confidence: _, sources: _ } => {
            // Generate AI response with full context
            let ai_response = generate_contextual_ai_response(caller, prompt_text.clone(), user_context, relevant_memories).await?;
            save_conversation_with_learning(caller, prompt_text.clone(), ai_response.clone(), context_thread_id, response_strategy).await;
            Ok(ai_response)
        },
        ResponseStrategy::LearningOpportunity { suggestion } => {
            let response = format!("💡 {}\n\nWould you like me to remember this for future conversations?", suggestion);
            save_conversation_with_learning(caller, prompt_text.clone(), response.clone(), context_thread_id, response_strategy).await;
            Ok(response)
        },
    }
}

fn ensure_user_knowledge_graph(user: Principal) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if !state.personal_knowledge_graphs.contains_key(&user) {
            let new_graph = PersonalKnowledgeGraph {
                user_profile: UserProfile::default(),
                memory_nodes: HashMap::new(),
                relationships: Vec::new(),
                learning_patterns: LearningHistory::default(),
                context_threads: HashMap::new(),
                last_updated: ic_cdk::api::time(),
            };
            state.personal_knowledge_graphs.insert(user, new_graph);
        }
    });
}

fn get_user_context_and_memories(user: Principal, prompt: &str, _context_thread_id: Option<String>) -> (String, Vec<MemoryNode>) {
    STATE.with(|state| {
        let state = state.borrow();
        let graph = state.personal_knowledge_graphs.get(&user);
        
        match graph {
            Some(kg) => {
                // Build user context string
                let mut context = String::new();
                
                if let Some(name) = &kg.user_profile.name {
                    context.push_str(&format!("User's name: {}\n", name));
                }
                
                if !kg.user_profile.interests.is_empty() {
                    context.push_str(&format!("Interests: {}\n", kg.user_profile.interests.join(", ")));
                }
                
                if !kg.user_profile.goals.is_empty() {
                    context.push_str("Current goals:\n");
                    for goal in &kg.user_profile.goals {
                        context.push_str(&format!("- {} ({}% complete)\n", goal.goal, (goal.progress * 100.0) as u32));
                    }
                }
                
                // Find relevant memories based on keyword matching (simple implementation)
                let relevant_memories: Vec<MemoryNode> = kg.memory_nodes.values()
                    .filter(|node| {
                        let prompt_lower = prompt.to_lowercase();
                        node.content.to_lowercase().contains(&prompt_lower) ||
                        node.tags.iter().any(|tag| prompt_lower.contains(&tag.to_lowercase()))
                    })
                    .take(5) // Limit to 5 most relevant
                    .cloned()
                    .collect();
                
                (context, relevant_memories)
            },
            None => ("New user - no previous context".to_string(), Vec::new())
        }
    })
}

fn determine_response_strategy(user: Principal, prompt: &str, relevant_memories: &[MemoryNode]) -> ResponseStrategy {
    STATE.with(|state| {
        let state = state.borrow();
        let graph = state.personal_knowledge_graphs.get(&user);
        
        // Check if this is a new user with minimal information
        if let Some(kg) = graph {
            // For new users, still use AI but with a learning focus
            if kg.user_profile.name.is_none() && kg.memory_nodes.is_empty() {
                // Instead of hardcoded response, use AI with learning opportunity
                return ResponseStrategy::ConfidentAnswer {
                    confidence: 0.7,
                    sources: Vec::new(),
                };
            }
            
            // Check if prompt is asking about something we don't know
            if prompt.to_lowercase().contains("my") || prompt.to_lowercase().contains("i ") {
                if relevant_memories.is_empty() && !contains_personal_context(prompt) {
                    return ResponseStrategy::InquiryFirst {
                        question: format!("I want to give you the most helpful response. Could you provide a bit more context about {}?", extract_topic_from_prompt(prompt)),
                        why_asking: "This helps me understand your specific situation and give you better advice".to_string(),
                    };
                }
            }
            
            // If we have some relevant memories, we can give a confident answer
            if !relevant_memories.is_empty() {
                return ResponseStrategy::ConfidentAnswer {
                    confidence: 0.8,
                    sources: relevant_memories.iter().map(|m| m.id.clone()).collect(),
                };
            }
            
            // If it's a learning opportunity
            if is_learning_opportunity(prompt) {
                return ResponseStrategy::LearningOpportunity {
                    suggestion: "I can help you with this and remember your preferences for next time".to_string(),
                };
            }
        }
        
        // Default to confident answer for general questions
        ResponseStrategy::ConfidentAnswer {
            confidence: 0.6,
            sources: Vec::new(),
        }
    })
}

fn contains_personal_context(prompt: &str) -> bool {
    let personal_indicators = ["my name is", "i am", "i work", "i like", "i prefer", "i usually"];
    let prompt_lower = prompt.to_lowercase();
    personal_indicators.iter().any(|indicator| prompt_lower.contains(indicator))
}

fn extract_topic_from_prompt(prompt: &str) -> String {
    // Simple topic extraction - in a real implementation, this would be more sophisticated
    if prompt.len() > 50 {
        format!("{}...", &prompt[..50])
    } else {
        prompt.to_string()
    }
}

fn is_learning_opportunity(_prompt: &str) -> bool {
    // Determine if this is a good opportunity to learn something new about the user
    true // Simplified for now
}

async fn generate_contextual_ai_response(
    _user: Principal,
    prompt: String,
    user_context: String,
    relevant_memories: Vec<MemoryNode>,
) -> Result<String, String> {
    let api_key = STATE.with(|state| {
        let state = state.borrow();
        state.api_key.clone()
    });
    
    if api_key.is_empty() {
        return Err("API key is not set".to_string());
    }
    
    // Build enhanced prompt with user context and memories
    let mut enhanced_prompt = String::new();
    
    enhanced_prompt.push_str("You are MemoryMind, a personal AI assistant that learns and remembers everything about the user. ");
    enhanced_prompt.push_str("Use the following context to provide a personalized response:\n\n");
    
    if !user_context.trim().is_empty() {
        enhanced_prompt.push_str(&format!("USER CONTEXT:\n{}\n", user_context));
    }
    
    if !relevant_memories.is_empty() {
        enhanced_prompt.push_str("RELEVANT MEMORIES:\n");
        for memory in &relevant_memories {
            enhanced_prompt.push_str(&format!("- {} ({})\n", memory.content, memory.node_type.to_string()));
        }
        enhanced_prompt.push_str("\n");
    }
    
    enhanced_prompt.push_str(&format!("USER QUESTION: {}\n\n", prompt));
    enhanced_prompt.push_str("Provide a helpful, personalized response that references relevant context and memories when appropriate. ");
    enhanced_prompt.push_str("Be conversational and show that you remember previous interactions.");
    
    call_gemini_api(enhanced_prompt, api_key).await
}

async fn save_conversation_with_learning(
    user: Principal,
    user_message: String,
    ai_response: String,
    context_thread_id: Option<String>,
    response_strategy: ResponseStrategy,
) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        // Extract facts from user message
        let extracted_facts = extract_facts_from_message(&user_message);
        
        // Update knowledge graph
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            // Learn from extracted facts
            for fact in &extracted_facts {
                if fact.should_remember {
                    let memory_node = MemoryNode {
                        id: format!("memory_{}_{}", user.to_text(), ic_cdk::api::time()),
                        content: fact.fact.clone(),
                        node_type: match fact.fact_type {
                            FactType::PersonalInfo => MemoryNodeType::Fact,
                            FactType::Preference => MemoryNodeType::Preference,
                            FactType::Goal => MemoryNodeType::Goal,
                            FactType::Relationship => MemoryNodeType::Relationship,
                            FactType::Experience => MemoryNodeType::Experience,
                            FactType::Knowledge => MemoryNodeType::Knowledge,
                        },
                        importance_score: fact.confidence,
                        created_at: ic_cdk::api::time(),
                        last_accessed: ic_cdk::api::time(),
                        access_count: 1,
                        tags: Vec::new(),
                        related_conversations: Vec::new(),
                    };
                    kg.memory_nodes.insert(memory_node.id.clone(), memory_node);
                }
            }
            
            // Update learning patterns
            kg.learning_patterns.interaction_count += 1;
            kg.last_updated = ic_cdk::api::time();
        }
        
        // Save conversation
        let enhanced_message = EnhancedChatMessage {
            role: "assistant".to_string(),
            content: ai_response,
            timestamp: ic_cdk::api::time(),
            provider: "gemini".to_string(),
            context_thread_id,
            extracted_facts,
            referenced_memories: Vec::new(),
            learned_preferences: Vec::new(),
            user_sentiment: Some(Sentiment::Neutral),
            response_strategy: Some(response_strategy),
            cycles_cost: Some(0),
            content_stored_on_chain: Some(false),
            ii_verified: Some(true),
        };
        
        let conversation = state.conversations.entry(user).or_insert_with(Vec::new);
        conversation.push(enhanced_message);
        
        // Update metrics
        state.canister_metrics.total_queries += 1;
        state.canister_metrics.learning_events += 1;
    });
}

fn extract_facts_from_message(message: &str) -> Vec<ExtractedFact> {
    let mut facts = Vec::new();
    let message_lower = message.to_lowercase();
    
    // Simple fact extraction based on patterns
    if message_lower.contains("my name is") {
        if let Some(name) = extract_name_from_message(message) {
            facts.push(ExtractedFact {
                fact: format!("User's name is {}", name),
                confidence: 0.9,
                fact_type: FactType::PersonalInfo,
                should_remember: true,
            });
        }
    }
    
    if message_lower.contains("i work") || message_lower.contains("i'm a") {
        facts.push(ExtractedFact {
            fact: message.to_string(),
            confidence: 0.7,
            fact_type: FactType::PersonalInfo,
            should_remember: true,
        });
    }
    
    if message_lower.contains("i like") || message_lower.contains("i prefer") {
        facts.push(ExtractedFact {
            fact: message.to_string(),
            confidence: 0.8,
            fact_type: FactType::Preference,
            should_remember: true,
        });
    }
    
    if message_lower.contains("my goal") || message_lower.contains("i want to") {
        facts.push(ExtractedFact {
            fact: message.to_string(),
            confidence: 0.8,
            fact_type: FactType::Goal,
            should_remember: true,
        });
    }
    
    facts
}

fn extract_name_from_message(message: &str) -> Option<String> {
    // Simple name extraction - in production, this would be more sophisticated
    if let Some(pos) = message.to_lowercase().find("my name is") {
        let after_phrase = &message[pos + 11..];
        let name = after_phrase.split_whitespace().next()?;
        Some(name.trim_end_matches(&['.', ',', '!', '?'][..]).to_string())
    } else {
        None
    }
}

// Backward compatibility functions
#[ic_cdk::update]
async fn prompt(prompt_text: String) -> Result<String, String> {
    memory_mind_prompt(prompt_text, None, Some(true)).await
}

// Enhanced ICP functions with MemoryMind integration
#[ic_cdk::update]
async fn icp_ai_prompt(
    prompt_text: String,
    _provider: Option<String>,
    _assistant_type: Option<String>,
    _store_on_chain: Option<bool>,
) -> Result<String, String> {
    memory_mind_prompt(prompt_text, None, Some(true)).await
}

// MemoryMind specific query functions
#[ic_cdk::query]
fn get_user_knowledge_graph(user: Principal) -> Option<PersonalKnowledgeGraph> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return None;
    }
    
    STATE.with(|state| {
        state.borrow().personal_knowledge_graphs.get(&user).cloned()
    })
}

#[ic_cdk::query]
fn get_user_memories(user: Principal, limit: Option<u32>) -> Vec<MemoryNode> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Vec::new();
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let limit = limit.unwrap_or(50) as usize;
            kg.memory_nodes.values()
                .take(limit)
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    })
}

#[ic_cdk::update]
fn update_user_profile(user: Principal, profile_update: UserProfileUpdate) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            if let Some(name) = profile_update.name {
                kg.user_profile.name = Some(name);
            }
            if let Some(interests) = profile_update.interests {
                kg.user_profile.interests = interests;
            }
            kg.last_updated = ic_cdk::api::time();
            Ok("Profile updated successfully".to_string())
        } else {
            Err("User knowledge graph not found".to_string())
        }
    })
}

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct UserProfileUpdate {
    name: Option<String>,
    interests: Option<Vec<String>>,
    goals: Option<Vec<PersonalGoal>>,
}

// Enhanced dashboard with MemoryMind metrics
#[ic_cdk::query]
fn get_user_dashboard(user: Principal) -> Result<UserDashboard, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        let knowledge_nodes_count = state.personal_knowledge_graphs
            .get(&user)
            .map(|kg| kg.memory_nodes.len() as u64)
            .unwrap_or(0);
        
        let memory_strength = calculate_memory_strength(&user, &state);
        let learning_progress = calculate_learning_progress(&user, &state);
        
        Ok(UserDashboard {
            cycles_balance: state.user_cycles_balance.get(&user).copied().unwrap_or(0),
            token_balance: state.icrc_token_balances.get(&user).copied().unwrap_or(0),
            conversation_count: state.conversations.get(&user).map(|c| c.len() as u64).unwrap_or(0),
            stored_content_count: 0,
            subscription_tier: state.subscription_tiers.get(&user).cloned(),
            total_cycles_spent: 0,
            knowledge_nodes_count,
            memory_strength,
            learning_progress,
            days_since_first_interaction: calculate_days_since_first_interaction(&user, &state),
        })
    })
}

fn calculate_memory_strength(user: &Principal, state: &State) -> f32 {
    if let Some(kg) = state.personal_knowledge_graphs.get(user) {
        let node_count = kg.memory_nodes.len() as f32;
        let relationship_count = kg.relationships.len() as f32;
        let interaction_count = kg.learning_patterns.interaction_count as f32;
        
        (node_count * 0.4 + relationship_count * 0.3 + interaction_count * 0.3) / 100.0
    } else {
        0.0
    }
}

fn calculate_learning_progress(user: &Principal, state: &State) -> f32 {
    if let Some(kg) = state.personal_knowledge_graphs.get(user) {
        let profile_completeness = calculate_profile_completeness(&kg.user_profile);
        let interaction_factor = (kg.learning_patterns.interaction_count as f32).min(100.0) / 100.0;
        
        (profile_completeness + interaction_factor) / 2.0
    } else {
        0.0
    }
}

fn calculate_profile_completeness(profile: &UserProfile) -> f32 {
    let mut score = 0.0;
    let mut total_fields = 0.0;
    
    if profile.name.is_some() { score += 1.0; }
    total_fields += 1.0;
    
    if !profile.interests.is_empty() { score += 1.0; }
    total_fields += 1.0;
    
    if !profile.goals.is_empty() { score += 1.0; }
    total_fields += 1.0;
    
    if profile.work_context.is_some() { score += 1.0; }
    total_fields += 1.0;
    
    score / total_fields
}

fn calculate_days_since_first_interaction(user: &Principal, state: &State) -> u64 {
    if let Some(kg) = state.personal_knowledge_graphs.get(user) {
        let first_interaction = kg.memory_nodes.values()
            .map(|node| node.created_at)
            .min()
            .unwrap_or(ic_cdk::api::time());
        
        let current_time = ic_cdk::api::time();
        let nanoseconds_diff = current_time - first_interaction;
        nanoseconds_diff / (24 * 60 * 60 * 1_000_000_000) // Convert to days
    } else {
        0
    }
}

// Utility functions for MemoryNodeType display
impl MemoryNodeType {
    fn to_string(&self) -> &'static str {
        match self {
            MemoryNodeType::Fact => "Fact",
            MemoryNodeType::Preference => "Preference",
            MemoryNodeType::Goal => "Goal",
            MemoryNodeType::Relationship => "Relationship",
            MemoryNodeType::Experience => "Experience",
            MemoryNodeType::Knowledge => "Knowledge",
            MemoryNodeType::Context => "Context",
        }
    }
}

// Keep existing utility functions
async fn call_gemini_api(prompt: String, api_key: String) -> Result<String, String> {
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={}",
        api_key
    );

    let request_body = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt }],
        }],
    };

    let request_body_bytes = serde_json::to_vec(&request_body)
        .map_err(|e| format!("Serialization error: {}", e))?;

    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::POST,
        body: Some(request_body_bytes),
        max_response_bytes: Some(16384),
        transform: None,
        headers: vec![
            HttpHeader {
                name: "Content-Type".to_string(),
                value: "application/json".to_string(),
            },
        ],
    };

    match http_request(request, 20_000_000_000).await {
        Ok((response,)) => {
            if response.status >= Nat::from(200u32) && response.status < Nat::from(300u32) {
                let response_body: GeminiResponse = serde_json::from_slice(&response.body)
                    .map_err(|e| format!("Failed to parse response: {}", e))?;

                if let Some(candidate) = response_body.candidates.get(0) {
                    if let Some(part) = candidate.content.parts.get(0) {
                        return Ok(part.text.clone());
                    }
                }
                Err("No content found in Gemini response".to_string())
            } else {
                Err(format!(
                    "API call failed with status {}: {}",
                    response.status,
                    String::from_utf8_lossy(&response.body)
                ))
            }
        }
        Err((code, msg)) => Err(format!("HTTP request failed: {:?} {}", code, msg)),
    }
}

// Keep existing functions for backward compatibility
#[ic_cdk::query]
fn get_available_providers() -> Vec<String> {
    STATE.with(|state| {
        state.borrow().api_keys.keys().cloned().collect()
    })
}

#[ic_cdk::query]
fn get_canister_metrics() -> CanisterMetrics {
    STATE.with(|state| state.borrow().canister_metrics.clone())
}

ic_cdk::export_candid!();