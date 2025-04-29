use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
pub fn tfidf(term: &str, document: &str) -> f64 {
    let term = term.to_lowercase();
    let document = document.to_lowercase();
    let words: Vec<&str> = document.split_whitespace().collect();
    
    // Term Frequency (TF)
    let term_count = words.iter().filter(|&&w| w == term).count() as f64;
    let total_words = words.len() as f64;
    let tf = if total_words > 0 { term_count / total_words } else { 0.0 };

    // Inverse Document Frequency (IDF) - simplified
    let idf = 1.0; // Assume single document for simplicity
    
    tf * idf
}

#[wasm_bindgen]
pub fn document_tfidf(sentence: &str, documents: Vec<JsValue>) -> f64 {
    let sentence = sentence.to_lowercase();
    let words: Vec<&str> = sentence.split_whitespace().collect();
    
    let mut total_score = 0.0;
    for word in words {
        let mut word_score = 0.0;
        for doc in &documents {
            let doc_str = doc.as_string().unwrap_or_default().to_lowercase();
            word_score += tfidf(word, &doc_str);
        }
        total_score += word_score / documents.len() as f64;
    }
    
    total_score
}