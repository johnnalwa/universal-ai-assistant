use candid::{CandidType, Nat};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod,
};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

// State to hold the API key
#[derive(Serialize, Deserialize, Clone, CandidType, Default)]
struct State {
    api_key: String,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

// Gemini API request/response structures
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
    role: String,
}

#[derive(Deserialize, Debug)]
struct PartResponse {
    text: String,
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
fn set_api_key(key: String) {
    let caller = ic_cdk::caller();
    if ic_cdk::api::is_controller(&caller) {
        STATE.with(|state| state.borrow_mut().api_key = key);
        ic_cdk::println!("API key set successfully");
    } else {
        ic_cdk::trap("Only a controller can set the API key.");
    }
}

#[ic_cdk::update]
async fn prompt(prompt_text: String) -> Result<String, String> {
    let api_key = STATE.with(|state| state.borrow().api_key.clone());
    if api_key.is_empty() {
        return Err("API key is not set. Please call set_api_key first.".to_string());
    }

    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={}",
        api_key
    );

    let request_body = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt_text }],
        }],
    };

    let request_body_bytes = serde_json::to_vec(&request_body)
        .map_err(|e| format!("Serialization error: {}", e))?;

    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::POST,
        body: Some(request_body_bytes),
        max_response_bytes: Some(8192),
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
                    .map_err(|e| {
                        format!(
                            "Failed to parse response: {} Body: {}",
                            e,
                            String::from_utf8_lossy(&response.body)
                        )
                    })?;

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

ic_cdk::export_candid!();
