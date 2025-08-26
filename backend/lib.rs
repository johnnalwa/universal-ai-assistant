use candid::{CandidType, Nat, Principal};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use ic_cdk::{query, update};
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
#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
struct PersonalKnowledgeGraph {
    user_profile: UserProfile,
    memory_nodes: HashMap<String, MemoryNode>,
    relationships: Vec<KnowledgeEdge>,
    learning_patterns: LearningHistory,
    context_threads: HashMap<String, ConversationContext>,
    last_updated: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
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
    
    // Voice & Audio Preferences
    voice_language: Option<String>,
    auto_transcribe: Option<bool>,
    voice_commands_enabled: Option<bool>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum MemoryNodeType {
    Fact,
    Preference,
    Goal,
    Relationship,
    Experience,
    Knowledge,
    Context,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct KnowledgeEdge {
    from_node: String,
    to_node: String,
    relationship_type: RelationshipType,
    strength: f32,
    created_at: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum RelationshipType {
    Related,
    CausedBy,
    LeadsTo,
    PartOf,
    OppositeOf,
    ExampleOf,
    UsedFor,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
struct LearningHistory {
    interaction_count: u32,
    topics_discussed: HashMap<String, u32>,
    preferred_response_length: ResponseLength,
    question_asking_frequency: f32,
    learning_speed: f32,
    last_major_update: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct ConversationContext {
    thread_id: String,
    topic: String,
    related_memories: Vec<String>,
    user_sentiment: Sentiment,
    ongoing_tasks: Vec<Task>,
    mentioned_entities: Vec<Entity>,
    last_message_timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct ExtractedFact {
    fact: String,
    confidence: f32,
    fact_type: FactType,
    should_remember: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum FactType {
    PersonalInfo,
    Preference,
    Goal,
    Relationship,
    Experience,
    Knowledge,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct LearnedPreference {
    category: String,
    preference: String,
    confidence: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum Sentiment {
    Positive,
    Neutral,
    Negative,
    Excited,
    Frustrated,
    Curious,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum ResponseStrategy {
    InquiryFirst {
        question: String,
        why_asking: String,
    },
    PartialAnswer {
        partial_info: String,
        follow_up_needed: String,
    },
    ConfidentAnswer {
        confidence: f32,
        sources: Vec<String>,
    },
    LearningOpportunity {
        suggestion: String,
    },
    BoostedAnswer,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
struct CommunicationStyle {
    formality_level: FormalityLevel,
    detail_preference: DetailLevel,
    humor_preference: bool,
    technical_level: TechnicalLevel,
    emoji_usage: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct PersonalGoal {
    goal: String,
    category: String,
    target_date: Option<u64>,
    progress: f32,
    importance: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct ImportantEvent {
    event: String,
    date: u64,
    importance: f32,
    category: String,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct PersonalRelationship {
    name: String,
    relationship_type: String,
    context: String,
    importance: f32,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct WorkContext {
    job_title: Option<String>,
    company: Option<String>,
    industry: Option<String>,
    current_projects: Vec<String>,
    skills: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
struct ConversationPatterns {
    avg_session_length: f32,
    common_topics: Vec<String>,
    question_types: HashMap<String, u32>,
    time_patterns: Vec<u32>, // Hours when user is most active
}

#[derive(Serialize, Deserialize, Clone, CandidType, Default, Debug)]
struct ResponsePreferences {
    prefers_examples: bool,
    prefers_step_by_step: bool,
    prefers_quick_answers: bool,
    prefers_detailed_explanations: bool,
    autopilot_enabled: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct Task {
    description: String,
    status: TaskStatus,
    created_at: u64,
    due_date: Option<u64>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum TaskStatus {
    Active,
    Completed,
    Paused,
    Cancelled,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct Entity {
    name: String,
    entity_type: EntityType,
    context: String,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum EntityType {
    Person,
    Company,
    Project,
    Technology,
    Location,
    Date,
    Other,
}

// Additional structures for new features
#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct SmartRoutine {
    id: String,
    name: String,
    description: String,
    category: String,
    frequency: String,
    is_active: bool,
    created_at: u64,
    last_completed: Option<u64>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct MilestoneCapsule {
    id: String,
    title: String,
    content: String,
    created_at: u64,
    unlock_date: u64,
    is_unlocked: bool,
    tags: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct ConsentLink {
    id: String,
    name: String,
    access_level: String,
    created_at: u64,
    expires_at: Option<u64>,
    is_active: bool,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct UserDataExport {
    user_id: String,
    knowledge_graph: PersonalKnowledgeGraph,
    conversations: Vec<EnhancedChatMessage>,
    exported_at: u64,
}

// Keep existing structures for compatibility
#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct AIContent {
    content: String,
    content_type: String,
    creator: Principal,
    created_at: u64,
    size_bytes: u64,
    access_level: AccessLevel,
    cycles_cost_to_create: u64,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
enum AccessLevel {
    Public,
    Private,
    Community,
    Premium,
}

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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

#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
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
    prompt: String,
    _context: Vec<String>,
    store_conversation: Vec<bool>,
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Initialize user's knowledge graph if first time
    ensure_user_knowledge_graph(caller);
    
    // Get or create user profile
    let user_context = get_user_context_string(caller);
    let relevant_memories = search_relevant_memories(caller, &prompt);
    
    // Generate AI response with context
    let response = generate_contextual_ai_response(
        caller,
        prompt.clone(),
        user_context,
        relevant_memories,
    ).await?;
    
    // Store conversation if requested
    let should_store = store_conversation.get(0).unwrap_or(&true);
    if *should_store {
        save_conversation_with_learning(
            caller,
            prompt,
            response.clone(),
            None,
            ResponseStrategy::ConfidentAnswer {
                confidence: 0.8,
                sources: Vec::new(),
            },
        ).await;
    }
    
    Ok(response)
}

#[update]
async fn boost_response_with_cycles(
    prompt: String,
    cycles_amount: u64,
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    
    // Verify cycles payment (minimum 1M cycles for boost)
    let min_cycles = 1_000_000u64; // ~$0.001
    let available_cycles = ic_cdk::api::call::msg_cycles_available128() as u64;
    
    if available_cycles < cycles_amount || cycles_amount < min_cycles {
        return Err(format!(
            "Insufficient cycles. Required: {}, Available: {}, Minimum: {}",
            cycles_amount, available_cycles, min_cycles
        ));
    }
    
    // Accept cycles payment
    ic_cdk::api::call::msg_cycles_accept128(cycles_amount as u128);
    
    // Get enhanced user context for boosted response
    let user_context = get_enhanced_user_context(caller).await;
    let relevant_memories = search_relevant_memories_deep(caller, &prompt).await;
    
    // Generate boosted AI response with enhanced context
    let response = generate_boosted_ai_response(
        caller,
        prompt.clone(),
        user_context,
        relevant_memories,
        cycles_amount,
    ).await?;
    
    // Store boosted conversation
    save_conversation_with_learning(
        caller,
        prompt,
        response.clone(),
        None,
        ResponseStrategy::BoostedAnswer,
    ).await;
    
    Ok(response)
}

#[query]
fn get_user_cycles_balance(_user: Principal) -> u64 {
    // In a real implementation, this would check the user's cycles balance
    // For now, return canister's cycles balance as reference
    ic_cdk::api::canister_balance128() as u64
}

fn get_user_context_string(user: Principal) -> String {
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
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
            
            context
        } else {
            "New user - no context available yet".to_string()
        }
    })
}

fn search_relevant_memories(user: Principal, query: &str) -> Vec<MemoryNode> {
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let query_lower = query.to_lowercase();
            kg.memory_nodes.values()
                .filter(|memory| {
                    memory.content.to_lowercase().contains(&query_lower) ||
                    memory.tags.iter().any(|tag| tag.to_lowercase().contains(&query_lower))
                })
                .cloned()
                .collect()
        } else {
            Vec::new()
        }
    })
}

async fn get_enhanced_user_context(user: Principal) -> String {
    // Enhanced context for boosted responses
    let basic_context = get_user_context_string(user);
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let mut enhanced_context = basic_context;
            
            // Add detailed conversation history
            if let Some(conversations) = state.conversations.get(&user) {
                let recent_conversations: Vec<String> = conversations
                    .iter()
                    .rev()
                    .take(10) // More history for boosted responses
                    .map(|msg| format!("{}: {}", msg.role, msg.content))
                    .collect();
                
                enhanced_context.push_str(&format!(
                    "\n\nRecent Conversation History (Last 10 messages):\n{}",
                    recent_conversations.join("\n")
                ));
            }
            
            // Add learning patterns
            enhanced_context.push_str(&format!(
                "\n\nUser Learning Patterns:\n- Total Interactions: {}\n- Preferred Response Style: {:?}\n- Communication Patterns: Advanced user with {} total interactions",
                kg.learning_patterns.interaction_count,
                kg.user_profile.communication_style,
                kg.learning_patterns.interaction_count
            ));
            
            enhanced_context
        } else {
            basic_context
        }
    })
}

async fn search_relevant_memories_deep(user: Principal, query: &str) -> Vec<MemoryNode> {
    // Enhanced memory search for boosted responses
    let mut memories = search_relevant_memories(user, query);
    
    // For boosted responses, include more memories and related context
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            // Add related memories through relationships
            let mut additional_memories = Vec::new();
            
            for memory in &memories {
                for relationship in &kg.relationships {
                    if relationship.from_node == memory.id || relationship.to_node == memory.id {
                        let related_id = if relationship.from_node == memory.id {
                            &relationship.to_node
                        } else {
                            &relationship.from_node
                        };
                        
                        if let Some(related_memory) = kg.memory_nodes.get(related_id) {
                            additional_memories.push(related_memory.clone());
                        }
                    }
                }
            }
            
            memories.extend(additional_memories);
            memories.sort_by(|a, b| b.importance_score.partial_cmp(&a.importance_score).unwrap());
            memories.truncate(15); // More memories for boosted responses
        }
    });
    
    memories
}

async fn generate_boosted_ai_response(
    user: Principal,
    prompt: String,
    user_context: String,
    relevant_memories: Vec<MemoryNode>,
    cycles_paid: u64,
) -> Result<String, String> {
    let api_key = STATE.with(|state| {
        let state = state.borrow();
        state.api_key.clone()
    });
    
    if api_key.is_empty() {
        return Err("API key is not set".to_string());
    }
    
    // Build enhanced prompt for boosted response
    let mut enhanced_prompt = String::new();
    enhanced_prompt.push_str("You are MemoryMind, providing a PREMIUM BOOSTED RESPONSE. ");
    enhanced_prompt.push_str("The user has paid for enhanced, comprehensive assistance. ");
    enhanced_prompt.push_str("Provide detailed, thorough, and exceptionally helpful responses. ");
    enhanced_prompt.push_str("Include specific examples, step-by-step guidance, and actionable insights.\n\n");
    
    // Add boost value context
    let boost_value = cycles_paid as f64 / 1_000_000.0 * 0.001; // Convert to USD equivalent
    enhanced_prompt.push_str(&format!(
        "BOOST PAYMENT: User paid {:.4} USD equivalent ({} cycles) for this enhanced response.\n\n",
        boost_value, cycles_paid
    ));
    
    // Get recent conversation history for context
    let recent_conversations = STATE.with(|state| {
        let state = state.borrow();
        state.conversations.get(&user)
            .map(|convs| convs.iter().rev().take(5).cloned().collect::<Vec<_>>())
            .unwrap_or_default()
    });
    
    // Build comprehensive enhanced prompt with conversation history
    let mut enhanced_prompt = String::new();
    enhanced_prompt.push_str("You are MemoryMind, a personal AI assistant with perfect memory of this user. ");
    
    // Add recent conversation context
    if !recent_conversations.is_empty() {
        enhanced_prompt.push_str("RECENT CONVERSATION HISTORY:\n");
        for msg in recent_conversations.iter().rev() {
            enhanced_prompt.push_str(&format!("{}: {}\n", 
                if msg.role == "user" { "User" } else { "You" }, 
                msg.content
            ));
        }
        enhanced_prompt.push_str("\n");
    }
    
    // Add user context
    if !user_context.is_empty() {
        enhanced_prompt.push_str(&format!("USER PROFILE:\n{}\n\n", user_context));
    }
    
    // Add relevant memories
    if !relevant_memories.is_empty() {
        enhanced_prompt.push_str("RELEVANT MEMORIES:\n");
        for memory in &relevant_memories {
            enhanced_prompt.push_str(&format!("- {}\n", memory.content));
        }
        enhanced_prompt.push_str("\n");
    }
    
    enhanced_prompt.push_str("CRITICAL INSTRUCTIONS:\n");
    enhanced_prompt.push_str("- ALWAYS acknowledge the conversation history and maintain continuity\n");
    enhanced_prompt.push_str("- If user says 'hello' again, acknowledge you've spoken before\n");
    enhanced_prompt.push_str("- Reference previous topics, goals, or interactions naturally\n");
    enhanced_prompt.push_str("- Be conversational and remember what the user has told you\n");
    enhanced_prompt.push_str("- Never act like this is your first interaction if you have history\n\n");
    
    enhanced_prompt.push_str(&format!("CURRENT USER MESSAGE: {}", prompt));
    
    call_gemini_api(enhanced_prompt, api_key).await
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

#[allow(dead_code)]
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

#[allow(dead_code)]
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

#[allow(dead_code)]
fn contains_personal_context(prompt: &str) -> bool {
    let personal_indicators = ["my name is", "i am", "i work", "i like", "i prefer", "i usually"];
    let prompt_lower = prompt.to_lowercase();
    personal_indicators.iter().any(|indicator| prompt_lower.contains(indicator))
}

#[allow(dead_code)]
fn extract_topic_from_prompt(prompt: &str) -> String {
    // Simple topic extraction - in a real implementation, this would be more sophisticated
    if prompt.len() > 50 {
        format!("{}...", &prompt[..50])
    } else {
        prompt.to_string()
    }
}

#[allow(dead_code)]
fn is_learning_opportunity(_prompt: &str) -> bool {
    // Determine if this is a good opportunity to learn something new about the user
    true // Simplified for now
}

async fn generate_contextual_ai_response(
    user: Principal,
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
    
    // Get comprehensive user data for enhanced context
    let (user_profile, recent_conversations, conversation_thread) = STATE.with(|state| {
        let state = state.borrow();
        let kg = state.personal_knowledge_graphs.get(&user);
        let conversations = state.conversations.get(&user);
        
        let profile = kg.map(|g| g.user_profile.clone()).unwrap_or_default();
        let recent = conversations
            .map(|c| c.iter().rev().take(5).cloned().collect::<Vec<_>>())
            .unwrap_or_default();
        let thread = kg.and_then(|g| {
            g.context_threads.values().next().cloned()
        });
        
        (profile, recent, thread)
    });
    
    // Build comprehensive enhanced prompt
    let mut enhanced_prompt = String::new();
    
    // Core identity with continuity awareness
    enhanced_prompt.push_str("You are MemoryMind, a personal AI assistant with perfect memory of this user. ");
    
    // Add recent conversation history for continuity
    if !recent_conversations.is_empty() {
        enhanced_prompt.push_str("\nRECENT CONVERSATION HISTORY:\n");
        for msg in recent_conversations.iter().rev() {
            enhanced_prompt.push_str(&format!("{}: {}\n", 
                if msg.role == "user" { "User" } else { "You (MemoryMind)" }, 
                msg.content
            ));
        }
        enhanced_prompt.push_str("\nIMPORTANT: Based on this conversation history, maintain continuity. ");
        enhanced_prompt.push_str("Don't act like this is your first meeting if you've spoken before.\n\n");
    }
    enhanced_prompt.push_str("Always reference relevant past conversations and show you remember the user's context.\n\n");
    
    // User identity and preferences
    if let Some(name) = &user_profile.name {
        enhanced_prompt.push_str(&format!("USER: {}\n", name));
    }
    
    if !user_profile.interests.is_empty() {
        enhanced_prompt.push_str(&format!("INTERESTS: {}\n", user_profile.interests.join(", ")));
    }
    
    if !user_profile.goals.is_empty() {
        enhanced_prompt.push_str("CURRENT GOALS:\n");
        for goal in &user_profile.goals {
            enhanced_prompt.push_str(&format!("- {} ({}% complete)\n", goal.goal, (goal.progress * 100.0) as u32));
        }
    }
    
    // Communication preferences
    let style = &user_profile.communication_style;
    enhanced_prompt.push_str(&format!("COMMUNICATION STYLE: {:?} formality, {:?} detail level\n", 
        style.formality_level, style.detail_preference));
    
    if user_profile.response_preferences.autopilot_enabled {
        enhanced_prompt.push_str("USER PREFERS: Proactive assistance and suggestions\n");
    }
    
    // Recent conversation context
    if !recent_conversations.is_empty() {
        enhanced_prompt.push_str("\nRECENT CONVERSATION HISTORY:\n");
        for (_i, msg) in recent_conversations.iter().enumerate() {
            let role_display = if msg.role == "assistant" { "You" } else { "User" };
            let content_preview = if msg.content.len() > 100 {
                format!("{}...", &msg.content[..100])
            } else {
                msg.content.clone()
            };
            enhanced_prompt.push_str(&format!("{}: {}\n", role_display, content_preview));
        }
    }
    
    // Relevant memories
    if !relevant_memories.is_empty() {
        enhanced_prompt.push_str("\nRELEVANT MEMORIES:\n");
        for memory in &relevant_memories {
            enhanced_prompt.push_str(&format!("- {} ({}), importance: {:.1}\n", 
                memory.content, memory.node_type.to_string(), memory.importance_score));
        }
    }
    
    // Current context
    if !user_context.trim().is_empty() {
        enhanced_prompt.push_str(&format!("\nCURRENT CONTEXT:\n{}\n", user_context));
    }
    
    // Conversation threading context
    if let Some(thread) = conversation_thread {
        enhanced_prompt.push_str(&format!("\nCONVERSATION THREAD: {}\n", thread.topic));
        if !thread.ongoing_tasks.is_empty() {
            enhanced_prompt.push_str("ONGOING TASKS:\n");
            for task in &thread.ongoing_tasks {
                enhanced_prompt.push_str(&format!("- {} (status: {:?})\n", task.description, task.status));
            }
        }
    }
    
    // Current user input
    enhanced_prompt.push_str(&format!("\nCURRENT USER MESSAGE: {}\n\n", prompt));
    
    // Response instructions
    enhanced_prompt.push_str("INSTRUCTIONS:\n");
    enhanced_prompt.push_str("1. Reference previous conversations naturally (\"As we discussed...\", \"Following up on...\")\n");
    enhanced_prompt.push_str("2. Show awareness of user's goals and progress\n");
    enhanced_prompt.push_str("3. Use appropriate communication style based on preferences\n");
    enhanced_prompt.push_str("4. Be proactive - suggest next steps or follow-up actions\n");
    enhanced_prompt.push_str("5. Maintain conversation continuity and context\n");
    enhanced_prompt.push_str("6. If this relates to ongoing tasks, reference and update them\n\n");
    
    enhanced_prompt.push_str("Respond as the user's personal AI that truly knows and remembers them:");
    
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
            
            // Update or create conversation thread
            let thread_id = context_thread_id.as_ref().map(|s| s.clone()).unwrap_or_else(|| format!("thread_{}_{}", user.to_text(), ic_cdk::api::time()));
            let thread = kg.context_threads.entry(thread_id.clone()).or_insert_with(|| ConversationContext {
                thread_id: thread_id.clone(),
                topic: extract_conversation_topic(&user_message),
                related_memories: Vec::new(),
                user_sentiment: Sentiment::Neutral,
                ongoing_tasks: Vec::new(),
                mentioned_entities: Vec::new(),
                last_message_timestamp: ic_cdk::api::time(),
            });
            
            // Update thread with current conversation
            thread.last_message_timestamp = ic_cdk::api::time();
            if user_message.len() > thread.topic.len() {
                thread.topic = extract_conversation_topic(&user_message);
            }
            
            // Update learning patterns
            kg.learning_patterns.interaction_count += 1;
            kg.last_updated = ic_cdk::api::time();
        }
        
        // Save both user message and AI response
        let conversation = state.conversations.entry(user).or_insert_with(Vec::new);
        
        // Save user message
        let user_msg = EnhancedChatMessage {
            role: "user".to_string(),
            content: user_message,
            timestamp: ic_cdk::api::time(),
            provider: "user".to_string(),
            context_thread_id: context_thread_id.clone(),
            extracted_facts: extracted_facts.clone(),
            referenced_memories: Vec::new(),
            learned_preferences: Vec::new(),
            user_sentiment: Some(Sentiment::Neutral),
            response_strategy: None,
            cycles_cost: Some(0),
            content_stored_on_chain: Some(false),
            ii_verified: Some(true),
        };
        conversation.push(user_msg);
        
        // Save AI response
        let ai_msg = EnhancedChatMessage {
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
        conversation.push(ai_msg);
        
        // Update metrics
        state.canister_metrics.total_queries += 1;
        state.canister_metrics.learning_events += 1;
    });
}

fn extract_conversation_topic(message: &str) -> String {
    // Extract topic from message - simplified implementation
    let words: Vec<&str> = message.split_whitespace().take(5).collect();
    if words.is_empty() {
        "General conversation".to_string()
    } else {
        words.join(" ")
    }
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
    memory_mind_prompt(prompt_text, vec![], vec![true]).await
}

// Enhanced ICP functions with MemoryMind integration
#[ic_cdk::update]
async fn icp_ai_prompt(
    prompt_text: String,
    _provider: Option<String>,
    _assistant_type: Option<String>,
    _store_on_chain: Option<bool>,
) -> Result<String, String> {
    memory_mind_prompt(prompt_text, vec![], vec![true]).await
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
            if let Some(response_prefs) = profile_update.response_preferences {
                kg.user_profile.response_preferences = response_prefs;
            }
            kg.last_updated = ic_cdk::api::time();
            Ok("Profile updated successfully".to_string())
        } else {
            Err("User knowledge graph not found".to_string())
        }
    })
}

#[derive(CandidType, Deserialize, Clone)]
struct UserProfileUpdate {
    name: Option<String>,
    interests: Option<Vec<String>>,
    goals: Option<Vec<PersonalGoal>>,
    response_preferences: Option<ResponsePreferences>,
}

// Function to retrieve user conversations
#[ic_cdk::query]
fn get_user_conversations(user: Principal) -> Vec<EnhancedChatMessage> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Vec::new();
    }

    STATE.with(|state| {
        state
            .borrow()
            .conversations
            .get(&user)
            .cloned()
            .unwrap_or_else(Vec::new)
    })
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

#[ic_cdk::update]
fn update_user_preferences(user: Principal, preferences: ResponsePreferences) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            kg.user_profile.response_preferences = preferences;
            kg.last_updated = ic_cdk::api::time();
            Ok("Preferences updated successfully".to_string())
        } else {
            // Create new knowledge graph if it doesn't exist
            ensure_user_knowledge_graph(user);
            if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
                kg.user_profile.response_preferences = preferences;
                kg.last_updated = ic_cdk::api::time();
                Ok("Preferences updated successfully".to_string())
            } else {
                Err("Failed to create user profile".to_string())
            }
        }
    })
}

#[ic_cdk::update]
async fn save_conversation(user: Principal, message: EnhancedChatMessage) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        let conversation = state.conversations.entry(user).or_insert_with(Vec::new);
        conversation.push(message);
        state.canister_metrics.total_queries += 1;
    });
    
    Ok("Conversation saved successfully".to_string())
}

#[ic_cdk::query]
fn get_ai_coach_suggestions(user: Principal, context: String) -> Result<Vec<String>, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let mut suggestions = Vec::new();
            
            // Generate suggestions based on user's goals and context
            for goal in &kg.user_profile.goals {
                if goal.progress < 1.0 {
                    suggestions.push(format!("Continue working on: {}", goal.goal));
                }
            }
            
            // Add context-specific suggestions
            if context.to_lowercase().contains("project") {
                suggestions.push("Break down your project into smaller, manageable tasks".to_string());
                suggestions.push("Set specific deadlines for each milestone".to_string());
            }
            
            if context.to_lowercase().contains("learning") {
                suggestions.push("Practice regularly with small, consistent sessions".to_string());
                suggestions.push("Find a study buddy or accountability partner".to_string());
            }
            
            if suggestions.is_empty() {
                suggestions.push("Set clear, measurable goals for your projects".to_string());
                suggestions.push("Track your progress regularly".to_string());
                suggestions.push("Celebrate small wins along the way".to_string());
            }
            
            Ok(suggestions)
        } else {
            Ok(vec!["Start by setting some personal goals to get personalized coaching".to_string()])
        }
    })
}

#[ic_cdk::update]
fn create_smart_routine(user: Principal, routine: SmartRoutine) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            // Store routine as a special memory node
            let routine_node = MemoryNode {
                id: format!("routine_{}_{}", user.to_text(), ic_cdk::api::time()),
                content: format!("Smart Routine: {} - {}", routine.name, routine.description),
                node_type: MemoryNodeType::Context,
                importance_score: 0.8,
                created_at: ic_cdk::api::time(),
                last_accessed: ic_cdk::api::time(),
                access_count: 1,
                tags: vec!["routine".to_string(), routine.category.clone()],
                related_conversations: Vec::new(),
            };
            kg.memory_nodes.insert(routine_node.id.clone(), routine_node);
            kg.last_updated = ic_cdk::api::time();
            Ok("Smart routine created successfully".to_string())
        } else {
            Err("User profile not found".to_string())
        }
    })
}

#[ic_cdk::query]
fn get_user_routines(user: Principal) -> Result<Vec<SmartRoutine>, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let routines: Vec<SmartRoutine> = kg.memory_nodes.values()
                .filter(|node| node.tags.contains(&"routine".to_string()))
                .map(|node| SmartRoutine {
                    id: node.id.clone(),
                    name: extract_routine_name(&node.content),
                    description: extract_routine_description(&node.content),
                    category: node.tags.iter().find(|&tag| tag != "routine").unwrap_or(&"general".to_string()).clone(),
                    frequency: "daily".to_string(), // Default frequency
                    is_active: true,
                    created_at: node.created_at,
                    last_completed: None,
                })
                .collect();
            Ok(routines)
        } else {
            Ok(Vec::new())
        }
    })
}

#[ic_cdk::update]
fn create_milestone_capsule(user: Principal, capsule: MilestoneCapsule) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            let capsule_node = MemoryNode {
                id: format!("capsule_{}_{}", user.to_text(), ic_cdk::api::time()),
                content: format!("Milestone Capsule: {} - {}", capsule.title, capsule.content),
                node_type: MemoryNodeType::Experience,
                importance_score: 0.9,
                created_at: ic_cdk::api::time(),
                last_accessed: ic_cdk::api::time(),
                access_count: 1,
                tags: vec!["milestone".to_string(), "capsule".to_string()],
                related_conversations: Vec::new(),
            };
            kg.memory_nodes.insert(capsule_node.id.clone(), capsule_node);
            kg.last_updated = ic_cdk::api::time();
            Ok("Milestone capsule created successfully".to_string())
        } else {
            Err("User profile not found".to_string())
        }
    })
}

#[ic_cdk::query]
fn get_user_milestone_capsules(user: Principal) -> Result<Vec<MilestoneCapsule>, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let capsules: Vec<MilestoneCapsule> = kg.memory_nodes.values()
                .filter(|node| node.tags.contains(&"capsule".to_string()))
                .map(|node| MilestoneCapsule {
                    id: node.id.clone(),
                    title: extract_capsule_title(&node.content),
                    content: extract_capsule_content(&node.content),
                    created_at: node.created_at,
                    unlock_date: node.created_at + (365 * 24 * 60 * 60 * 1_000_000_000), // 1 year later
                    is_unlocked: ic_cdk::api::time() >= (node.created_at + (365 * 24 * 60 * 60 * 1_000_000_000)),
                    tags: node.tags.clone(),
                })
                .collect();
            Ok(capsules)
        } else {
            Ok(Vec::new())
        }
    })
}

#[ic_cdk::update]
fn create_consent_link(user: Principal, consent: ConsentLink) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            let consent_node = MemoryNode {
                id: format!("consent_{}_{}", user.to_text(), ic_cdk::api::time()),
                content: format!("Consent Link: {} - Access: {}", consent.name, consent.access_level),
                node_type: MemoryNodeType::Context,
                importance_score: 0.7,
                created_at: ic_cdk::api::time(),
                last_accessed: ic_cdk::api::time(),
                access_count: 1,
                tags: vec!["consent".to_string(), "privacy".to_string()],
                related_conversations: Vec::new(),
            };
            kg.memory_nodes.insert(consent_node.id.clone(), consent_node);
            kg.last_updated = ic_cdk::api::time();
            Ok("Consent link created successfully".to_string())
        } else {
            Err("User profile not found".to_string())
        }
    })
}

#[ic_cdk::query]
fn get_user_consent_links(user: Principal) -> Result<Vec<ConsentLink>, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let consents: Vec<ConsentLink> = kg.memory_nodes.values()
                .filter(|node| node.tags.contains(&"consent".to_string()))
                .map(|node| ConsentLink {
                    id: node.id.clone(),
                    name: extract_consent_name(&node.content),
                    access_level: extract_consent_access_level(&node.content),
                    created_at: node.created_at,
                    expires_at: Some(node.created_at + (30 * 24 * 60 * 60 * 1_000_000_000)), // 30 days
                    is_active: true,
                })
                .collect();
            Ok(consents)
        } else {
            Ok(Vec::new())
        }
    })
}

#[ic_cdk::query]
fn search_user_memories(user: Principal, query: String, limit: Option<u32>) -> Result<Vec<MemoryNode>, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let query_lower = query.to_lowercase();
            let limit = limit.unwrap_or(20) as usize;
            
            let mut matching_memories: Vec<MemoryNode> = kg.memory_nodes.values()
                .filter(|node| {
                    node.content.to_lowercase().contains(&query_lower) ||
                    node.tags.iter().any(|tag| tag.to_lowercase().contains(&query_lower))
                })
                .cloned()
                .collect();
            
            // Sort by relevance (importance score and access count)
            matching_memories.sort_by(|a, b| {
                let score_a = a.importance_score + (a.access_count as f32 * 0.1);
                let score_b = b.importance_score + (b.access_count as f32 * 0.1);
                score_b.partial_cmp(&score_a).unwrap_or(std::cmp::Ordering::Equal)
            });
            
            matching_memories.truncate(limit);
            Ok(matching_memories)
        } else {
            Ok(Vec::new())
        }
    })
}

#[ic_cdk::query]
fn export_user_data(user: Principal) -> Result<UserDataExport, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            let conversations = state.conversations.get(&user).cloned().unwrap_or_default();
            
            Ok(UserDataExport {
                user_id: user.to_text(),
                knowledge_graph: kg.clone(),
                conversations,
                exported_at: ic_cdk::api::time(),
            })
        } else {
            Err("User data not found".to_string())
        }
    })
}

// Utility functions for parsing stored data
fn extract_routine_name(content: &str) -> String {
    if let Some(start) = content.find("Smart Routine: ") {
        let after_prefix = &content[start + 15..];
        if let Some(end) = after_prefix.find(" - ") {
            after_prefix[..end].to_string()
        } else {
            "Unnamed Routine".to_string()
        }
    } else {
        "Unnamed Routine".to_string()
    }
}

fn extract_routine_description(content: &str) -> String {
    if let Some(start) = content.find(" - ") {
        content[start + 3..].to_string()
    } else {
        content.to_string()
    }
}

fn extract_capsule_title(content: &str) -> String {
    if let Some(start) = content.find("Milestone Capsule: ") {
        let after_prefix = &content[start + 19..];
        if let Some(end) = after_prefix.find(" - ") {
            after_prefix[..end].to_string()
        } else {
            "Untitled Capsule".to_string()
        }
    } else {
        "Untitled Capsule".to_string()
    }
}

fn extract_capsule_content(content: &str) -> String {
    if let Some(start) = content.find(" - ") {
        content[start + 3..].to_string()
    } else {
        content.to_string()
    }
}

fn extract_consent_name(content: &str) -> String {
    if let Some(start) = content.find("Consent Link: ") {
        let after_prefix = &content[start + 14..];
        if let Some(end) = after_prefix.find(" - Access: ") {
            after_prefix[..end].to_string()
        } else {
            "Unnamed Consent".to_string()
        }
    } else {
        "Unnamed Consent".to_string()
    }
}

fn extract_consent_access_level(content: &str) -> String {
    if let Some(start) = content.find(" - Access: ") {
        content[start + 11..].to_string()
    } else {
        "read".to_string()
    }
}

// Document structure for get_documents function
#[derive(Serialize, Deserialize, Clone, CandidType, Debug)]
struct VoiceNote {
    id: String,
    content: String,
    transcript: Option<String>,
    created_at: u64,
    owner: Principal,
    duration_seconds: f32,
}

impl Default for VoiceNote {
    fn default() -> Self {
        Self {
            id: String::new(),
            content: String::new(),
            transcript: None,
            created_at: 0,
            owner: Principal::anonymous(),
            duration_seconds: 0.0,
        }
    }
}

// Get documents function implementation
#[ic_cdk::query]
fn get_documents(user: Principal) -> Vec<VoiceNote> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Vec::new();
    }
    
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(kg) = state.personal_knowledge_graphs.get(&user) {
            // Convert memory nodes to documents
            kg.memory_nodes.values()
                .map(|node| VoiceNote {
                    id: node.id.clone(),
                    content: node.content.clone(),
                    transcript: Some(format!("Memory: {}", node.content)),
                    created_at: node.created_at,
                    owner: user,
                    duration_seconds: 0.0,
                })
                .collect()
        } else {
            Vec::new()
        }
    })
}

#[allow(dead_code)]
fn extract_document_title(content: &str) -> String {
    // Extract first line or first 50 characters as title
    let lines: Vec<&str> = content.lines().collect();
    if let Some(first_line) = lines.first() {
        if first_line.len() > 50 {
            format!("{}...", &first_line[..50])
        } else {
            first_line.to_string()
        }
    } else if content.len() > 50 {
        format!("{}...", &content[..50])
    } else {
        content.to_string()
    }
}

// Voice processing endpoint
#[ic_cdk::update]
async fn process_voice_input(
    user: Principal,
    audio_data: Vec<u8>,
    language: String,
    format: String
) -> Result<String, String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }

    // Enhanced voice processing with memory storage
    let transcription = format!(
        "[Voice Input - {} bytes of {} audio in {}]",
        audio_data.len(),
        format,
        language
    );
    
    // Store voice input as memory node
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            let voice_node = MemoryNode {
                id: format!("voice_{}_{}", user.to_text(), ic_cdk::api::time()),
                content: transcription.clone(),
                node_type: MemoryNodeType::Context,
                importance_score: 0.6,
                created_at: ic_cdk::api::time(),
                last_accessed: ic_cdk::api::time(),
                access_count: 1,
                tags: vec!["voice".to_string(), "audio".to_string(), language.clone()],
                related_conversations: Vec::new(),
            };
            kg.memory_nodes.insert(voice_node.id.clone(), voice_node);
            kg.last_updated = ic_cdk::api::time();
        }
    });
    
    Ok(transcription)
}

// Enhanced voice settings for user preferences
#[ic_cdk::update]
fn update_voice_preferences(
    user: Principal,
    language: String,
    auto_transcribe: bool,
    voice_commands_enabled: bool
) -> Result<(), String> {
    let caller = ic_cdk::caller();
    if caller != user && !ic_cdk::api::is_controller(&caller) {
        return Err("Unauthorized".to_string());
    }

    STATE.with(|state| {
        let mut state = state.borrow_mut();
        
        if let Some(kg) = state.personal_knowledge_graphs.get_mut(&user) {
            // Update voice preferences in user profile
            kg.user_profile.voice_language = Some(language);
            kg.user_profile.auto_transcribe = Some(auto_transcribe);
            kg.user_profile.voice_commands_enabled = Some(voice_commands_enabled);
            kg.last_updated = ic_cdk::api::time();
            
            Ok(())
        } else {
            // Create new knowledge graph with voice preferences
            let mut new_kg = PersonalKnowledgeGraph::default();
            new_kg.user_profile.voice_language = Some(language);
            new_kg.user_profile.auto_transcribe = Some(auto_transcribe);
            new_kg.user_profile.voice_commands_enabled = Some(voice_commands_enabled);
            new_kg.last_updated = ic_cdk::api::time();
            
            state.personal_knowledge_graphs.insert(user, new_kg);
            Ok(())
        }
    })
}

ic_cdk::export_candid!();