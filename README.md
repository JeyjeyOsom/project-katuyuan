erDiagram
    BRAND ||--o| BRAND_GUIDELINE : "has one (Upsert)"
    BRAND ||--o{ ASSET : "owns (Full CRUD)"
    BRAND ||--o{ COMPLIANCE_CHECK : "generates (Append-only)"

    BRAND {
        uuid id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    BRAND_GUIDELINE {
        uuid id PK
        uuid brand_id FK
        text tone "e.g., formal, playful"
        jsonb banned_words
        jsonb preferred_phrases
        timestamp created_at
        timestamp updated_at
    }

    ASSET {
        uuid id PK
        uuid brand_id FK
        string file_name
        string file_path "Local Docker Volume Path"
        string file_type "mime type"
        jsonb tags
        timestamp created_at
        timestamp updated_at
    }

    COMPLIANCE_CHECK {
        uuid id PK
        uuid brand_id FK
        text input_text
        int tone_match_score
        jsonb flagged_inconsistencies
        jsonb suggestions
        timestamp created_at "Immutable - No updated_at"
    }
