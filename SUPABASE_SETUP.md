# Supabase Analytics 테이블 설정 가이드

## 문제 상황
Admin Dashboard에서 방문자 수, 말씀 뽑기 횟수 등이 0으로 표시되고, 브라우저 콘솔에 **409 Conflict** 에러가 발생합니다.

## 원인
Supabase 테이블이 생성되지 않았거나, RLS(Row Level Security) 정책이 설정되지 않아 익명 사용자가 데이터를 삽입할 수 없습니다.

## 해결 방법

### 1단계: Supabase 대시보드 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 에 로그인
2. `2026-message` 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2단계: SQL 실행

1. **New query** 버튼 클릭
2. 아래 파일의 내용을 복사하여 붙여넣기:
   ```
   supabase_analytics_setup.sql
   ```
3. **Run** 버튼 클릭 (또는 Cmd/Ctrl + Enter)

### 3단계: 확인

SQL 실행 후 다음을 확인하세요:

#### Table Editor에서 확인:
1. 왼쪽 메뉴 **Table Editor** 클릭
2. `analytics_visits` 테이블 존재 확인
3. `analytics_actions` 테이블 존재 확인

#### RLS 정책 확인:
1. 각 테이블 클릭
2. 상단 **Policies** 탭 클릭
3. 다음 정책들이 있는지 확인:
   - "Allow anonymous insert on analytics_visits"
   - "Allow anonymous insert on analytics_actions"
   - "Allow anonymous select on analytics_visits"
   - "Allow anonymous select on analytics_actions"

### 4단계: 테스트

1. 웹사이트 방문: https://365message.vercel.app/
2. 말씀 한 번 뽑기
3. Admin Dashboard 확인: https://365message.vercel.app/?admin=dashboard
4. 숫자가 업데이트되었는지 확인

## 예상 결과

- **Total Visits**: 1 이상
- **Total Draws**: 1 이상
- **Total Shares**: 0 이상
- **Most Popular Themes**: 데이터 표시

## 문제 해결

### 여전히 0이 표시되는 경우:

1. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - Supabase 관련 에러 메시지 확인

2. **Supabase API 키 확인**
   - Vercel 환경변수에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`가 올바르게 설정되어 있는지 확인

3. **RLS 정책 확인**
   - Table Editor → 테이블 선택 → Policies 탭
   - 정책이 `anon` 역할에 적용되어 있는지 확인

## 추가 정보

- 익명 사용자도 analytics 데이터를 삽입/조회할 수 있도록 RLS 정책이 설정됩니다
- 개인정보는 수집하지 않습니다 (user_agent, referrer만 저장)
- 인덱스가 자동으로 생성되어 대시보드 성능이 최적화됩니다
