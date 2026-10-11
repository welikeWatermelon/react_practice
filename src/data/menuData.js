// 카테고리 필터 버튼에 쓸 목록
export const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'coffee', label: '커피' },
  { key: 'tea', label: '티' },
  { key: 'dessert', label: '디저트' },
];

// 메뉴 마스터 데이터
// temp: 'hot'(따뜻하게만) | 'ice'(차갑게만) | 'both'(둘 다 가능) | null(온도 없음)
export const menuData = [
  { id: 1, name: '아메리카노', category: 'coffee', price: 4500, temp: 'both', soldOut: false, desc: '고소한 원두의 기본 커피' },
  { id: 2, name: '카페라떼', category: 'coffee', price: 5000, temp: 'both', soldOut: false, desc: '에스프레소와 우유의 조화' },
  { id: 3, name: '바닐라라떼', category: 'coffee', price: 5500, temp: 'ice', soldOut: false, desc: '달콤한 바닐라 시럽 추가' },
  { id: 4, name: '콜드브루', category: 'coffee', price: 5000, temp: 'ice', soldOut: true, desc: '12시간 저온 추출' },
  { id: 5, name: '얼그레이', category: 'tea', price: 4800, temp: 'hot', soldOut: false, desc: '베르가못 향의 홍차' },
  { id: 6, name: '유자차', category: 'tea', price: 5000, temp: 'both', soldOut: false, desc: '국산 유자청으로 만든 차' },
  { id: 7, name: '치즈케이크', category: 'dessert', price: 6500, temp: null, soldOut: false, desc: '진한 크림치즈 케이크' },
  { id: 8, name: '크루아상', category: 'dessert', price: 4000, temp: null, soldOut: false, desc: '버터 풍미 가득한 빵' },
];

// 서버에서 메뉴를 받아오는 척하는 함수
// shouldFail이 true면 실패(reject)하도록 해서 에러 화면도 연습할 수 있어요
export function fetchMenus(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('메뉴를 불러오지 못했습니다. (서버 오류)'));
      } else {
        resolve(menuData);
      }
    }, 800);
  });
}