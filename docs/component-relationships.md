# Moonwave Travel - 컴포넌트 관계도

## 🔗 컴포넌트 의존성 다이어그램

```mermaid
graph TD
    A[App.tsx] --> B[AuthProvider]
    A --> C[Router]
    A --> D[WaveBackground]
    
    C --> E[Home.tsx]
    C --> F[Login.tsx]
    C --> G[TripCreate.tsx]
    C --> H[TripDetail.tsx]
    C --> I[PlanDetail.tsx]
    C --> J[PlaceSearch.tsx]
    C --> K[TripMap.tsx]
    
    E --> L[GlassCard]
    E --> M[WaveButton]
    E --> N[TripCard]
    E --> O[useAuth]
    
    F --> L
    F --> M
    F --> D
    F --> O
    
    G --> L
    G --> M
    G --> O
    
    H --> L
    H --> M
    H --> N
    H --> P[PlanCard]
    H --> O
    
    I --> L
    I --> M
    I --> O
    
    J --> L
    J --> M
    J --> O
    
    K --> L
    K --> Q[TravelMap]
    K --> O
    
    L --> R[ui/card.tsx]
    M --> S[ui/button.tsx]
    N --> L
    P --> L
    Q --> T[Leaflet Map]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
    style H fill:#fff8e1
    style I fill:#f9fbe7
    style J fill:#fafafa
    style K fill:#f5f5f5
```

## 📊 데이터 플로우 다이어그램

```mermaid
flowchart LR
    A[User Action] --> B[AuthContext]
    B --> C[Firebase Auth]
    C --> D[User State]
    D --> E[Protected Routes]
    
    F[Firebase Firestore] --> G[Trip Data]
    G --> H[TripCard Components]
    H --> I[UI Updates]
    
    J[WaveBackground] --> K[Visual Effects]
    K --> L[User Experience]
    
    M[GlassCard] --> N[Design System]
    N --> O[Moonwave Style]
    
    P[WaveButton] --> Q[Interactive Elements]
    Q --> R[User Engagement]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
    style H fill:#fff8e1
    style I fill:#f9fbe7
    style J fill:#fafafa
    style K fill:#f5f5f5
    style L fill:#f0f4c3
    style M fill:#e8f5e8
    style N fill:#fff3e0
    style O fill:#fce4ec
    style P fill:#f1f8e9
    style Q fill:#e0f2f1
    style R fill:#fff8e1
```

## 🎯 페이지별 컴포넌트 사용 현황

```mermaid
graph LR
    subgraph "Home Page"
        A1[Home.tsx] --> B1[GlassCard]
        A1 --> C1[WaveButton]
        A1 --> D1[TripCard]
        A1 --> E1[Stats Cards]
    end
    
    subgraph "Login Page"
        A2[Login.tsx] --> B2[GlassCard]
        A2 --> C2[WaveButton]
        A2 --> D2[Form Inputs]
        A2 --> E2[WaveBackground]
    end
    
    subgraph "Trip Detail"
        A3[TripDetail.tsx] --> B3[GlassCard]
        A3 --> C3[WaveButton]
        A3 --> D3[PlanCard]
        A3 --> E3[Day Tabs]
    end
    
    subgraph "Plan Detail"
        A4[PlanDetail.tsx] --> B4[GlassCard]
        A4 --> C4[WaveButton]
        A4 --> D4[Form Components]
        A4 --> E4[Image Upload]
    end
    
    subgraph "Map View"
        A5[TripMap.tsx] --> B5[TravelMap]
        A5 --> C5[Leaflet]
        A5 --> D5[Map Markers]
        A5 --> E5[Plan List]
    end
    
    style A1 fill:#e3f2fd
    style A2 fill:#f3e5f5
    style A3 fill:#e8f5e8
    style A4 fill:#fff3e0
    style A5 fill:#fce4ec
```

## 🔄 상태 관리 플로우

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> LoginPage
    LoginPage --> Authenticating
    Authenticating --> Authenticated
    Authenticating --> LoginError
    LoginError --> LoginPage
    Authenticated --> HomePage
    HomePage --> TripList
    TripList --> TripDetail
    TripDetail --> PlanEdit
    PlanEdit --> TripDetail
    TripDetail --> MapView
    MapView --> TripDetail
    TripDetail --> HomePage
    HomePage --> Logout
    Logout --> Unauthenticated
    
    note right of Authenticated
        Firebase Auth State
        User Data Loaded
        Sample Data Initialized
    end note
    
    note right of HomePage
        WaveBackground Active
        GlassCard Animations
        Real-time Data Sync
    end note
```

## 🎨 디자인 시스템 계층

```mermaid
graph TD
    A[Moonwave Design System] --> B[WaveBackground]
    A --> C[GlassCard]
    A --> D[WaveButton]
    A --> E[Typography]
    A --> F[Color Palette]
    A --> G[Animations]
    
    B --> H[Canvas Animation]
    B --> I[Wave Effects]
    
    C --> J[Backdrop Blur]
    C --> K[Border Effects]
    C --> L[Shadow System]
    
    D --> M[Ripple Effects]
    D --> N[Hover States]
    D --> O[Loading States]
    
    E --> P[Font Weights]
    E --> Q[Line Heights]
    E --> R[Letter Spacing]
    
    F --> S[Primary Colors]
    F --> T[Secondary Colors]
    F --> U[Gradient System]
    
    G --> V[Fade In]
    G --> W[Slide Up]
    G --> X[Bounce Gentle]
    G --> Y[Wave Pulse]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
```

## 📱 반응형 구조

```mermaid
graph LR
    A[Device Detection] --> B[Mobile Layout]
    A --> C[Tablet Layout]
    A --> D[Desktop Layout]
    
    B --> E[Single Column]
    B --> F[Bottom Navigation]
    B --> G[Touch Optimized]
    
    C --> H[Two Column Grid]
    C --> I[Sidebar Navigation]
    C --> J[Medium Touch Targets]
    
    D --> K[Three Column Grid]
    D --> L[Top Navigation]
    D --> M[Hover Effects]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
    style H fill:#fff8e1
    style I fill:#f9fbe7
    style J fill:#fafafa
    style K fill:#f5f5f5
    style L fill:#f0f4c3
    style M fill:#e8f5e8
```

## 🔧 기술 스택 통합

```mermaid
graph TD
    A[React 19] --> B[TypeScript]
    A --> C[Vite]
    A --> D[Tailwind CSS]
    
    B --> E[Type Safety]
    B --> F[IntelliSense]
    
    C --> G[Fast Development]
    C --> H[HMR]
    C --> I[Optimized Build]
    
    D --> J[Utility Classes]
    D --> K[Custom Theme]
    D --> L[Responsive Design]
    
    M[Firebase] --> N[Authentication]
    M --> O[Firestore]
    M --> P[Storage]
    
    Q[Radix UI] --> R[Accessibility]
    Q --> S[Unstyled Components]
    Q --> T[Design System]
    
    U[Leaflet] --> V[Map Display]
    U --> W[Markers]
    U --> X[Interactions]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
    style G fill:#e0f2f1
    style H fill:#fff8e1
    style I fill:#f9fbe7
    style J fill:#fafafa
    style K fill:#f5f5f5
    style L fill:#f0f4c3
    style M fill:#e8f5e8
    style N fill:#fff3e0
    style O fill:#fce4ec
    style P fill:#f1f8e9
    style Q fill:#e0f2f1
    style R fill:#fff8e1
    style S fill:#f9fbe7
    style T fill:#fafafa
    style U fill:#f5f5f5
    style V fill:#f0f4c3
    style W fill:#e8f5e8
    style X fill:#fff3e0
```

이 다이어그램들은 Moonwave Travel 앱의 복잡한 컴포넌트 관계와 데이터 플로우를 시각적으로 표현하여 개발자들이 전체 아키텍처를 쉽게 이해할 수 있도록 도와줍니다.
