#!/bin/bash
# ============================================================
#  상세페이지 메이커 실행 스크립트 (더블클릭)
#  - 로컬 웹서버를 켜고 브라우저를 자동으로 엽니다.
#  - 종료하려면 이 창을 닫거나 Ctrl+C 를 누르세요.
# ============================================================
cd "$(dirname "$0")"

PORT=8765
URL="http://localhost:${PORT}/index.html"

echo "🌍 상세페이지 메이커를 시작합니다..."
echo "   주소: ${URL}"
echo "   (이 창을 닫으면 종료됩니다)"
echo ""

# 브라우저 열기 (서버가 뜰 시간을 약간 줌)
( sleep 1; open "${URL}" ) &

# 파이썬 간이 서버 실행
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server ${PORT}
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer ${PORT}
else
  echo "⚠️  파이썬이 설치되어 있지 않습니다."
  echo "    터미널에서 'python3 --version' 으로 확인하거나 관리자에게 문의하세요."
  read -n 1 -s -r -p "아무 키나 누르면 닫힙니다..."
fi
