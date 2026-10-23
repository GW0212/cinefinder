Cinefinder image QA / 테스트 범위

{
  "input_file": "ratings-2026-08-27-08-57-19.json",
  "rating_count": 1233,
  "type_counts": {
    "movie": 1014,
    "drama": 172,
    "anime": 47
  },
  "numeric_ids": 750,
  "opaque_ids": 483,
  "poster_urls_present": 0,
  "synthetic_schema_test_count": 2000,
  "live_TMDb_image_checks": 0,
  "note": "No live TMDB image or random catalog download checks were possible. Synthetic 2000 records are a local schema stress test, not poster retrieval verification."
}

Ratings JSON에는 이미지 경로가 없습니다. 현재 브라우저의 기존 rating cache가 이미지 출처입니다. 외부 이미지 3233개를 다운로드해서 확인했다고 주장하지 않습니다.
